import { useMutation, useQueryClient } from 'react-query';
import { updateReview, movieKeys } from '../utils/api';

export const useReviews = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isLoading: isUpdating,
    error: mutateError,
  } = useMutation({
    mutationFn: ({ reviewId, score }) => {
      return updateReview(reviewId, score);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        movieKeys.detail(variables.movieId).queryKey
      );
    },
    onError: error => {
      console.error('Error updating review:', error);
    },
  });

  return {
    mutate,
    isUpdating,
    mutateError,
  };
};
