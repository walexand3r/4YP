import * as React from 'react';
import {Select, Button} from "antd";
import {compWidthRatio,compSelectorView,overView,hypoMatrixView,TitleView} from 'const';
import {concepts} from 'helper';
import './index.css';

let Option = Select.Option
let {height} = compSelectorView
let width = window.innerWidth*compWidthRatio.selector + 50

const style = {
    width,
    height,
    padding: '30px 30px',
    //top: 10
    // HypoTextView.height + HypoTextView.margin.bottom + 
    //         2*HypoTextView.margin.top + TitleView.height
    //         //hypoMatrixView.height
}

const SelectConcStyle = {
    backgroundColor: 'white', color:"black",
    width: 140
}
const SelectStyle = {
    backgroundColor: 'white', color:"black"
}

export interface Props{
    n:number
    filename:string,
    changeCompResults:(filename:string,n:number)=>void
}

export default class CompSelect extends React.Component<Props, {}>{
    private dataset:string; concept:string
    constructor(props:Props){
        super(props)
        this.dataset= ''
        this.concept = ''
        this.changeCompResults=this.changeCompResults.bind(this)
        this.changeCompConcept=this.changeCompConcept.bind(this)
        this.changeCompData=this.changeCompData.bind(this)
    }
    changeCompResults(e:any){
        let {dataset, concept} = this
        e.preventDefault();
        this.props.changeCompResults(`${dataset}_${concept}.json`,this.props.n)
    }
    changeCompConcept(concept:any){
        this.concept=concept
    }
    changeCompData(dataset:any){
        this.dataset=dataset
    }
    render(){        
        let {filename}=this.props
        let [dataset, concept] = filename.replace('.json','').split('_')
        this.dataset = dataset
        this.concept = concept 
        let featureSelector = <Select className = 'compSelect' defaultValue={concept} size="small" style={SelectConcStyle}
            onChange={this.changeCompConcept}> 
                        {concepts.map(d=>{
                            return <Option value={d} style={SelectStyle}>{d}</Option>})
            }
                            
                            </Select>
        
        let datasetSelector = <Select defaultValue={dataset} size="small" style={SelectStyle}
            onChange={this.changeCompData}>             
            <Option value="fashion" style={SelectStyle}>fashion</Option>
            <Option value="cifar10" style={SelectStyle}>cifar10</Option>
        </Select>
        let offset = this.props.n * 15

        return <div className='CompSelect' style={style}>
                   <div className='selector' style={{width: 'auto', height: style.height, top: offset}}>
                        { featureSelector } 
                        { datasetSelector } 
                    <Button htmlType="submit" shape="circle" icon="caret-right" onClick={this.changeCompResults}/>
                    </div>
                </div>
                }
    }