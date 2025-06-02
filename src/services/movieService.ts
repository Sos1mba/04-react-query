
import axios from 'axios';
import type { MovieResponse } from '../types/movie'; // <--- CHANGED TO THIS


export const fetchMovies = async (query: string, page: number): Promise<MovieResponse> => {
 
  const response = await axios.get<MovieResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query: query,
        page: page 
      },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTExY2RkMDg1OTdjNDhkODVjMzAxNjcxZmZjOWRhNCIsIm5iZiI6MTc0ODI2OTg0MC43NTQsInN1YiI6IjY4MzQ3YjEwNDQwYzA3OGM2YmI2YjhiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.LkEAHPXcEy94otQvDCywlp1CIn4zQNjgSYtjmBjNfbQ`,
      },
    }
  );
  return response.data;
};