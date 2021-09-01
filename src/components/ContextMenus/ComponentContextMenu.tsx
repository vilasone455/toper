import React , {FunctionComponent} from 'react';

import { Menu, Item, Separator } from 'react-contexify';

import {
  Duplicate,
  Copy,
  Delete,
  Paste,
  Redo,
  Settings,
  Undo,
  Cut,
  ZoomIn,
  ZoomOut,
} from '../Icons';
import Key from './KeyMenu';
import ContextMenuIconContainer from './ContextMenuIconContainer';
import ContextMenuShortcutContainer from './ContextMenuShortcutContainer';
import {ComponentFunction} from './FunctionList'

  export const ComponentContextMenu : FunctionComponent<ComponentFunction> = ({copyFunc , pasteFunc , 
    deleteFunc , duplicateFunc , cutFunc , zoomIn , zoomOut , undoFunc , redoFunc} ) => (
  <Menu id="component">
    <Item onClick={duplicateFunc}>
      <ContextMenuIconContainer>
        <Duplicate />
      </ContextMenuIconContainer>
      Duplicate
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>D</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={cutFunc}>
      <ContextMenuIconContainer>
        <Cut />
      </ContextMenuIconContainer>
      Cut
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>X</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={copyFunc}>
      <ContextMenuIconContainer>
        <Copy />
      </ContextMenuIconContainer>
      Copy
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>C</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={pasteFunc}>
      <ContextMenuIconContainer>
        <Paste />
      </ContextMenuIconContainer>
      Paste
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>V</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={deleteFunc}>
      <ContextMenuIconContainer>
        <Delete />
      </ContextMenuIconContainer>
      Delete
      <ContextMenuShortcutContainer>
        <Key>Delete</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Separator />

    <Item onClick={zoomIn}>
      <ContextMenuIconContainer>
        <ZoomIn />
      </ContextMenuIconContainer>
      Zoom in
    </Item>

    <Item onClick={zoomOut}>
      <ContextMenuIconContainer>
        <ZoomOut />
      </ContextMenuIconContainer>
      Zoom out
    </Item>

    <Separator />

    <Item onClick={undoFunc}>
      <ContextMenuIconContainer>
        <Undo />
      </ContextMenuIconContainer>
      Undo
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>Z</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Item onClick={redoFunc}>
      <ContextMenuIconContainer>
        <Redo />
      </ContextMenuIconContainer>
      Redo
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>SHIFT</Key>
        <Key>Z</Key>
      </ContextMenuShortcutContainer>
    </Item>

    <Separator />

    <Item
     
    >
      <ContextMenuIconContainer>
        <Settings />
      </ContextMenuIconContainer>
      Edit configurations...
      <ContextMenuShortcutContainer>
        <Key>CTRL</Key>
        <Key>E</Key>
      </ContextMenuShortcutContainer>
    </Item>
  </Menu>
);

export default ComponentContextMenu;