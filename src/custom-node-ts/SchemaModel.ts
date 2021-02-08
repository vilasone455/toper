import { NodeModel, DefaultPortModel } from '@projectstorm/react-diagrams';
import { BaseModelOptions } from '@projectstorm/react-canvas-core';

export interface SchemaNodeModelOptions extends BaseModelOptions {
	color?: string;
    schema_name? : string,
}

export class SchemaModel extends NodeModel {
	color: string;

	constructor(options: SchemaNodeModelOptions = {}) {
		super({
			...options,
			type: 'schema-node'
		});
		this.color = options.color || 'red';

		// setup an in and out port
		this.addPort(
			new DefaultPortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new DefaultPortModel({
				in: false,
				name: 'out'
			})
		);
	}

    

	serialize() {
		return {
			...super.serialize(),
			color: this.color
		};
	}

	deserialize(event : any): void {
		super.deserialize(event);
		this.color = event.data.color;
	}
}