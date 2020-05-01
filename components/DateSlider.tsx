import { useStyletron } from 'baseui';
import { Slider, State } from 'baseui/slider';
import React, { useEffect, useState } from 'react';
import { styled } from 'styletron-react';

const SliderContainer = styled('div', () => ({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

interface DateSliderProps {
  range: [number, number];
  onFilter: (value: number) => void;
}

const DateSlider: React.FC<DateSliderProps> = ({ range, onFilter }) => {
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

  const handleChange = ({ value }: State) => {
    setFilteredDate(value);
    onFilter(value[0]);
  };

  useEffect(() => {
    handleChange({
      value: [max],
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SliderContainer>
      <Slider
        value={filteredDate}
        min={min}
        max={max}
        step={86400}
        onChange={handleChange}
        overrides={{
          Root: {
            style: () => ({
              width: '80%',
            }),
          },
          ThumbValue: ({ $value }) => (
            <div
              className={css({
                position: 'absolute',
                top: `-${theme.sizing.scale800}`,
                ...theme.typography.font200,
                backgroundColor: 'transparent',
              })}
            >
              {(new Date(Number($value[0] * 1000))).toLocaleDateString('en-GB')}
            </div>
          ),
          TickBar: ({ $min, $max }) => (
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingRight: theme.sizing.scale600,
                paddingLeft: theme.sizing.scale600,
                paddingBottom: theme.sizing.scale400,
              })}
            >
              <div>{convertToDayStart($min).toLocaleDateString('en-GB')}</div>
              <div>{convertToDayEnd($max).toLocaleDateString('en-GB')}</div>
            </div>
          ),
        }}
      />
    </SliderContainer>
  );
};

export default DateSlider;
