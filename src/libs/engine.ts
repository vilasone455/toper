import createEngine, { DefaultLinkModel, DefaultNodeModel , DiagramEngine,  DiagramModel , PathFindingLinkFactory } from "@projectstorm/react-diagrams";


import {SchemaNodeModel} from '../schemanode/node/SchemaNodeModel'
import {SchemaNodeFactory} from '../schemanode/node/SchemaNodeFactory'

import { SchemaPortFactory } from "../schemanode/port/SchemaPortFactory";



function GetEngine() : DiagramEngine  {
 
    let rs = createEngine({registerDefaultDeleteItemsAction: false,
})

    rs.getNodeFactories().registerFactory(new SchemaNodeFactory());
	rs.getPortFactories().registerFactory(new SchemaPortFactory())


    const model = new DiagramModel();


    /*
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
    */
    
    rs.setModel(model);

    return rs
}



const engine = GetEngine()
export {engine , GetEngine}