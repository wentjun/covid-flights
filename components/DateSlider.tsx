import { useStyletron } from 'baseui';
import { Slider, State } from 'baseui/slider';
import { Label3 } from 'baseui/typography';
import React, { useEffect, useState, useCallback } from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { styled } from 'styletron-react';

const SliderContainer = styled('div', ({
  alignItems: 'center',
  backgroundColor: 'rgba(31, 31, 31, 0.8)',
  display: 'flex',
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
}

const DateSlider: React.FC<DateSliderProps> = ({ range, onFilter }) => {
  const onSlide = new Subject<State>();
  const convertToDayStart = (epochTime: number) => new Date(new Date(Number(epochTime * 1000)).setHours(0, 0, 0));
  const convertToDayEnd = (epochTime: number) => {
    const nextDay = new Date(Number(epochTime * 1000));
    nextDay.setDate(nextDay.getDate() + 1);
    return new Date(nextDay.setHours(0, 0, 0));
  };
  const min = convertToDayStart(range[0]).getTime() / 1000;
  const max = convertToDayEnd(range[1]).getTime() / 1000;

  const [css, theme] = useStyletron();
  const [filteredDate, setFilteredDate] = useState([max]);

  const handleChange = useCallback(({ value }: State) => {
    setFilteredDate(value);
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
      debounceTime(100),
    ).subscribe(handleChange);
  }, [handleChange, onSlide]);

  return (
    <SliderContainer>
      <Slider
        value={filteredDate}
        min={min}
        max={max}
        step={86400}
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
          TickBar: ({ $min, $max }) => (
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
              <Label3>{convertToDayStart($min).toLocaleDateString('en-GB')}</Label3>
              <Label3>{convertToDayEnd($max).toLocaleDateString('en-GB')}</Label3>
            </div>
          ),
        }}
      />
    </SliderContainer>
  );
};

export default DateSlider;
