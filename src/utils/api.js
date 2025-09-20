import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append('Content-Type', 'application/json');

const defaultOnCancel = () => {
  console.log('Request cancelled');
};
/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param {URL} url
 *  the url for the requst.
 * @param {object} [options]
 *  any options for fetch
 * @param {function} [onCancel]
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options = {}, onCancel = defaultOnCancel) {
  try {
    const response = await axios({
      url: url.toString(),
      method: options?.method ?? 'GET',
      headers: options?.headers,
      data: JSON.stringify(options?.body),
      ...options,
    });

    if (response.status === 204) return null;

    return response.data;
  } catch (error) {
    if (error.name !== 'CanceledError') {
      console.error(error.stack);
      throw error;
    }

    return onCancel();
  }
}

/**
 *  Populates the `reviews` property of a movie with its reviews
 * @param {AbortController} signal
 * @returns {() => Promise<movie>}
 */
function populateReviews(signal) {
  return async movie => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/reviews`;
    const res = await fetchJson(url, { headers, signal }, []);
    movie.reviews = res.data;
    return movie;
  };
}

function populateTheaters(signal) {
  return async movie => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/theaters`;
    const res = await fetchJson(url, { headers, signal }, []);
    movie.theaters = res.data;
    return movie;
  };
}

export async function deleteReview(reviewId) {
  const url = `${API_BASE_URL}/reviews/${reviewId}`;
  return await fetchJson(url, { method: 'DELETE', headers }, {});
}

export async function updateReview(reviewId, data) {
  const url = `${API_BASE_URL}/reviews/${reviewId}`;
  const options = {
    method: 'PUT',
    headers,
    body: data,
  };
  return await fetchJson(url, options, {});
}

export const movieKeys = {
  all: ['movies'],
  lists: () => ({
    queryKey: [...movieKeys.all, 'list'],
    queryFn: ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/movies`);
      const data = fetchJson(url, { signal });
      return data;
    },
  }),
  detail: movieId => ({
    queryKey: [...movieKeys.all, 'detail', movieId],
    queryFn: async ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/movies/${movieId}`);
      const res = await fetchJson(url, { signal });
      const movie = res.data;
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
    queryFn: async ({ signal }) => {
      const url = new URL(`${API_BASE_URL}/theaters`);
      const data = await fetchJson(url, { headers, signal });
      return data;
    },
  }),
};
