import * as React from "react"
import * as d3 from 'd3'
import "./index.css"
import {compHeaderView, compWidthRatio, HypoTextView, hypoMatrixView, headerView, TitleView, compSelectorView, compModelView, compHypoView} from 'const'
import {TESTS} from 'helper'

export default class CompHeader extends React.Component{
    render() {
        let {width, height} = compHeaderView
        let testWidth = width*compWidthRatio.model / 4
        let xtestScale = d3
            .scaleLinear()
            .domain([0, TESTS.length -1])
            .range([0,width*compWidthRatio.model - testWidth])

        let testTitles = TESTS.map((test,i)=>{
            return <h3 style={{width: testWidth, height, position: 'absolute', left:xtestScale(i)}}>{test}</h3>
            
        })
        

        return <div className='compheader' style={{width, height,
            position:"absolute", top: HypoTextView.height + HypoTextView.margin.bottom + 2*HypoTextView.margin.top + TitleView.height + hypoMatrixView.height, overflow:"auto"}}>

                <h2 className='select element' style={{width: (width||0)*compWidthRatio.selector, height: height-10,
                    position:"absolute", left: compSelectorView.margin.left, top: -5 }}>Compare</h2> 
                <h3 className='hypo element' style={{width: (width||0)*compWidthRatio.hypo, height: height-10,
                    position:"absolute", left: compSelectorView.margin.left + compSelectorView.width}}>Hypotheses</h3> 
                <div className='model element' style={{width: (width||0)*compWidthRatio.model,
                        position:"absolute", 
                        left: compSelectorView.margin.left + compSelectorView.width + compHypoView.width}}>
                            {testTitles}
                    </div>
            </div>



    }
}