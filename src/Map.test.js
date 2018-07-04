import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Map from './Map';

Enzyme.configure({ adapter: new Adapter() });
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
    Map: () => ({})
}));

describe('Map', () => {
    let props;
    let mountedMap;
    const map = () => {
        if (!mountedMap) {
            mountedMap = mount(
                <Map {...props} />
            );
        }
        return mountedMap;
    }

    beforeEach(() => {
        props = {
            acsData: [],
            acsVars: {},
            selectedAcsVar: '',
        };
        mountedMap = undefined
    });

    it('always renders a map-container div', () => {
        const divs = map().find('div');
        expect(divs.length).toBeGreaterThan(0);
    });

    describe('the rendered container', () => {
        it ('contains the map, legend, and table', () => {
           const container = map().first('div');
           expect(container.children()).toEqual(map().children());
        });
    });

    it('awalys renders a map', () => {
        expect(map().find('#map').length).toBe(1);
    });
    
    it('always renders a legend', () => {
        expect(map().find('#legend').length).toBe(1);
    });
});