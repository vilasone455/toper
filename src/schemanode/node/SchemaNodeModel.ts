import * as _ from 'lodash';
import { NodeModel, NodeModelGenerics, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { SchemaPortModel } from '../port/SchemaPortModel';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { DefaultLinkModel, DefaultPortModel, DiagramEngine, LinkModel, PathFindingLinkFactory } from '@projectstorm/react-diagrams';
import { TableData  } from '../../components/TableEditor';
import { v4 as uuidv4 } from 'uuid';

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
	name?: string;
	color?: string;
}

export interface Field{
	inId ?: string,
	outId ?: string,
	fieldName : string,
	fieldType : string,
	fieldOption ?: FieldOption
}

export interface FieldOption {
	portId : string,
	ai ?: boolean
	pk ?: boolean,
	fk ?: boolean,
	notnull ?: boolean,
	defaultVal ?: string,
	fkTb ?: string,
	fkField ?: string,
	faker ?: string
}

export enum OptionEnum {
	pk = "pk",
	notnull = "notnull",
	fk = "fk",
	ai = "ai",
	defaultVal = "defaultVal",
	faker = "faker"
}

export type OptionList =  {
	name : "pk" | "fk" | "ai" | "defaultVal" | "faker",
}

export type fieldOptionSchema = {
	name : OptionEnum,
	value : any,
	type : any
}

export interface SchemaNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: DefaultNodeModelOptions;
}

export class SchemaNodeModel extends NodeModel<SchemaNodeModelGenerics> {
	protected portsIn: SchemaPortModel[];
	protected portsOut: SchemaPortModel[];
	protected fieldOptions : FieldOption[]	

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
		this.fieldOptions = []
	}

	performanceTune() : boolean { return false}

	doClone(lookupTable: {}, clone: SchemaNodeModel): void {

		console.log('original id : ' + this.getID())
		clone.portsIn = [];
		clone.portsOut = [];
		
		super.doClone(lookupTable, clone);
		let fields = []
		for (let i = 0; i < clone.portsIn.length; i++) {
			clone.fieldOptions[i].portId = clone.portsIn[i].getID()
		}
	}

	removeFieldbyId(id : string): void{
		
		let indexof = this.portsIn.findIndex(p=>p.getID() == id );

		let fieldIndex = this.fieldOptions.findIndex(f=>f.portId == id)

		if(indexof === -1) return

		if(fieldIndex !== -1){
			this.fieldOptions.splice(fieldIndex, 1);
		}

		this.removeField(indexof)
	}

	removePort(port: SchemaPortModel): void {
		super.removePort(port);
	
		if (port.getOptions().in) {
			this.portsIn.splice(this.portsIn.indexOf(port), 1);
		} else {
			this.portsOut.splice(this.portsOut.indexOf(port), 1);
		}
	}

	updateNode(tb : TableData){
	
		let fields_tb = tb.fields
		let fields = this.getAllField()
		for (let i = 0; i < fields_tb.length; i++) {
			if(fields[i].fieldName !== fields_tb[i].fieldName){
				this.portsIn[i].getOptions().label = fields_tb[i].fieldName
			}
			if(fields[i].fieldType !== fields_tb[i].fieldType){
				this.portsOut[i].getOptions().label = fields_tb[i].fieldType
			}
		}
		
	}


	addField(field : Field) : SchemaPortModel[] {
		
		let portin = this.addInPort(field.fieldName)
		let portout = this.addOutPort(field.fieldType)
		
		let add : FieldOption = {
			portId : portin.getID(),
			ai : false,
			pk : false,
			fk : false,
			fkTb : "",
			fkField : ""
		}

		this.fieldOptions.push(add)

		return [portin , portout]
	}

	removeField(i : number){

		this.removePort(this.portsIn[i])
		this.removePort(this.portsOut[i])
	}

	AddNewField(){

		let field : Field = {
			fieldName : "test",
			fieldType : "int"
		}
		this.addField(field)

	}

	addOrUpdateFieldOption(field : Field)  : void{
		let fieldIndex = this.fieldOptions.findIndex(f=>f.portId === field.inId)
		if(fieldIndex === -1) return
		
		if(field.fieldOption === undefined) return 
		this.fieldOptions[fieldIndex] = field.fieldOption
		console.log(field.fieldOption)

		//fieldrs.
		let fieldOption = field.fieldOption
		if(fieldOption == undefined) return
		
		let targetNodeId = (fieldOption.fkTb === undefined) ? "" : fieldOption.fkTb
		let targetPortId = (fieldOption.fkField === undefined) ? "" : fieldOption.fkField
		let sourceIdPort = (field.inId === undefined) ? "" : field.inId
		
		//this.linkForeignKey(targetNodeId , targetPortId ,  sourceIdPort)
	}

	linkForeignKey(targetPort : SchemaPortModel , sourcePort : SchemaPortModel , path : PathFindingLinkFactory): LinkModel | undefined{

		console.log("main field " + sourcePort.getOptions().label + " link with : " + targetPort.getOptions().label)

		let link =  targetPort.link(sourcePort )

		targetPort.reportPosition()
		sourcePort.reportPosition()
		return link
	}

	getAllField() : Field[]{
		let portins = this.portsIn
		let portouts = this.portsOut
		let rs : Field[] = []
		//console.log("get field lenght : "+ portins.length)

		//console.log(this.fieldOptions)

		for (let i = 0; i < portins.length; i++) {
			//console.log("check field " + i )
			
			let f = this.getField(i)
			//console.log(f)
			rs.push(f)
		}
		return rs
	}

	getField(index : number) : Field{

		let field = this.portsIn[index].getOptions().label
		let type = this.portsOut[index].getOptions().label
		let id = this.portsIn[index].getID()
		//console.log("check id : " + id)
		
		let fieldOptionIndex = this.fieldOptions.findIndex(f=>f.portId === id)

		//console.log("fieldopt index : " + fieldOptionIndex)

		if(fieldOptionIndex === -1){
			let r : Field = {
				inId : '',
			outId : '',
			fieldName : '',
			fieldType : '',
	
			}
			return r
		}

		let fieldOption = this.fieldOptions[fieldOptionIndex]
		//console.log("field name : " + field + " pk : " + fieldOption.pk + " fk : " + fieldOption.fk)

		if(field === undefined) field = ""
		if(type === undefined) type = ""
		
		let rs : Field = {
			inId : this.portsIn[index].getID(),
			outId : this.portsOut[index].getID(),
			fieldName : field,
			fieldType : type,
			fieldOption : fieldOption
		}

		return rs
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

	mirrorPort(port : SchemaPortModel){ // port in to port out || port out to port in
		let portRs = (port.getOptions().in) ? this.getInPorts() : this.getOutPorts()
		let index = portRs.findIndex(p=>p.getID() === port.getID())
		console.log(index)
		if(index === -1) return
		return (port.getOptions().in) ? this.getOutPorts()[index] : this.getInPorts()[index]
	}

	portInIdtoPortOut(id : string) : SchemaPortModel {
		const index =  this.getInPorts().findIndex(p=>p.getID() === id)
	
		return this.getPortOutByIndex(index)
	}

	getPortInByIndex(i:number){
		return this.portsIn[i]
	}

	getPortOutByIndex(i:number){
		return this.portsOut[i]
	}


	setNodeOption(id : string){

		let port = this.getPortFromID(id) as SchemaPortModel
		let isIn = port.getOptions().in

		if(isIn === undefined) return

		let index = -1

		if(!isIn){
			index = this.portsOut.findIndex(p=>p.getID() === id)
			if(index === -1) return
		}

		let inId = (isIn) ? id : this.getPortInByIndex(index).getID()

		let fieldIndex = this.fieldOptions.findIndex(f=>f.portId === inId)

		if(fieldIndex === -1) return
		this.fieldOptions[fieldIndex].fk = true
		
	}

	addInPort(label: string, after = true): SchemaPortModel {
		let uid = uuidv4()
		const p = new SchemaPortModel({
			in: true,
			name: uid,
			label: label,
			alignment: PortModelAlignment.LEFT
		});
		if (!after) {
			this.portsIn.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	addOutPort(label: string, after = true): SchemaPortModel {
		let uid = uuidv4()
		const p = new SchemaPortModel({
			in: false,
			name: uid,
			label: label,
			alignment: PortModelAlignment.RIGHT
		});
		if (!after) {
			this.portsOut.splice(0, 0, p);
		}
		return this.addPort(p);
	}

	getOutIdFromInId(id : string){
		let index  = this.getInPorts().findIndex(p=>p.getID() === id)
		if(index === -1) return ""
		return this.getOutPorts()[index].getID()
	}

	getInIdFromOutId(id : string){
		let index  = this.getOutPorts().findIndex(p=>p.getID() === id)
		if(index === -1) return ""
		return this.getInPorts()[index].getID()
	}

	//when convert back to model it is no function to add field and add fieldoption : 
	//fix you need 
 
	deserialize(event: DeserializeEvent<this>) {  // import
		super.deserialize(event);

		this.options.name = event.data.name;
		this.options.color = event.data.color;
		this.fieldOptions = event.data.fields

		console.log(this.fieldOptions)
		this.portsIn = _.map(event.data.portsInOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as SchemaPortModel[];
		this.portsOut = _.map(event.data.portsOutOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as SchemaPortModel[];

	}

	serialize(): any { // export

		let fields = []

		for (let i = 0; i < this.portsIn.length; i++) {
			
			let fieldOptionIndex = this.fieldOptions.findIndex(f=>f.portId === this.portsIn[i].getID())
			//console.log("fieldOptIndex : " + fieldOptionIndex)
			if(fieldOptionIndex === -1) continue
			fields.push({
				portId : this.portsIn[i].getID(),
				ai : this.fieldOptions[fieldOptionIndex].ai,
				pk : this.fieldOptions[fieldOptionIndex].pk,
				fk : this.fieldOptions[fieldOptionIndex].fk,
				notnull : this.fieldOptions[fieldOptionIndex].notnull,
				defaultVal : this.fieldOptions[fieldOptionIndex].defaultVal,
				faker : this.fieldOptions[fieldOptionIndex].faker
			})
			
		}
		
		return {
			...super.serialize(),
			name: this.options.name,
			color: this.options.color,
			fields : fields,
			portsInOrder: _.map(this.portsIn, (port) => {
				return port.getID();
			}),
			portsOutOrder: _.map(this.portsOut, (port) => {
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