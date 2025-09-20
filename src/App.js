import Header from './shared/Header';
import HomePage from './home/HomePage';
import ListMoviesPage from './movies/ListMoviesPage';
import MovieDetailPage from './movie/MovieDetailPage';
import TheaterList from './theaters/TheaterList';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
