import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Visualization from './Visualization';
import ComparisonTable from './ComparisonTable';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    Map: () => ({})
}));

describe('Visualization', () => {
    let props;
    let mountedVisualization;
    const visualization = () => {
        if (!mountedVisualization) {
            mountedVisualization = mount(
                <Visualization {...props} />
            );
        }
        return mountedVisualization;
    }

    beforeEach(() => {
        props = {
            acsData: [],
            acsVars: {},
            selectedAcsVar: '',
        };
        mountedVisualization = undefined
    });

    it('always renders a map-container div', () => {
        const divs = visualization().find('div');
        expect(divs.length).toBeGreaterThan(0);
    });

    describe('the rendered container', () => {
        it ('contains the map, legend, and table', () => {
           const container = visualization().first('div');
           expect(container.children()).toEqual(visualization().children());
        });
    });

    it('awalys renders a map', () => {
        expect(visualization().find('#map').length).toBe(1);
    });
    
    it('always renders a legend', () => {
        expect(visualization().find('#legend').length).toBe(1);
    });

    it('always renders a ComparisonTable component', () => {
        expect(visualization().find('#comparison-table').length).toBe(1);
    });

    describe('rendered ComparisonTable', () => {
        it('receives 3 props', () => {
            const comparisonTable = visualization().find(ComparisonTable);
            expect(Object.keys(comparisonTable.props()).length).toBe(3);
        });
    });
});