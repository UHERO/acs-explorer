import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Heatmap from './Heatmap';

Enzyme.configure({ adapter: new Adapter() });

describe('Heatmap', () => {
    let props;
    let mountedHeatmap;
    const heatMap = () => {
        if (!mountedHeatmap) {
            mountedHeatmap = mount(
                <Heatmap {...props} />
            );
        }
        return mountedHeatmap;
    }

    beforeEach(() => {
        props = {
            data: {},
            compareTracts: [],
            selectedVar: ''
        }
        mountedHeatmap = undefined
    });

    describe('when heatmap receives no data', () => {
        beforeEach(() => {
            props.data = {};
        });

        it('renders an empty paragraph element', () => {
            const p = heatMap().find('p');
            expect(p.length).toBe(1);
        });
    });

    describe('when heatmap receives data', () => {
        beforeEach(() => {
            props.data = { features: [] };
        });
        
        it('renders an svg', () => {
            const heatmap = heatMap().find('svg');
            expect(heatmap.length).toBe(1);
        });
    });
});