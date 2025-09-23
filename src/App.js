import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
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

      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>

        <Route exact path="/movies">
          <ListMoviesPage />
        </Route>

        <Route exact path="/movies/:movieId">
          <MovieDetailPage />
        </Route>

        <Route exact path="/theaters">
          <TheaterList />
        </Route>
      </Switch>
    </Router>
  );
}
