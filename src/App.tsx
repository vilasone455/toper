import React , {FunctionComponent , useEffect} from 'react'

import { useSelector , useDispatch } from "react-redux"
import { RootState } from './rootReducer';
import { CanvasWidget } from '@projectstorm/react-canvas-core';

import { DemoCanvasWidget } from './components/CanvasDiagram';

import {engine} from './libs/engine'

export interface DemoCanvasWidgetProps {
	color?: string;
	background?: string;
}

export class App extends React.Component<DemoCanvasWidgetProps> {

	render() {

    
		return (
			<DemoCanvasWidget background="#FFFFFF" color="#808080">
        <CanvasWidget engine={engine} className="canvas" />
      </DemoCanvasWidget>
		);
	}
}




