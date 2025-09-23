import { useQuery } from 'react-query';
import { theaterKeys } from '../utils/api';

export const useTheaters = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: theaterKeys.lists().queryKey,
    queryFn: theaterKeys.lists().queryFn,
  });

  return {
    theaters: data?.data || [],
    isLoading,
    error,
  };
};
