import React from 'react';
import * as d3 from 'd3';
import CompModelPainter, {Params} from '../CompModels/CompModelPainter';
import {HypoTextView, compModelView, compWidthRatio} from 'const'
import {CompareData, ModelData, compStates} from 'types';
import {classOpt} from 'helper';

interface Props {
    n: number,
    modelData: ModelData,
    compareData: CompareData,

}

export default class CompModels extends React.Component<Props, {}>{
    private painter:CompModelPainter
    constructor(props:any){
        super(props)
        let params = {
            compModelView,
            ...this.props,
        }
        this.painter = new CompModelPainter(params)
    }

    
    painterUpdate(newParams: Partial<Params>){
        let className = classOpt[this.props.n-1]
        this.painter.update(newParams)
        .render(d3.select(`g.${className}`))
    }

    shouldComponentUpdate(nextProps:Props){
        this.painterUpdate(nextProps)
        return false
    }

    render(){
        let className = classOpt[this.props.n-1]
        let left = window.innerWidth*(compWidthRatio.selector + compWidthRatio.hypo) + compModelView.margin.left
        return <g className={className} transform={`translate(${0}, ${29})`}/>
    }
}