import React from 'react';
import { select } from 'd3';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

const Bubblechart = props => {
    const { data } = props;
    if (data.features) {
        const width = 750;
        const height = 350;
        const margin = 30;
        const xScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties['Bachelors_Degree_(%)']).filter(d => d !== 'N/A'))])
            .rangeRound([margin, width - margin]);
        const yScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties['Median_Household_Income_($)']).filter(d => d !== 'N/A'))])
            .rangeRound([height - margin, margin]);
        const rScale = scaleLinear()
            .domain([0, Math.max(...data.features.map(df => df.properties['Bachelors_Degree_(%)']).filter(d => d !== 'N/A'))])
            .rangeRound([1, 50]);
        const xAxis = axisBottom()
            .scale(xScale)
            .tickFormat(function(d) { return d; });
        const yAxis = axisLeft()
            .scale(yScale)
            .ticks(5)
            .tickFormat(function(d) { return d; });
        const chart = select('.bubblechart')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', function(d) {
                return '0, 0,' + width + ',' + height;
            });
        chart.append('g')
            .attr('transform', function() {
                return 'translate(0,' + (height - margin ) + ')';
            })
            .call(xAxis);
        chart.append('g')
            .attr('transform', function() {
                return 'translate(' + margin + ', 0)';
            })
            .call(yAxis);
        chart.selectAll('bubble')
            .data(data.features)
            .enter()
            .append('circle')
            .style('stroke', '#000000')
            .style('fill', '#1D667F')
            .attr('cx', function(d) {
                return xScale(d.properties['Bachelors_Degree_(%)']);
            })
            .attr('cy', function(d) {
                return yScale(d.properties['Median_Household_Income_($)']);
            })
            .attr('r', function(d) {
                return rScale(d.properties['Bachelors_Degree_(%)'])
            });
        console.log('xScale', xScale);
        return <svg className='bubblechart' />
    }
    if (!data.features) {
        return <p>Bubblechart</p>
    }
}

export default Bubblechart;