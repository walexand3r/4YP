import * as d3 from 'd3';
import { EnterElement, BaseType } from 'd3';
export interface CompPainter<DataType, ParamsType> {
    update(params: ParamsType): this;
    // data(newData: DataType): this;
    render<GElement extends d3.BaseType>
    (selector: d3.Selection<SVGElement, DataType, GElement, any>
      |d3.Selection<SVGGElement, DataType, GElement, any>): this;
  }


