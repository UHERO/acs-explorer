import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ComparisonTable from './ComparisonTable';

Enzyme.configure({ adapter: new Adapter() });

describe('ComparisonTable', () => {
  let props;
  let mountedTable;
  const comparisonTable = () => {
    if (!mountedTable) {
      mountedTable = mount(<ComparisonTable {...props} />);
    }
    return mountedTable;
  };

  beforeEach(() => {
    props = {
      vars: {},
      tracts: [],
    };
    mountedTable = undefined;
  });

  describe('when no tracts are received', () => {
    beforeEach(() => {
      props.tracts = [];
    });

    it('renders an empty paragraph element', () => {
      const p = comparisonTable().find('p');
      expect(p.length).toBe(1);
    });
  });

  describe('when tracts are received', () => {
    beforeEach(() => {
      props.tracts = [{ properties: { TRACTCE: 'test' } }];
    });

    it('renders a table', () => {
      const table = comparisonTable().find('table');
      expect(table.length).toBe(1);
    });
  });
});
