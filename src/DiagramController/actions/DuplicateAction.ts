import { DiagramModel, LinkModel, NodeModel } from '@projectstorm/react-diagrams';

import { Action, InputType } from '@projectstorm/react-canvas-core';

import {BaseModel} from '@projectstorm/react-canvas-core';

/**
 * Handle duplication (clone) actions.
 */
export default class DuplicateAction extends Action {
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
    return event.ctrlKey && event.code === 'KeyD'
  }

  handleAction = () => {
    const model = this.engine.getModel() as DiagramModel

    const clones : BaseModel[] = model 
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel)
      .filter(entity => !entity.isLocked())
      .map(entity => entity.clone());

    model.clearSelection();

    clones.forEach(clone => {

      if (clone instanceof NodeModel) {
        model.addNode(clone)
        clone.setSelected(true);
      }
      
      
    });

    //this.engine.fireEvent({ nodes: clones }, 'componentsAdded');

    this.engine.repaintCanvas();
  };
}
