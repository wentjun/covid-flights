import { ResponsiveCalendar } from '@nivo/calendar';
import { styled, useStyletron } from 'baseui';
import timeSeriesData from '../utils/time-series.json';

const processedData = timeSeriesData.map(({ date, totalFlightsCount }) => ({
  day: new Date(date * 1000).toLocaleDateString('fr-CA'),
  value: totalFlightsCount,
}));

const ChartContainer = styled('div', ({ $theme }) => ({
  height: '40vh',
  paddingTop: $theme.sizing.scale100,
  width: '70vw',
}));

const Calendar: React.FC = () => {
  const [, theme] = useStyletron();

  return (
    <ChartContainer>
      <ResponsiveCalendar
        data={processedData}
        from='2020-01-01'
        to='2020-05-01'
        emptyColor={theme.colors.primary100}
        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
        margin={{
          top: 40,
          right: 40,
          bottom: 40,
          left: 40,
        }}
        yearSpacing={40}
        monthBorderColor={theme.colors.primary50}
        dayBorderWidth={2}
        dayBorderColor={theme.colors.primary50}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            translateY: 36,
            itemCount: 4,
            itemWidth: 42,
            itemHeight: 36,
            itemsSpacing: 14,
            itemDirection: 'right-to-left',
            itemTextColor: theme.colors.contentTertiary,
          },
        ]}
        theme={{
          axis: {
            ticks: {
              line: {
                stroke: theme.colors.contentTertiary,
              },
              text: {
                fill: theme.colors.contentTertiary,
              },
            },
            legend: {
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

export default Calendar;
