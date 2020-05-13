import * as d3 from 'd3'
import { CompPainter } from 'components/CompPainter'

import { ViewParams, CompareData, Results, Label, Metric, ModelData, OneModel, Ratio, compStates } from 'types'
import { classOpt} from 'helper'
import { LABELS, compWidthRatio } from 'const'

export interface Data {
    n: number
    modelData: ModelData,
    compareData: CompareData
}

export interface Params extends Data {
    compModelView: ViewParams
 }

export default class CompModelPainter implements CompPainter<Data, ViewParams>{
    private params: Params; r: number = 8
    constructor(params: Params) {
        this.params = params
        }
    update(newParams: any) {
        this.params = { ...this.params, ...newParams }
        return this
    }
    render(selector: d3.Selection<SVGElement, any, any, any>) {
        let className = classOpt[this.params.n-1]
        selector.select(`*`).remove()

        let {compModelView, modelData, compareData} = this.params
        let width = window.innerWidth*compWidthRatio.model
        let testWidth = width / 4
        let name = this.params.modelData[0]

        // Set the ranges
        const xmin = Math.min(...modelData.map(d => Math.min(...d.arr))) || 0
        const xmax = Math.max(...modelData.map(d => Math.max(...d.arr))) || 1

        let accScale = d3.scaleLinear()
            .range([0, testWidth])
            .domain([0, 1])

        let xScale = d3.scaleLinear()
            .domain([0,4])
            .range([0, (width)])

        //xScale = xScale - 2.5

        let yScale = d3
        .scaleLinear()
        .domain([1, 3])
        .range([0, window.innerHeight*0.165])

        // Models

        let modelGroup = selector.append('g')
            .attr('class', 'models')
            .attr("transform", `translate(${window.innerWidth*compWidthRatio.hypo},${0})`)

        // Draws division lines
        let dv = modelGroup.append('g')
            .attr('class','dv')

        dv.selectAll('line.dv')
            .data([0,0,0,0,0])
            .enter()
            .append('line')
            .attr('x1', (d,i) => xScale(i))
            .attr('x2', (d,i) => xScale(i))
            .attr('y1', (d) => yScale(this.params.n)-8)
            .attr('y2', (d) => yScale(this.params.n)+8)
            .style('stroke','cornflowerblue')
            .style('stroke-width', '2')

        let std = modelGroup.append('g')
            .attr('class', 'std')

        // Draws standard deviation lines  
        std.selectAll('line.std')
            .data(modelData)
            .join(
                enter => enter.append('line')
                    .attr('x1', (d,i) => xScale(i) + accScale(d.avg - d.err))
                    .attr('x2', (d,i) => xScale(i) + accScale(d.avg + d.err))
                    .attr('y1', (d) => yScale(this.params.n) || 0)
                    .attr('y2', (d) => yScale(this.params.n) || 0),

                update => update
                    .attr('x1', (d,i) => xScale(i) + accScale(d.avg - d.err))
                    .attr('x2', (d,i) => xScale(i) + accScale(d.avg + d.err))
                    .attr('y1', (d) => yScale(this.params.n) || 0)
                    .attr('y2', (d) => yScale(this.params.n) || 0),

                exit=>exit.remove()
            )
            .style('stroke', "black")
        
        
        // Draws results circles
        let points = modelGroup.append('g')
            .attr('class', 'points')

        points.selectAll('circle.point')
            .data(modelData)
            .join(
                enter => enter.append("circle")
                    .attr('cx', (d,i) => xScale(i) + accScale(d.avg))
                    .attr('cy', (d) => yScale(this.params.n) || 0),

                update => update
                    .attr('cx', (d,i) => xScale(i) + accScale(d.avg))
                    .attr('cy', (d) => yScale(this.params.n) || 0),

                exit => exit.remove()
            )
            .attr('class', 'point')
            .attr('r', this.r)
            .attr("stroke", "black")
            .attr("fill", "white")


        // Draws accuracy values
        let pointValue = modelGroup.append('g')
            .attr('class', 'values')

        pointValue.selectAll('text.value')
            .data(modelData)
            .join(
                enter => enter.append("text")
                    .attr('class', 'value')
                    .attr('x', (d,i) => xScale(i) + accScale(d.avg) - this.r)
                    .attr('y', (d) => (yScale(this.params.n) || 0) - 2 * this.r)
                    .text((d) => d.avg.toFixed(4)),

                update => update
                    .attr('x', (d,i) => xScale(i) + accScale(d.avg) - this.r)
                    .attr('y', (d) => (yScale(this.params.n) || 0) - 2 * this.r)
                    .text((d) => d.avg.toFixed(4)),

                exit => exit.remove()
            )
        return this
    }
}
