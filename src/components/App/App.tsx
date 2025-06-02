import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import type { MovieResponse } from '../../types/movie';
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
      
     
      {!isLoading && !isFetching && !isError && movies.length === 0 && searchQuery && (
        <p className={styles.noResultsMessage}>На жаль, за вашим запитом "{searchQuery}" нічого не знайдено.</p>
      )}

      
      {totalPages > 1 && searchQuery && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageChange}
          forcePage={page - 1} // ReactPaginate використовує 0-based index
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


// export default function App() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(0);

//   const handleSearch = async (query: string) => {
//     setLoading(true);
//     setError(false);
//     setMovies([]); 
//     setPage(1);

//      try {
     
//       const { results, total_pages } = await fetchMovies(query, page); 

//       if (results.length === 0) {
//         toast.error('No movies found for your request.');
//       }
//       setMovies(results);
//        setTotalPages(total_pages); 
//       setMovies(results);
//     } catch {
//       setError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSelect = (movie: Movie) => {
//     setSelectedMovie(movie);
//   };

//   const handleCloseModal = () => {
//     setSelectedMovie(null);
//   };

//   return (
//     <>
//       <Toaster position="top-right" />
//       <SearchBar onSubmit={handleSearch} />
//       {loading && <Loader />}
//       {error && <ErrorMessage />}
//       {!loading && !error && movies.length > 0 && (
//         <MovieGrid movies={movies} onSelect={handleSelect} />
//       )}
//       {selectedMovie && (
//         <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
//       )}
//       {data.total_pages > 1 && (
//         <ReactPaginate
//           pageCount={data.total_pages}
//           pageRangeDisplayed={5}
//           marginPagesDisplayed={1}
//           onPageChange={({ selected }) => setPage(selected + 1)}
//           forcePage={page - 1}
//           containerClassName={css.pagination}
//           activeClassName={css.active}
//           nextLabel="→"
//           previousLabel="←"
//         />
//       )}
//     </>
//   );
// }