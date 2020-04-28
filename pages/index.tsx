import Layout from '../components/Layout';
import Map from '../components/Map';
import flights from '../utils/20200101.json';
import { Flight } from '../interfaces/flight';

const IndexPage = () => (
  <Layout title='Home | Next.js + TypeScript Example'>
    <Map flightData={flights as Flight[]} />
  </Layout>
);

export default IndexPage;
