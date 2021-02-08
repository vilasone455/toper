import createEngine, { DefaultLinkModel, DefaultNodeModel , DiagramEngine,  DiagramModel } from "@projectstorm/react-diagrams";
import { useDispatch } from "react-redux";
import {ToggleEditor} from './schemaEditorReducer'
import {OpenEditor} from './tablereducer'
import {TSCustomNodeModel} from '../custom-node-ts/TSCustomNodeModel'
import {SchemaNodeModel} from '../schemanode/node/SchemaNodeModel'
import {SchemaNodeFactory} from '../schemanode/node/SchemaNodeFactory'
import store from '../store.js'

function GetEngine() : DiagramEngine  {
 
    let rs = createEngine()


    rs.getNodeFactories().registerFactory(new SchemaNodeFactory());


    console.log("create engine")
    const model = new DiagramModel();

    let cnode = new TSCustomNodeModel({color : 'rgb(192,255,0)'})
    
    cnode.setPosition(200, 100);

    
    let snode =  new SchemaNodeModel({
		name: 'Node 1',
		color: 'rgb(0,192,255)'
	});
    snode.addField({fieldName : "Id" , fieldType : "int"})
    
    snode.setPosition(100, 100);
    var node1 = new DefaultNodeModel({
		name: 'Node 1',
		color: 'rgb(0,192,255)'
	});
	node1.setPosition(100, 100);
	let port1 = node1.addOutPort('id');
    node1.addInPort('int');

	//3-B) create another default node
	var node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
	let port2 = node2.addInPort('product_id');
    node2.addOutPort('int');
	node2.setPosition(400, 100);

	// link the ports
	let link1 = port1.link<DefaultLinkModel>(port2);
	link1.getOptions().testName = 'Test';
	link1.addLabel('Hello World!');
    
    const models = model.addAll(node1, node2  , snode , link1);
    
    models.forEach(m => {
        m.registerListener({
			selectionChanged: () => onclick(m.getID())
		});

    });
    
    rs.setModel(model);


    return rs
}

function onclick(id : String){
    //alert(id)
    //const dispatch = useDispatch()
    //dispatch(ToggleEditor())
    //store.dispatch(ToggleEditor())
    console.log(id)
    store.dispatch(OpenEditor(false))
}

const engine = GetEngine()
export {engine}