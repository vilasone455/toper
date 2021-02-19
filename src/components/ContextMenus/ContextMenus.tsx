import React , {FunctionComponent} from 'react';

import {ComponentContextMenu} from './ComponentContextMenu';
import {DiagramContextMenu} from './DiagramContextMenu';

import 'react-contexify/dist/ReactContexify.min.css';
import {AllContextFunction} from './FunctionList'



export const ContextMenus: FunctionComponent<AllContextFunction> = ({copyFunc , deleteFunc , duplicateFunc , cutFunc , pasteFunc , zoomIn , zoomOut} ) => {

  return (
    <>
    <DiagramContextMenu  pasteFunc={pasteFunc} zoomIn={zoomIn} zoomOut={zoomOut}  />
    <ComponentContextMenu  copyFunc={copyFunc} pasteFunc={pasteFunc} 
    deleteFunc={deleteFunc} duplicateFunc={duplicateFunc} cutFunc={cutFunc} zoomIn={zoomIn} zoomOut={zoomOut} />
  </>
  );
}




