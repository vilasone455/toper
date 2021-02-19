
import {Action, InputType, BaseModel } from '@projectstorm/react-canvas-core';


/**
 * Handles delete actions.
 */
export default class DeleteAction extends Action {
  constructor(areShortcutsAllowed : boolean) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        console.log(JSON.stringify(event))
        //if (!areShortcutsAllowed) return;
        if (this.engine.getModel().isLocked()) return;
        
        if (this.matchesInput(event)) {
          event.preventDefault();
          this.handleAction();
        }
      },
    });
  }

  matchesInput(event : any) : boolean{
    return event.ctrlKey && event.code === 'Delete'
  }

  handleAction = () => {
    console.log("delete")
    const entities = this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => !model.isLocked());

    //this.fireEvent(entities);

    entities.forEach(model => model.remove());

    this.engine.repaintCanvas();
  };

 
}
