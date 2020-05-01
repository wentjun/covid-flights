import { styled } from 'baseui';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Display4, Label1, Label2 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Flight } from '../interfaces/flight';
import { FilterContext, PanelFilterCount } from './Map';

const InformationPanelContainer = styled('div', () => ({
  backgroundColor: 'rgba(20, 20, 20, 0.8)',
  boxSizing: 'border-box',
  height: '100%',
  margin: '1rem',
  width: '100%',
  zIndex: 1,

  '@media (min-width: 768px)': {
    width: '300px',
    height: 'calc(100% - 2rem)',
  },
}));

const AirlinesCountContainer = styled('div', ({
  maxHeight: '50%',
  overflowY: 'scroll',
}));

interface InformationPanelProps {
  data: Flight[];
  panelFilter?: PanelFilterCount[];
  filterContext: FilterContext;
  onAirlineFilter: (codes: string) => void;
}

const InformationPanel: React.FC<InformationPanelProps> = ({
  filterContext: { selectedDate }, panelFilter, data, onAirlineFilter,
}) => {
  const [localPanelFilter, setPanelFilter] = useState< PanelFilterCount[]>([]);
  useEffect(() => {
    if (!panelFilter) {
      return;
    }
    setPanelFilter(panelFilter);
  }, [panelFilter]);

  const onChecked = (airline: string, { target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
    onAirlineFilter(airline);
    setPanelFilter(localPanelFilter.map((option) => {
      const { icao } = option;
      if (icao === airline) {
        return {
          ...option,
          checked,
        };
      }

      return option;
    }));
  };

  return (
    <InformationPanelContainer>
      <Label1>{new Date(selectedDate * 1000).toLocaleDateString('en-GB')}</Label1>
      <Label2>Summary</Label2>
      <Display4>{data.length}</Display4>
      <Label2>flights</Label2>
      <Label1>Airlines</Label1>
      <AirlinesCountContainer>
        {
         localPanelFilter
           .sort(({ count }, { count: countB }) => countB - count)
           .map(({
             count, checked, name, icao,
           }) => (
             <Checkbox
               checked={checked}
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChecked(icao, e)}
               labelPlacement={LABEL_PLACEMENT.right}
               key={icao}
             >
               {name}
               {' '}
               (
               {count}
               )
             </Checkbox>
           )).sort()
        }
      </AirlinesCountContainer>

    </InformationPanelContainer>
  );
};
export default InformationPanel;
