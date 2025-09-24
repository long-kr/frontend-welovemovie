import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './home/HomePage';
import MovieDetailPage from './movie/MoviePage';
import ListMoviesPage from './movies/MoviesPage';
import Header from './shared/Header';
import TheaterList from './theaters/TheaterPage';
import { useEffect } from 'react';

function printHelloWithHash() {
  const pattern = [
    '#   #  #####  #      #      #####',
    '#   #  #      #      #      #   #',
    '#####  #####  #      #      #   #',
    '#   #  #      #      #      #   #',
    '#   #  #####  #####  #####  #####',
  ];

  pattern.forEach(line => console.log(line));
}

export default function App() {
  useEffect(() => {
    printHelloWithHash();
  }, []);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<ListMoviesPage />} />
        <Route path="/movies/:movieId" element={<MovieDetailPage />} />
        <Route path="/theaters" element={<TheaterList />} />
      </Routes>
    </Router>
  );
}
