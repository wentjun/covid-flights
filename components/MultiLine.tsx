import { styled, useStyletron } from 'baseui';
import { ResponsiveLine } from '@nivo/line';
import timeSeriesData from '../utils/time-series.json';

const processedData = [
  {
    id: 'total',
    data: timeSeriesData.map(({ date, totalFlightsCount }) => ({
      x: new Date(date * 1000).toLocaleDateString('fr-CA'),
      y: totalFlightsCount,
    })),
  },
  {
    id: 'arrival',
    data: timeSeriesData.map(({ date, arrivalCount }) => ({
      x: new Date(date * 1000).toLocaleDateString('fr-CA'),
      y: arrivalCount,
    })),
  },
  {
    id: 'departure',
    data: timeSeriesData.map(({ date, departureCount }) => ({
      x: new Date(date * 1000).toLocaleDateString('fr-CA'),
      y: departureCount,
    })),
  },
];

const ChartContainer = styled('div', ({ $theme }) => ({
  height: '50vh',
  paddingTop: $theme.sizing.scale100,
  width: '100%',
}));

const MultiLine: React.FC = () => {
  const [, theme] = useStyletron();

  return (
    <ChartContainer>
      <ResponsiveLine
        data={processedData}
        curve='monotoneX'
        enablePoints={false}
        enableGridX={false}
        enableGridY={false}
        margin={{
          top: 50,
          right: 110,
          bottom: 50,
          left: 60,
        }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Date',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Number of Flights',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel='y'
        pointLabelYOffset={-12}
        useMesh
        legends={[
          {
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            // translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'right-to-left',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            itemTextColor: theme.colors.primaryA,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        theme={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          crosshair: {
            line: {
              stroke: theme.colors.primaryA,
            },
          },
          axis: {
            ticks: {
              line: {
                stroke: theme.colors.contentTertiary,
              },
              text: {
                fill: theme.colors.contentTertiary,
              },
            },
          },
        }}
      />
    </ChartContainer>
  );
};

export default MultiLine;
