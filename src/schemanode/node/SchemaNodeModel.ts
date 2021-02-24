import * as _ from 'lodash';
import { NodeModel, NodeModelGenerics, PortModel, PortModelAlignment } from '@projectstorm/react-diagrams-core';
import { SchemaPortModel } from '../port/SchemaPortModel';
import { BasePositionModelOptions, DeserializeEvent } from '@projectstorm/react-canvas-core';
import { DefaultLinkModel, DefaultPortModel, DiagramEngine, LinkModel } from '@projectstorm/react-diagrams';
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
	fkTb ?: string,
	fkField ?: string
}

export interface SchemaNodeModelGenerics extends NodeModelGenerics {
	OPTIONS: DefaultNodeModelOptions;
}

export class SchemaNodeModel extends NodeModel<SchemaNodeModelGenerics> {
	protected portsIn: DefaultPortModel[];
	protected portsOut: DefaultPortModel[];
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

	removePort(port: DefaultPortModel): void {
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


	addField(field : Field) : DefaultPortModel[] {
		
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

	linkForeignKey(targetNode : SchemaNodeModel ,targetIdPort : string , sourceInIdPort : string): LinkModel | undefined{
		alert('do link')
		let targetPort = targetNode.getPortFromID(targetIdPort) as DefaultPortModel
		let sourceport = this.getPortFromID(sourceInIdPort)  as DefaultPortModel  // find  sourePort
		if(sourceport === null) return undefined
		if(targetPort === null) return undefined
		alert('complete link')
		console.log("main field " + sourceport.getOptions().label + " link with : " + targetPort.getOptions().label)
		console.log(sourceport.getOptions().in)
		console.log(targetPort.getOptions().in)
		let link =  targetPort.link(sourceport)

		targetPort.reportPosition()
		sourceport.reportPosition()
		return link
	}

	getAllField() : Field[]{
		let portins = this.portsIn
		let portouts = this.portsOut
		let rs : Field[] = []
		console.log("get field lenght : "+ portins.length)

		console.log(this.fieldOptions)

		for (let i = 0; i < portins.length; i++) {
			console.log("check field " + i )
			
			let f = this.getField(i)
			console.log(f)
			rs.push(f)
		}
		return rs
	}

	getField(index : number) : Field{

		let field = this.portsIn[index].getOptions().label
		let type = this.portsOut[index].getOptions().label
		let id = this.portsIn[index].getID()
		console.log("check id : " + id)
		
		let fieldOptionIndex = this.fieldOptions.findIndex(f=>f.portId === id)

		console.log("fieldopt index : " + fieldOptionIndex)

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
		console.log("field name : " + field + " pk : " + fieldOption.pk + " fk : " + fieldOption.fk)

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

	updatePort(port: SchemaPortModel , index : number){
		
	}

	addPort<T extends DefaultPortModel>(port: T): T {


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

	addInPort(label: string, after = true): DefaultPortModel {
		let uid = uuidv4()
		const p = new DefaultPortModel({
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

	addOutPort(label: string, after = true): DefaultPortModel {
		let uid = uuidv4()
		const p = new DefaultPortModel({
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

	//when convert back to model it is no function to add field and add fieldoption : 
	//fix you need 

	deserialize(event: DeserializeEvent<this>) {
		super.deserialize(event);

		this.options.name = event.data.name;
		this.options.color = event.data.color;
		this.fieldOptions = event.data.fields
		console.log(this.fieldOptions)
		this.portsIn = _.map(event.data.portsInOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as DefaultPortModel[];
		this.portsOut = _.map(event.data.portsOutOrder, (id : any) => {
			return this.getPortFromID(id);
		}) as DefaultPortModel[];
		console.log("deserial call on shemaModel")

		console.log("after deserial")

	}

	deserializeFieldOption(){

	}

	serializeClone(c : any){
		console.log('serial clone')
		console.log(c)
	}

	serialize(): any {

		console.log("call serialize on model")

		let fields = []

		console.log(this.fieldOptions)

		for (let i = 0; i < this.portsIn.length; i++) {
			
			let fieldOptionIndex = this.fieldOptions.findIndex(f=>f.portId === this.portsIn[i].getID())
			console.log("fieldOptIndex : " + fieldOptionIndex)
			if(fieldOptionIndex === -1) continue
			fields.push({
				portId : this.portsIn[i].getID(),
				fieldName : this.portsIn[i].getOptions().label,
				fieldType : this.portsOut[i].getOptions().label,
				ai : this.fieldOptions[fieldOptionIndex].ai,
				pk : this.fieldOptions[fieldOptionIndex].pk
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

	toJson() : any{
		
		let fields = []
		for (let i = 0; i < this.portsIn.length; i++) {
			let fieldOptionIndex = this.fieldOptions.findIndex(f=>f.portId === this.portsIn[i].getID())
			if(fieldOptionIndex === -1) continue
			let field = {
				fieldName : this.portsIn[i].getOptions().label,
				fieldType : this.portsOut[i].getOptions().label,
				fieldOption : this.fieldOptions[fieldOptionIndex]
			}
			fields.push(field)
		}
		let rs = {
			name : this.options.name,
			color : this.options.color,
			fields : fields
		}
		return rs
	}

	getInPorts(): DefaultPortModel[] {
		return this.portsIn;
	}

	getOutPorts(): DefaultPortModel[] {
		return this.portsOut;
	}

	
}