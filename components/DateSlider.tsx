import React, { useState } from 'react';
import { Slider, State } from 'baseui/slider';
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
  const [filteredDate, setFilteredDate] = useState([range[1]]);

  const handleChange = ({ value }: State) => {
    setFilteredDate(value);
    onFilter(value[0]);
  };

  return (
    <SliderContainer>
      <Slider
        value={filteredDate}
        min={range[0]}
        max={range[1]}
        onChange={handleChange}
        overrides={{
          Root: {
            style: () => ({
              width: '80%',
            }),
          },
        }}
      />
    </SliderContainer>
  );
};

export default DateSlider;
