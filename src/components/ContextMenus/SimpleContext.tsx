import React , {FunctionComponent} from 'react';

import { Menu, Item, Separator } from 'react-contexify';

import { Redo, Undo, Paste, ZoomIn, ZoomOut } from '../Icons';
import Key from './KeyMenu';
import ContextMenuIconContainer from './ContextMenuIconContainer';
import ContextMenuShortcutContainer from './ContextMenuShortcutContainer';

import {ContextFunction} from './FunctionList'


export const SimpleContext : FunctionComponent = () => (
  <Menu id="nodeedit">
  <Item>
    <ContextMenuIconContainer>
      <Paste />
    </ContextMenuIconContainer>
    Paste
    <ContextMenuShortcutContainer>
      <Key>CTRL</Key>
      <Key>V</Key>
    </ContextMenuShortcutContainer>
  </Item>

  <Separator />

  <Item>
    <ContextMenuIconContainer>
      <ZoomIn />
    </ContextMenuIconContainer>
    Zoom in
  </Item>
  <Item>
    <ContextMenuIconContainer>
      <ZoomOut />
    </ContextMenuIconContainer>
    Zoom out
  </Item>

  <Separator />

  <Item>
    <ContextMenuIconContainer>
      <Undo />
    </ContextMenuIconContainer>
    Undo
    <ContextMenuShortcutContainer>
      <Key>CTRL</Key>
      <Key>Z</Key>
    </ContextMenuShortcutContainer>
  </Item>

  <Item>
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
</Menu>
);

export default SimpleContext;