import { styled, useStyletron } from 'baseui';
import { Slider, State } from 'baseui/slider';
import { Label3 } from 'baseui/typography';
import React, { useCallback, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { Flight } from '../interfaces/flight';
import SimpleTimeSeries from './SImpleTimeSeries';

const SliderContainer = styled('div', ({
  alignItems: 'center',
  backgroundColor: 'rgba(31, 31, 31, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  width: '100%',
  zIndex: 1,

  '@media (min-width: 768px)': {
    flex: 1,
    margin: '1rem 1rem 1rem 0',
  },
}));

interface DateSliderProps {
  range: [number, number];
  onFilter: (value: number) => void;
  flightData: Flight[];
}

const MIN_DATE = 1577808000; // 2020-01-01, 12AM SGT
const SECONDS_PER_DAY = 86400; // 84600 seconds = 24 hours

const DateSlider: React.FC<DateSliderProps> = ({ range, onFilter }) => {
  const onSlide = new Subject<State>();
  // const convertToDayStart = (epochTime: number) => new Date(new Date(Number(epochTime * 1000)).setHours(0, 0, 0));
  const convertToDayEnd = (epochTime: number) => {
    const nextDay = new Date(Number(epochTime * 1000));
    nextDay.setDate(nextDay.getDate() + 1);
    return new Date(nextDay.setHours(0, 0, 0));
  };
  const max = convertToDayEnd(range[1]).getTime() / 1000;
  const [css, theme] = useStyletron();
  const [filteredDate, setFilteredDate] = useState([max]);

  const handleChange = useCallback(({ value }: State) => {
    onFilter(value[0]);
  }, [onFilter]);

  useEffect(() => {
    handleChange({
      value: [max],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onSlide.pipe(
      tap(({ value }) => setFilteredDate(value)),
      debounceTime(100),
    ).subscribe(handleChange);
  }, [handleChange, onSlide]);

  return (
    <SliderContainer>
      <SimpleTimeSeries />
      <Slider
        value={filteredDate}
        min={MIN_DATE}
        max={max}
        step={SECONDS_PER_DAY}
        onChange={(e) => onSlide.next(e)}
        overrides={{
          Root: {
            style: () => ({
              width: '90%',
            }),
          },
          ThumbValue: ({ $value }) => (
            <Label3
              overrides={{
                Block: {
                  style: {
                    position: 'absolute',
                    top: `-${theme.sizing.scale800}`,
                    ...theme.typography.font200,
                    backgroundColor: 'transparent',
                  },
                },
              }}
            >
              {(new Date(Number($value[0] * 1000))).toLocaleDateString('en-GB')}
            </Label3>
          ),
          TickBar: ({ $max }) => (
            <div
              className={css({
                color: theme.colors.primaryA,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: theme.sizing.scale600,
                paddingLeft: theme.sizing.scale600,
                paddingBottom: theme.sizing.scale400,
              })}
            >
              <Label3>{new Date(MIN_DATE * 1000).toLocaleDateString('en-GB')}</Label3>
              <Label3>{convertToDayEnd($max).toLocaleDateString('en-GB')}</Label3>
            </div>
          ),
        }}
      />
    </SliderContainer>
  );
};

export default DateSlider;
