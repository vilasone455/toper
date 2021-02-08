import * as _ from 'lodash';
import { NodeModel, NodeModelGenerics, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { SchemaPortModel } from '../port/SchemaPortModel';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
}

export interface Field{
	fieldName : string,
	fieldType : string,
	pk ?: boolean,
	fk ?: boolean
}

export interface SchemaNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: DefaultNodeModelOptions;
}

export class SchemaNodeModel extends NodeModel<SchemaNodeModelGenerics> {
	protected portsIn: SchemaPortModel[];
	protected portsOut: SchemaPortModel[];


	constructor(name: string, color: string);
	constructor(options?: DefaultNodeModelOptions);
	constructor(options: any = {}, color?: string) {
		if (typeof options === 'string') {
			options = {
				name: options,
				color: color
			};
		}
		super({
			type: 'default',
			name: 'Untitled',
			color: 'rgb(0,192,255)',
			...options
		});
		this.portsOut = [];
		this.portsIn = [];
	}

	doClone(lookupTable: {}, clone: any): void {
		clone.portsIn = [];
		clone.portsOut = [];
		super.doClone(lookupTable, clone);
	}

	removePort(port: SchemaPortModel): void {
		super.removePort(port);
	
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
	}

	addField(field : Field){
		this.addInPort(field.fieldName)
		this.addOutPort(field.fieldType)
	}

	removeField(i : number){
		this.portsIn[i].remove()
		this.portsOut[i].remove()
	}

	getField(index : number){
		//let rs = this.portsIn[index].getOptions(). 
	}

	updatePort(port: SchemaPortModel , index : number){
		
	}

	addPort<T extends SchemaPortModel>(port: T): T {
		super.addPort(port);
		if (port.getOptions().in) {
			if (this.portsIn.indexOf(port) === -1) {
				this.portsIn.push(port);
			}
		} else {
			if (this.portsOut.indexOf(port) === -1) {
				this.portsOut.push(port);
			}
		}
		return port;
	}

	addInPort(label: string, after = true): SchemaPortModel {
		const p = new SchemaPortModel({
			in: true,
			name: label,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort(label: string, after = true): SchemaPortModel {
		const p = new SchemaPortModel({
			in: false,
			name: label,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		if (!after) {
			this.portsOut.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);
		this.options.name = event.data.name;
		this.options.color = event.data.color;
		this.portsIn = _.map(event.data.portsInOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as SchemaPortModel[];
		this.portsOut = _.map(event.data.portsOutOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as SchemaPortModel[];
	}

	serialize(): any {
		return {
			...super.serialize(),
			name: this.options.name,
			color: this.options.color,
			portsInOrder: _.map(this.portsIn, (port : SchemaNodeModel) => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, (port : SchemaNodeModel) => {
				return port.getID();
			})
		};
	}

	getInPorts(): SchemaPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): SchemaPortModel[] {
		return this.portsOut;
	}
}