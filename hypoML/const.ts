import {Label} from 'types'
export const LABELNAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
export const LABELS:Label[] = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9']

export const THR=0.05

// **********
// view
// **********

export const widthRatio = {'model':0.3, 'p':0.2, 'hypo':0.45,}

export const headerView = {
    width:window.innerWidth||0, 
    height: (window.innerHeight*0.08)||0
}

export const TitleView = {
    height: window.innerHeight*0.1,
    width: window.innerWidth,
}

var margin = {top: 30, right: 10, bottom: 50, left: 30}

export const overView = {
    width: window.innerWidth, 
    height: (window.innerHeight*1.5)||0,
    margin,
}
export const singleView = {
    singleWidth: window.innerWidth, 
    singleHeight: (window.innerHeight - TitleView.height -(margin.bottom)) ||0,
    margin,
}

export const HypoTextView = {
    height: window.innerHeight*0.35,
    width: overView.width*widthRatio.hypo,
    margin
}

export const hypoMatrixView = {
    width: overView.width*widthRatio.hypo,
    height: (window.innerHeight*0.3)||0,
    margin
}

export const modelView = {
    width: overView.width*widthRatio.model,
    height: (window.innerHeight*0.3)||0,
    margin
}

export const pView = {
    width: overView.width*widthRatio.p,
    height: (window.innerHeight*0.3)||0,
    margin
}

// comp dimensions
export const compWidthRatio = {'selector':0.17, 'hypo':0.32, 'model':0.45}

export const compHeaderView = {
    width: window.innerWidth||0, 
    height: (window.innerHeight*0.05)||0
}

export const compHypoView = {
    width: window.innerWidth*compWidthRatio.hypo,
    height: window.innerHeight*0.08||0,
    margin
}

export const compSelectorView = {
    width: overView.width*compWidthRatio.selector,
    height: window.innerHeight*0.08||0,
    margin
}

export const compModelView = {
    width: overView.width*compWidthRatio.model,
    height: window.innerHeight*0.15||0,
    margin
}
