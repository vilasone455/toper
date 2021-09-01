export interface ContextFunction {
    zoomIn : () => void,
    zoomOut : () => void,
    redoFunc : () => void,
    undoFunc : () => void,
    pasteFunc : () => void
}

export interface ComponentFunction extends ContextFunction {
    copyFunc : () => void,
    cutFunc : () => void,
    deleteFunc : () => void,
    duplicateFunc : () => void
}

export interface AllContextFunction extends ContextFunction , ComponentFunction{
    
}


