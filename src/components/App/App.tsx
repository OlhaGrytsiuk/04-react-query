import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import styles from './App.module.css';
import { fetchMovies } from '../../services/movieService';
import type { Movie, MoviesResponse } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isFetching, isError, isSuccess } = useQuery<MoviesResponse>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const movies: Movie[] = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter your search query.', { id: 'empty', duration: 1000 });
      return;
    }
    setQuery(searchQuery);
    setPage(1);
  };

 useEffect(() => {
  if (!query) return;

  if (!isFetching && isSuccess) {
    if ((data?.results?.length ?? 0) === 0) {
      toast.error('No movies found for your request.', { id: 'no-results', duration: 1000 });
    }
  }
}, [query, isFetching, isSuccess, data]);

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={handleSearch} />

      {isFetching && <Loader />}
      {isError && <ErrorMessage />}

       {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {!isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
