import { useMutation } from 'react-query';
import { updateReview } from '../utils/api';

export const useReviews = () => {
  const {
    mutate,
    isLoading: isUpdating,
    error: mutateError,
  } = useMutation({
    mutationFn: ({ reviewId, data }) => updateReview(reviewId, data),
  });

  return {
    mutate,
    isUpdating,
    mutateError,
  };
};
