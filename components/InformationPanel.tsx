import { styled } from 'baseui';
import { Panel, StatelessAccordion } from 'baseui/accordion';
import { Button, KIND, SIZE } from 'baseui/button';
import { Checkbox, LABEL_PLACEMENT } from 'baseui/checkbox';
import { Display4, Label1, Label2 } from 'baseui/typography';
import React, { useEffect, useState } from 'react';
import { Flight } from '../interfaces/flight';
import { FilterContext, PanelFilterCount } from '../interfaces/main';

const InformationPanelContent = styled('div', ({
  flex: 1,
  overflowY: 'scroll',
}));

const CurrentDate = styled(Label1, ({ $theme }) => ({
  paddingBottom: $theme.sizing.scale600,
}));

const Summary = styled('div', ({ $theme }) => ({
  paddingBottom: $theme.sizing.scale600,
}));

const SummaryTitle = styled(Label1, ({ $theme }) => ({
  paddingBottom: $theme.sizing.scale300,
}));

const AirlinesFilterTitle = styled(Label1, ({ $theme }) => ({
  paddingBottom: $theme.sizing.scale300,
}));

interface InformationPanelProps {
  data: Flight[];
  panelFilter?: PanelFilterCount[];
  filterContext: FilterContext;
  onAirlineFilter: (codes: string) => void;
  setIsModalOpen: () => void;
}

const InformationPanel: React.FC<InformationPanelProps> = ({
  filterContext: { selectedDate }, panelFilter, data, onAirlineFilter, setIsModalOpen,
}) => {
  const [localPanelFilter, setPanelFilter] = useState< PanelFilterCount[]>([]);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState<React.Key[]>([]);

  useEffect(() => {
    const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (viewportWidth < 768) {
      return;
    }
    // set accordion as expanded by default for medium screens and above
    setIsAccordionExpanded(['controlPanel']);
  }, []);

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

  const isControlPanelExpanded = () => isAccordionExpanded.includes('controlPanel');

  return (
    <StatelessAccordion
      expanded={isAccordionExpanded}
      onChange={({ expanded }) => setIsAccordionExpanded(expanded)}
      overrides={{
        Root: {
          style: ({ $theme }) => ({
            alignSelf: 'flex-start',
            boxSizing: 'border-box',
            width: '100%',
            zIndex: 1,

            '@media (min-width: 768px)': {
              marginBottom: $theme.sizing.scale600,
              marginLeft: $theme.sizing.scale600,
              marginRight: $theme.sizing.scale600,
              marginTop: $theme.sizing.scale600,
              width: '300px',
            },
          }),
        },
      }}
    >
      <Panel
        title='Control Panel'
        key='controlPanel'
        overrides={{
          PanelContainer: {
            style: () => ({
              display: 'flex',
              flexDirection: 'column',
              height: isControlPanelExpanded() ? '65vh' : '',

              '@media (min-width: 768px)': {
                height: isControlPanelExpanded() ? 'calc(100vh - 2rem)' : '',
              },
            }),
          },
          Content: {
            style: () => ({
              backgroundColor: 'rgba(31, 31, 31, 0.8)',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }),
          },
        }}
      >
        <CurrentDate>{new Date(selectedDate * 1000).toLocaleDateString('en-GB')}</CurrentDate>
        <Button
          onClick={() => setIsModalOpen()}
          kind={KIND.secondary}
          size={SIZE.compact}
        >
          View Statistics
        </Button>
        <Summary>
          <SummaryTitle>Summary</SummaryTitle>
          <Display4>{data.length}</Display4>
          <Label2>flights</Label2>
        </Summary>
        <AirlinesFilterTitle>Airlines</AirlinesFilterTitle>
        <InformationPanelContent>
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
              ))
            }
        </InformationPanelContent>
      </Panel>
    </StatelessAccordion>
  );
};
export default InformationPanel;
