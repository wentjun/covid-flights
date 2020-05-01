import Layout from '../components/Layout';
import Map from '../components/Map';
import { Flight } from '../interfaces/flight';
import flights from '../utils/20200101.json';

const IndexPage = () => (
  <Layout title='Home | Next.js + TypeScript Example'>
    <Map flightData={flights as Flight[]} />
  </Layout>
);

export default IndexPage;
