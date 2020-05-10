import { ResponsiveBar } from '@nivo/bar';
import { styled } from 'baseui';
import timeSeriesData from '../utils/time-series.json';

const processedData = timeSeriesData.map(({ date, ...others }) => ({
  date: date.toString(),
  ...others,
}));

const ChartContainer = styled('div', ({ $theme }) => ({
  height: '45px',
  paddingTop: $theme.sizing.scale400,
  width: '100%',
}));

const SimpleTimeSeries: React.FC = () => (
  <ChartContainer>
    <ResponsiveBar
      data={processedData}
      indexBy='date'
      keys={['totalFlightsCount']}
      colors={() => '#afafaf'}
      enableGridY={false}
      enableLabel={false}
      isInteractive={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      animate
      motionStiffness={90}
      motionDamping={15}
    />
  </ChartContainer>
);

export default SimpleTimeSeries;
