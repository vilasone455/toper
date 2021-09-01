import React , {FunctionComponent} from 'react';

import {ComponentContextMenu} from './ComponentContextMenu';
import {DiagramContextMenu} from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';
import {AllContextFunction} from './FunctionList'



export const ContextMenus: FunctionComponent<AllContextFunction> = ({undoFunc , redoFunc ,copyFunc , 
  deleteFunc , duplicateFunc , cutFunc , pasteFunc , zoomIn , zoomOut} ) => {

  return (
    <>
    <DiagramContextMenu  pasteFunc={pasteFunc} zoomIn={zoomIn} zoomOut={zoomOut} undoFunc={undoFunc} redoFunc={redoFunc}  />
    <ComponentContextMenu  copyFunc={copyFunc} pasteFunc={pasteFunc} undoFunc={undoFunc} redoFunc={redoFunc}
    deleteFunc={deleteFunc} duplicateFunc={duplicateFunc} cutFunc={cutFunc} zoomIn={zoomIn} zoomOut={zoomOut} />
  </>
  );
}




