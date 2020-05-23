import Layout from '../components/Layout';
import Map from '../components/Map';
import { Flight } from '../interfaces/flight';
import flights from '../utils/flights.json';

const IndexPage: React.FC = () => (
  <Layout title='COVID-19 Flights Analysis'>
    <Map flightData={flights as Flight[]} />
  </Layout>
);

export default IndexPage;
