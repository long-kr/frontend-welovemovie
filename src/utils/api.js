import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Default headers for API calls (json-server friendly)
 * @type {{[k:string]: string}}
 */
export const defaultHeaders = { 'Content-Type': 'application/json' };

const defaultOnCancel = () => undefined;

/**
 * Helper typedef for react-query queryFn context
 * @typedef {{ signal?: AbortSignal }} QueryContext
 */

/**
 * Fetch JSON using axios. Accepts a string or URL.
 * @param {string|URL} url
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @param {string} [options.method]
 * @param {object} [options.headers]
 * @param {any} [options.body]
 * @param {function} [onCancel]
 * @returns {Promise<any>}
 */
async function fetchJson(url, options = {}, onCancel = defaultOnCancel) {
  try {
    const config = {
      url: String(url),
      method: (options.method ?? 'get').toUpperCase(),
      headers: options.headers ?? defaultHeaders,
      data: options.body,
      signal: options.signal,
      ...options,
    };

    const response = await axios(config);

    if (response.status === 204) return null;

    return response.data;
  } catch (error) {
    const err = /** @type {any} */ (error);
    const isCanceled =
      (axios.isCancel && axios.isCancel(err)) ||
      (err && (err.code === 'ERR_CANCELED' || err.name === 'CanceledError'));

    if (isCanceled) return onCancel();

    // eslint-disable-next-line no-console
    // console.error(err && (err.stack || err));
    throw err;
  }
}

/**
 * Populates the `reviews` property of a movie with its reviews
 * @param {AbortSignal} [signal]
 * @returns {(movie: any) => Promise<any>}
 */
function populateReviews(signal) {
  return async movie => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/reviews`;
    const res = await fetchJson(url, { signal });
    movie.reviews = res?.data ?? res;
    return movie;
  };
}

/**
 * Populates the `theaters` property of a movie with its theaters
 * @param {AbortSignal} [signal]
 * @returns {(movie: any) => Promise<any>}
 */
function populateTheaters(signal) {
  return async movie => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/theaters`;
    const res = await fetchJson(url, { signal });
    movie.theaters = res?.data ?? res;
    return movie;
  };
}

/**
 * Update a review by id
 * @param {number|string} reviewId
 * @param {any} data
 * @returns {Promise<any>}
 */
export async function updateReview(reviewId, data) {
  const url = `${API_BASE_URL}/reviews/${reviewId}`;
  const options = {
    method: 'PUT',
    body: { data },
  };
  return await fetchJson(url, options);
}

export const movieKeys = {
  all: ['movies'],
  lists: () => ({
    queryKey: [...movieKeys.all, 'list'],
    /** @param {QueryContext} __ */
    queryFn: ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/movies`);
      const data = fetchJson(url, { signal });
      return data;
    },
  }),
  /** @param {string|number} movieId */
  detail: movieId => ({
    queryKey: [...movieKeys.all, 'detail', movieId],
    /** @param {QueryContext} __ */
    queryFn: async ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/movies/${movieId}`);
      const res = await fetchJson(url, { signal });
      const movie = res?.data ?? res;
      const addReviews = populateReviews(signal);
      const addTheaters = populateTheaters(signal);
      const data = await addTheaters(await addReviews(movie));
      return data;
    },
  }),
};

export const theaterKeys = {
  all: ['theaters'],
  lists: () => ({
    queryKey: [...theaterKeys.all, 'list'],
    /** @param {QueryContext} __ */
    queryFn: async ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/theaters`);
      const data = await fetchJson(url, { signal });
      return data;
    },
  }),
};
