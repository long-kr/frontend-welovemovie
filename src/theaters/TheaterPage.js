import { useTheaters } from '../hooks';
import ErrorAlert from '../shared/ErrorAlert';
import { Loading } from '../ui';
import Theater from './Theater';

export default function TheaterPage() {
  const { theaters, isLoading, error } = useTheaters();

  const list = theaters.map(theater => (
    <Theater key={theater.theater_id} theater={theater} />
  ));

  return (
    <main className="container">
      <ErrorAlert error={error} />

      <h2 className="font-poppins">All Theaters</h2>
      <hr />

      {isLoading ? <Loading /> : <section className="row">{list}</section>}
    </main>
  );
}
