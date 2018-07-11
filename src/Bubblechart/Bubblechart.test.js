import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Bubblechart from './Bubblechart';
import Axis from './Axis';
import Tooltip from '../Tooltip/Tooltip';

Enzyme.configure({ adapter: new Adapter() });

describe('Bubblechart', () => {
  let props;
  let mountedChart;
  const bubbleChart = () => {
    if (!mountedChart) {
      mountedChart = mount(<Bubblechart {...props} />);
    }
    return mountedChart;
  };

  beforeEach(() => {
    props = {
      data: {},
      compareTracts: [],
      selectedMapVar: '',
      xAxisVar: '',
      yAxisVar: '',
    };
    mountedChart = undefined;
  });

  describe('when no data is received', () => {
    beforeEach(() => {
      props.data = {};
    });

    it('renders an empty paragraph element', () => {
      const p = bubbleChart().find('p');
      expect(p.length).toBe(1);
    });
  });

  describe('when data is received', () => {
    beforeEach(() => {
      props.data = {features: []};
    });

    it('renders a div container', () => {
      const chartDiv = bubbleChart().find('div');
      expect(chartDiv.length).toBe(2);
    
      describe('the rendered div contains chart svg and tooltip component', () => {
        expect(div.children()).toEqual(bubbleChart.children());

        describe('rendered axes', () => {
            it('receives 3 props', () => {
                const axis = bubbleChart.find(Axis);
                expect(Object.keys(axis.props()).length).toBe(3);
            });
        });

        describe('rendered tooltip', () => {
            it('receives 1 prop', () => {
                const tooltip = bubbleChart.find(Tooltip);
                expect(Object.keys(tooltip.props()).length).toBe(1);
            });
        });
      });
    });
  });
});
