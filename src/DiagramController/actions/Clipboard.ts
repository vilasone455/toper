import { Action, InputType , DeserializeEvent } from '@projectstorm/react-canvas-core';

import {BaseModel} from '@projectstorm/react-canvas-core';
import { DiagramModel, NodeModel } from '@projectstorm/react-diagrams';
import Base from 'antd/lib/typography/Base';
import { SchemaNodeModel } from '../../schemanode/node/SchemaNodeModel';


/**
 * Handles clipboard actions.
 */
export default class ClipboardAction extends Action {
  constructor(areShortcutsAllowed : boolean) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();

          const e : any = event;
          if (e.code === 'KeyX') this.handleCut();
          if (e.code === 'KeyC') this.handleCopy();
          if (e.code === 'KeyV') this.handlePaste();
        }
      },
    });
  }

  matchesInput(event : any) : boolean{
        return event.ctrlKey && (event.code === 'KeyX' || event.code === "KeyC" || 
        event.code === "KeyV")     
  }

  getSelectedComponents = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(entity => entity instanceof SchemaNodeModel)
      .filter(entity => !entity.isLocked());

  /** Cut */
  handleCut() {
    let selectNodes = this.getSelectedComponents() as SchemaNodeModel[]
    let clonenode = selectNodes[0].clone()
    const copie = clonenode.serialize()

    localStorage.setItem('clipboard', JSON.stringify(copie));

    selectNodes.forEach(model => model.remove());

    this.engine.repaintCanvas();

  };

  /** Copy */
  handleCopy() {
    let selectNodes = this.getSelectedComponents() as SchemaNodeModel[]
    let clonenode = selectNodes[0].clone()
    const copie = clonenode.serialize()


    console.log(copie)

    localStorage.setItem('clipboard', JSON.stringify(copie));
  };

  onPromise(id : string) {
    return new Promise<BaseModel>((resolve, reject) => {
      let rs = new SchemaNodeModel()
      resolve(rs);
    });
  }


  /** Paste */
  handlePaste() {


    let clipboardstr = localStorage.getItem('clipboard')

    if(clipboardstr == null) clipboardstr = ""

    const clipboard = JSON.parse(clipboardstr);
    if (!clipboard) return;

    console.log(clipboard)


    let pastemodel = new SchemaNodeModel()
 
    let deserializeData : any = {
      data : clipboard,
      engine : this.engine,
      registerModel: () => {},
    }

    pastemodel.deserialize(deserializeData)
    
  
    pastemodel.setPosition(100, 100);

    console.log(pastemodel)
    let model = this.engine.getModel() as DiagramModel
    model.addAll(pastemodel)


    //this.engine.fireEvent( nodes: models , 'componentsAdded');

    this.engine.repaintCanvas();
  };




  
}
