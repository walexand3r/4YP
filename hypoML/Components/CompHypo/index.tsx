import * as React from "react"
import * as d3 from 'd3'
import { StatuMatrix } from 'types'
import {  HYPO } from 'helper'
import { compHypoView, compWidthRatio} from 'const'

interface Props {
    n: number,
    status: StatuMatrix
}


export default class CompHypo extends React.Component<Props, {}> {
    textColor(status:number){
        if (status==0) return '#7a7a7a';
        else if(status>0) return '#000';
        else if (status<0) return '#c0c0c0';
    }
    render() {
        let { height, margin } = compHypoView
        let width = window.innerWidth*compWidthRatio.hypo
        let left = 0
        let offset = this.props.n * 30
        let {status} = this.props
        
        let hypoStatus = status.map(anlyList=>{
            return anlyList.filter(d=>typeof(d.status)=='number').reduce((acc, curr)=>acc+ (curr.status as number), 0)
        })

        let xScale = d3
            .scaleLinear()
            .domain([0, HYPO.length])
            .range([0, width])

        let yScale = d3
            .scaleLinear()
            .domain([1, 3])
            .range([0, window.innerHeight*0.165])

        let hypoInfo = HYPO.map((hypo,i)=>{
            return <g className='compHypo' transform={`translate(${xScale(i)}, ${0})`}>
                <text className='hypoNumber' fontWeight='bold' fontSize={18} fill={this.textColor(hypoStatus[i])}>
                    {`H${i+1}`}
                </text>      
            </g>
        })
       
        return <g className='hypoInfos' style={{width: width, height: height}} 
                  transform={`translate(${0}, ${yScale(this.props.n)+35})`}>
           {hypoInfo}
        </g>
    }
}

