import {
	LinkModel,
	PortModel,
	PortModelAlignment,
	PortModelGenerics,
	PortModelOptions
} from '@projectstorm/react-diagrams-core';
//import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults/src/link/DefaultLinkModel';
import {DefaultPortModel ,DefaultLinkModel } from '@projectstorm/react-diagrams-defaults'
import { AbstractModelFactory, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { SchemaLinkModel } from '../link/SchemaLinkModel';


export interface SchemaPortModelOptions extends PortModelOptions {
	label?: string;
	typename?: string,
	fk ?: boolean,
	pk ?: boolean,
	in?: boolean;
}

export interface SchemaPortModelGenerics extends PortModelGenerics {
	OPTIONS: SchemaPortModelOptions;
}

export interface DefaultPortModelOptions extends PortModelOptions {
	label?: string;
	in?: boolean;
}

export interface DefaultPortModelGenerics extends PortModelGenerics {
	OPTIONS: DefaultPortModelOptions;
}

export class SchemaPortModel extends DefaultPortModel {
	createLinkModel(): SchemaLinkModel  {
		return new SchemaLinkModel();
	}
}

