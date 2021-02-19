import { DiagramModel, LinkModel, NodeModel } from '@projectstorm/react-diagrams';

import { Action, InputType } from '@projectstorm/react-canvas-core';

import {BaseModel} from '@projectstorm/react-canvas-core';
import { SchemaNodeModel } from '../../schemanode/node/SchemaNodeModel';

/**
 * Handle duplication (clone) actions.
 */
export default class NewNodeAction extends Action {
  constructor(areShortcutsAllowed : boolean) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();
          this.handleAction();
        }
      },
    });
  }

  matchesInput(event : any) : boolean{
    return event.ctrlKey && event.code === 'KeyB'
  }

  handleAction = () => {
     
    let snode =  new SchemaNodeModel({
		name: 'Product',
		color: 'rgb(0,192,255)'
	});
    snode.addField({fieldName : "Id" , fieldType : "int"})

    snode.setPosition(100, 100);

    let model = this.engine.getModel() as DiagramModel

    model.addAll(snode)

    //this.engine.fireEvent({ nodes: clones }, 'componentsAdded');

    this.engine.repaintCanvas();
  };
}
