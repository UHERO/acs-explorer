import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Visualization from './Visualization';
import VariableSelection from './VariableSelection';
import StateMap from './StateMap';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    Map: () => ({})
}));

describe('Visualization', () => {
    describe('when component starts loading', () => {
        it('renders a loading message', () => {
            const visComponent = shallow(<Visualization />);
            visComponent.setState({ loading: true });
            expect(visComponent.find('p').length).toBe(1);
        });
    });

    describe('when an error occurs while fetching data from ACS', () => {
        it('renders an error message', () => {
            const visComponent = shallow(<Visualization />);
            visComponent.setState({ loading: false, error: true });
            expect(visComponent.find('p').length).toBe(1);
        });
    });

    describe('when fetching data from ACS is successful', () => {
        it('renders a vis container div', () => {
            const visComponent = shallow(<Visualization />);
            visComponent.setState({ loading: false, error: false, data: [{ TRACTCE: 'test' }] });
            const div = visComponent.find('div');
            expect(div.length).toBe(1);

            describe('the rendered div contains VariableSelection and StateMap components', () => {
                expect(div.children()).toEqual(visComponent.children());

                describe('rendered VariableSelection', () => {
                    it('receives 3 props', () => {
                        const varSelection = visComponent.find(VariableSelection);
                        expect(Object.keys(varSelection.props()).length).toBe(3);
                    });
                });

                describe('rendered StateMap', () => {
                    it('receives 3 props', () => {
                        const stateMap = visComponent.find(StateMap);
                        expect(Object.keys(stateMap.props()).length).toBe(3);
                    });
                });
            });
        });
    });
});