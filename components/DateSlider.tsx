import { useStyletron } from 'baseui';
import { Slider, State } from 'baseui/slider';
import React, { useEffect, useState } from 'react';
import { styled } from 'styletron-react';
import { Label3 } from 'baseui/typography';

const SliderContainer = styled('div', ({
  backgroundColor: 'rgba(31, 31, 31, 0.8)',
  zIndex: 1,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

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
