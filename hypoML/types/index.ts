export interface ViewParams {
  width: number;
  height: number;
  margin: {top: number, right: number, bottom: number, left: number}
}
export interface AccuracyData extends Array<[string,number,number]>{}

export type CompareData = Array<{from:string, to:string, p:number, dir:'+'|'-'}>

export type compStates = {
  modelData: ModelData,
  compareData: CompareData,
  filename:string
}

export interface OneModel {
  name: string,
  avg: number,
  err: number,
  arr: number[],
  hasDetails: boolean
}
export type ModelData = Array<OneModel>

// string model name of type Result
export interface Results {
  [modelname: string]: Result

}
export type Label ="0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

export type Metric = "precision"|"recall"|"support"|"f1-score"

export type STATUS =  1|0|-1|'if'

export type Result = {[label in Label]: {[metric: string]: number;};} 
& 
{accuracy: number; avg: {[metric in Metric]: number;};};

export type confusionM = number[][]

// first hypo (row), then analysis (col) 
export type StatuMatrix = {status?:STATUS, if?:number}[][]

export type Ratio ={
  [k:string]:number
}