import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import type { MovieResponse } from '../../services/movieService';
import { useQuery,  keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';


export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [page, setPage] = useState<number>(1); 
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, error, isLoading, isError, isFetching } = useQuery<MovieResponse, Error>({
   
    queryKey: ['movies', searchQuery, page],
  
    queryFn: () => fetchMovies(searchQuery, page),
 
    enabled: !!searchQuery,
    placeholderData: keepPreviousData,
    retry: 2, 
  });
  const movies: Movie[] = data?.results || [];
  const totalPages: number = data?.total_pages || 0; 

  useEffect(() => {
  if (!isLoading && !isFetching && !isError && movies.length === 0 && searchQuery) {
    toast.error(`На жаль, за запитом "${searchQuery}" нічого не знайдено.`);
  }}, [movies.length, searchQuery, isLoading, isError, isFetching]);

 
  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };


  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1); 
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearchSubmit} /> 

  
      {(isLoading || isFetching) && <Loader />} 
      

       {error && <ErrorMessage />}
      
     
     

      
      {totalPages > 1 && searchQuery && (
        <ReactPaginate
          pageCount={totalPages} 
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1} 
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}

     
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}

      
    </>
  );
}


