import * as d3 from 'd3';
import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as jstat from 'jstat';
import {OneModel} from 'types'

export type getColorFunc = (i: number) => string;


const gColor = [
  '#3366cc',
  '#ff9900',
  '#109618',
  '#990099',
  '#dc3912',
  '#0099c6',
  '#dd4477',
  '#66aa00',
  '#b82e2e',
  '#316395',
  '#994499',
  '#22aa99',
  '#aaaa11',
  '#6633cc',
  '#e67300',
  '#8b0707',
  '#651067',
  '#329262',
  '#5574a6',
  '#3b3eac'
];

export const getGoogleColor: getColorFunc = (n: number) => gColor[n % gColor.length];

export const getColor: getColorFunc = d3.scaleOrdinal<number, string>(d3ScaleChromatic.schemeSet1 as string[]);


export const range = (from: number, to: number, step?: number) => {
  if (step == undefined) {
    step = from < to ? 1 : -1
  }
  let arr = [], curr = from
  while (curr < to) {
    arr.push(curr)
    curr += step
  }
  return arr
}

export const curveMaker = (from: [number, number], to: [number, number])=>{
  var dx = Math.abs(from[0] - to[0]),
    dy = Math.abs(from[1] - to[1]),
    dr = Math.sqrt(dx * dx + dy * dy);

    return "M" + from[0] + "," + from[1] + "A" + dr + "," + dr + " 0 0,1 " + to[0] + "," + to[1];
}

export const curve2Maker = (from: [number, number], to: [number, number])=>{
  var dx = Math.abs(from[0] - to[0]),
    dy = Math.abs(from[1] - to[1]),
    midx = from[0]+0.5*dx,
    midy = from[1]+0.5*dy

    return `M ${from[0]}, ${from[1]} C ${midx}, ${midy} M ${midx}, ${midy} C${from[0]}, ${from[1]}`
}


// statistic 

export function getSTD(values: number[]) {
  var avg = average(values);

  var squareDiffs = values.map(function (value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  var stdDev = Math.sqrt(avgSquareDiff);
  return stdDev;
}

export function get95conf(values:number[]):number{
  let std = getSTD(values)

  return 1.96*std/Math.sqrt(values.length)
}

function average(data: number[]) {
  var sum = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  var avg = sum / data.length;
  return avg;
}


export const pairedT = (a:number[], b:number[], side:1|2):number=>{
  let diff = a.map((item,idx)=>item-b[idx]),
  n = diff.length,
  diffMean = average(diff),
  sd =  getSTD(diff),
  se = sd/Math.sqrt(n),
  t= diffMean/se

  return jstat.ttest(t, n-1, side)

}

// ******************
// 
// ******************

export function getText(name: string) {
  if (name.includes('_')){
    name = name.split('_')[1]
  }
  let flg = name.split('')
  return `R(${flg[0] == '0' ? "M" : "M+"}, ${flg[1] == '0' ? 'D' : "D+"})`

}

// *******************
// 
// *******************
export function NormalDist(mean:number, sd:number):Array<[number, number]> {
  let data = [];
  for (var i = mean - 4 * sd; i < mean + 4 * sd; i += 0.1) {
      let q = i
      let p = jstat.normal.pdf(i, mean, sd);
      let arr: [number, number] = [q,p]
      data.push(arr);
  };
  return data;
}

export function percentile(p:number, m:number, std:number):number {

  // P: [0, 0.5]
  // return: z so that pro(x>z) = p

  var a0= 2.5066282,  a1=-18.6150006,  a2= 41.3911977,   a3=-25.4410605,
      b1=-8.4735109,  b2= 23.0833674,  b3=-21.0622410,   b4=  3.1308291,
      c0=-2.7871893,  c1= -2.2979648,  c2=  4.8501413,   c3=  2.3212128,
      d1= 3.5438892,  d2=  1.6370678, r, z;

  if (p<0.08) {
      r=Math.sqrt(-Math.log(p));
      z=(((c3*r+c2)*r+c1)*r+c0)/((d2*r+d1)*r+1);
  } else {
      p = 0.5-p
      r=p*p;
      z=p*(((a3*r+a2)*r+a1)*r+a0)/((((b4*r+b3)*r+b2)*r+b1)*r+1);
  }

  return z*std+m
}


// *************
// p value -> hypo reationship
// **************
// export function getHypo(ma:OneModel,mb:OneModel, p:number, th:number):{F:number|null, M:number|null, comb:'and'|'or'|null}{
//   let flgA = ma.name.split('_')[1], flgB = mb.name.split('_')[1]
//   let exp = [flgA, flgB].sort().reverse()
//   // swap
//   if (exp[0]===mb.name.split('_')[1]){
//     [ma, mb] = [mb, ma]
//   }
//   switch(exp.join('_')){
//     case '11_00':
//       if (p>th) return {F:0, M:1, comb:'or'}
//       else  if (ma.avg>mb.avg) return {F:1, M:0, comb:'and'}
//       else if (ma.avg<mb.avg) return {F:0, M:0, comb:'and'}
      

//     case '11_10':
//       if (p>th) return {F:0, M:null, comb:null}
//       else if (ma.avg>mb.avg) return {F:1, M:null, comb:null}
//       else if (ma.avg<mb.avg) return {F:0, M:null, comb:null} 

//     case '10_00':
//       if (p>th) return {F:0, M:null, comb:null}
//       else  if (ma.avg>mb.avg) return {F:0, M:1, comb:'and'}
//       else if (ma.avg<mb.avg) return {F:1, M:null, comb:null}
       
//     case '01_00':
//       if (p>th) return {F:null, M:null, comb:null}
//       else if (ma.avg>mb.avg) return {F:null, M:null, comb:null}
//       else if (ma.avg<mb.avg) return {F:null, M:null, comb:null}
      

//     case '11_01':
//       if (p>th) return {F:0, M:1, comb:'or'}
//       else if (ma.avg>mb.avg) return {F:1, M:0, comb:'and'}
//       else if (ma.avg<mb.avg) return {F:0, M:0, comb:'and'}
    
//     case '10_01':
//       if (p>th) return {F:0, M:null, comb:null}
//       else if (ma.avg>mb.avg) return {F:0, M:1, comb:'and'}
//       else if (ma.avg<mb.avg) return {F:1, M:null, comb:null}

//       default:
//         return {F:null, M:null, comb:null}
       
//   }



// }

export const supportIcon = "M11.2,0A11.2,11.2,0,1,0,22.4,11.2,11.21,11.21,0,0,0,11.2,0ZM16,7.54l-5.27,7.3A.8.8,0,0,1,9.66,15a.81.81,0,0,1-.18-.19L6.36,10.52a.21.21,0,0,1,.17-.32H7.7a.8.8,0,0,1,.64.34L10.13,13l3.93-5.45a.77.77,0,0,1,.64-.33h1.18A.2.2,0,0,1,16,7.54Z"
export const rejectIcon = "M11.2,0A11.2,11.2,0,1,0,22.4,11.2,11.21,11.21,0,0,0,11.2,0Zm4.14,15.46H13.69l-2.49-3-2.48,3H7.07a.19.19,0,0,1-.2-.2.22.22,0,0,1,0-.13l3.26-3.87L6.91,7.38a.23.23,0,0,1,0-.14.2.2,0,0,1,.2-.2H8.72l2.48,3,2.48-3h1.65a.2.2,0,0,1,.2.2.21.21,0,0,1,0,.13l-3.24,3.87,3.25,3.88a.19.19,0,0,1,0,.13A.2.2,0,0,1,15.34,15.46Z"
export const questionIcon = "M11.2,0A11.2,11.2,0,1,0,22.4,11.2,11.21,11.21,0,0,0,11.2,0Zm0,17.7a1,1,0,1,1,1-1A1,1,0,0,1,11.2,17.7Zm1.57-5.49A1.21,1.21,0,0,0,12,13.33v.57a.2.2,0,0,1-.2.2H10.6a.2.2,0,0,1-.2-.2v-.54a2.84,2.84,0,0,1,.5-1.62,2.79,2.79,0,0,1,1.3-1A2,2,0,0,0,13.6,8.9a2.23,2.23,0,0,0-2.4-2,2.23,2.23,0,0,0-2.4,2v.19a.2.2,0,0,1-.2.2H7.4a.2.2,0,0,1-.2-.2V8.9A3.4,3.4,0,0,1,8.41,6.32a4.33,4.33,0,0,1,5.58,0A3.4,3.4,0,0,1,15.2,8.9,3.61,3.61,0,0,1,12.77,12.21Z"
export const dummyIcon = "M11.7.5A11.2,11.2,0,1,0,22.9,11.7,11.21,11.21,0,0,0,11.7.5Z"
export const conditionIcon = "M13.46,0C11.22,0,0,11.48,0,13.46S12,26.93,13.46,26.93,26.93,15,26.93,13.46C26.93,11.65,15.79,0,13.46,0Zm.17,20.14c-3.31,0-5.21-2.2-5.21-5.86V12.71c0-3.69,1.9-5.92,5.2-5.92,2.84,0,4.89,1.83,4.89,4.43a.14.14,0,0,1-.14.14h-1.7a.23.23,0,0,1-.24-.22,2.64,2.64,0,0,0-2.8-2.51c-2,0-3.07,1.46-3.07,4.08v1.58c0,2.57,1.11,4,3.07,4A2.59,2.59,0,0,0,16.43,16a.23.23,0,0,1,.24-.22h1.71a.14.14,0,0,1,.14.14C18.52,18.37,16.45,20.14,13.63,20.14Z"

export const MODELS = ['00', '01', '10', '11']

export const TESTS = ['R(M,D)', 'R(M,D+)', 'R(M+,D)', 'R(M+,D+)']
export const classOpt = ['CMP1','CMP2','CMP3']

export const HYPO = [
  {info: 'The concept is useful to M+ and would be useful to M'},
  {info: 'The concept is harmful to M+ and would be harmful to M'},
  {info: 'M has already learned the concept ξ adequately'},
  {info:"M+ has learned the concept ξ adequately"},
  {info:"The extra information in D+ has a positive effect on M"},
  {info:"The extra information in D+ has a negative effect on M"},
 {info: " The extra information in D+ has a positive effect on M+"},
 {info: " The extra information in D+ has a negative effect on M+"},
 {info: " Learning with Dm+ affects the extra part of M+ positively"},
 {info: "Learning with Dm+ affects the extra part of M+ negatively"},
 {info: "Learning with Dm+ affects the M part of M+ positively"},
 {info: "Learning with Dm+ affects the M part of M+ negatively"},
]

export const ANALYSIS = [
  {
    pair: ['01', '00'],
    large: {support:[5], reject:[6]},
    less: {support:[6], reject:[5]},
  },
  {
    pair: ['10', '00'],
    large: {support:[11], reject:[12]},
    less: {support:[12], reject:[11]},
  },
  {
    pair: ['11', '00'],
    large: {support:[1,4,7], reject:[2,3,8]},
    less: {support:[2,4,], reject:[1,3]},
  }, 
  {
    pair: ['11', '01'],
    large: {
      dependHypo: 6,
      ifReject:{support:[1,4,7], reject:[2,3,8]},
      ifQuestion: {
        support:[1,4,7], reject:[2,3,8]
      },
      ifSupport:{
        support:[], reject:[]
      }
    },
    less: {
      dependHypo: 5,
      ifReject:{support:[2,4,8], reject:[1,3,7]},
      ifQuestion: {
        support:[2,4,8], reject:[1,3,7]
      },
      ifSupport:{
        support:[], reject:[]
      }
    }
  },
  {
    pair: ['10', '01'],
    large: {
      dependHypo: 6,
      ifReject:{support:[11], reject:[12]},
      ifQuestion: {
        support:[11], reject:[12]
      },
      ifSupport:{
        support:[], reject:[]
      }
    },
    less: {
      dependHypo: 5,
      ifReject:{support:[12], reject:[11]},
      ifQuestion: {
        support:[12], reject:[11]
      },
      ifSupport:{
        support:[], reject:[]
      }
    },
  },
  {
    pair: ['11', '10'],
    large: {
      dependHypo: 1,
      ifReject:{support:[12], reject:[11]},
      ifQuestion: {
        support:[9], reject:[10]
      },
      ifSupport:{
        support:[7,9], reject:[8, 10]
      }
    },
    less: {
      dependHypo: 2,
      ifReject:{support:[10], reject:[9]},
      ifQuestion: {
        support:[10], reject:[9]
      },
      ifSupport:{
        support:[8,10], reject:[7, 9]
      }
    }
  },
  
  
  
]

export const concepts = [
  '1.Rotating',
  '2.RandomScaling',
  '3.Scaling_RotationCorrected',
  '4.AverageIntensity',
  'AverageIntensity',
  '5.IntensityScaling',
  '6.RandomClassNumber',
  '7.ScaledClassNumber',
  '8.RotatingwithBlack',
  "HOG",
  "MaxPool1",
  "MaxPool2",
  "LastActivAdd",
  "LastActivAdd2",
  "LastActivMax",
  "HSVConcat",
  "TranslationPosition1",
  "TranslationPosition2",
  "TranslationPosition3",
  "RotatingWithBlack",
  "ScalingWithBlack",
  "D(LAB)MaxPool1",
  "D(LAB)MaxPool2",
  "D(LAB)LastActivAdd",
  "D(LAB)LastActivMax",
  "2L(LAB)MP1",
  "2L(LAB)MP2",
  "2L(LAB)LAA",
  "2L(LAB)LAM",
  "2L(RGB)MP1",
  "2L(RGB)MP2",
  "2L(RGB)LAA",
  "2L(RGB)LAM",
  "D(RGB)MaxPool1",
  "D(RGB)MaxPool2",
  "D(RGB)LastActivAdd",
  "D(RGB)LastActivMax",
  "50percentRandomScaled",
  "25percentRandomScaled",
  "10percentRandomScaled",
  "randClassRandomScaled",
  "randClassRandomScaled2",
  "ClassNumber",
  "100percentRandomGSImage",
  "75percentRandomGSImage",
  "50percentRandomGSImage",
  "25percentRandomGSImage",
  "10percentRandomGSImage",
  "randClassRandomGSImage",
  "randClass25RandomGSImage",
  "randClass50RandomGSImage",
  "AvInten_+14x14",
  "AvInten_+8x8",
  "AvInten_+2x2",
  "Pos2ScalingTranslation",
  "Pos3ScalingTranslation",
  "Pos4ScalingTranslation",
  "MergeFMNIST",
  "MergeFMNISTMP2",
  "MergeFMNISTLAA",
  "MergeFMNISTLAM",
  "CNMP1",
  "CNMP2",
  "CNLAA",
]