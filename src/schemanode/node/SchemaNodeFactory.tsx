import * as React from 'react';
import { SchemaNodeModel } from './SchemaNodeModel';
import { SchemaNodeWidget } from './SchemaNodeWidget';
import { AbstractReactFactory , GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { MenuProvider  } from 'react-contexify';

export class SchemaNodeFactory extends AbstractReactFactory<SchemaNodeModel, DiagramEngine> {

	constructor() {
		super('default');
	}
	

	generateReactWidget(event : any): JSX.Element {
		
		return (
			<MenuProvider id="component" storeRef={false} data={event.model}>
				<SchemaNodeWidget engine={this.engine} node={event.model}  />
			</MenuProvider>
			)
	}

	generateModel(initialConfig : any) {
		return new SchemaNodeModel('Node 2', 'rgb(192,255,0)');
	}
}