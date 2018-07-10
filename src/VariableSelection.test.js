import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Select from 'react-select';
import VariableSelection from './VariableSelection';

Enzyme.configure({ adapter: new Adapter() });

describe('VariableSelection', () => {
  let props;
  let mountedVarSelection;
  const varSelection = () => {
    if (!mountedVarSelection) {
      mountedVarSelection = mount(<VariableSelection {...props} />);
    }
    return mountedVarSelection;
  };

  beforeEach(() => {
    props = {
      vars: {},
      selectedAcsVar: 'testVar',
      onChangeSelected: jest.fn(),
    };
    mountedVarSelection = undefined;
  });

  it('always renders a div', () => {
    const div = varSelection().find('div');
    expect(div.length).toBeGreaterThan(0);
  });

  describe('the rendered div', () => {
    it('contains user instructions and dropdown list', () => {
      const container = varSelection().first('div');
      expect(container.children()).toEqual(varSelection().children());
    });
  });

  it('always renders a Select menu', () => {
    expect(varSelection().find(Select).length).toBe(1);
  });

  describe('rendered Select', () => {
    it('receives props', () => {
      const selectMenu = varSelection().find(Select);
      expect(Object.keys(selectMenu.props()).length).toBeGreaterThan(0);
    });
  });
});
