import { SchemaPortModel } from './SchemaPortModel';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class SchemaPortFactory extends AbstractModelFactory<SchemaPortModel, DiagramEngine> {
	constructor() {
		super('default');
	}

	generateModel(): SchemaPortModel {
		return new SchemaPortModel({
			name: 'unknown'
		});
	}
}