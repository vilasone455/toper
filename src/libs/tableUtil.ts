import { TableData } from "../components/TableEditor";
import { DiagramController } from "../DiagramController/DiagramCtr";
import { SchemaNodeModel } from "../schemanode/node/SchemaNodeModel";

function getAllTable(diagram : DiagramController) : TableData[]{
    let rs : TableData[] = []
    let alltb = diagram.getEngine().getModel().getNodes() as SchemaNodeModel[]
    alltb.forEach(tb => {
      let name =tb.getOptions().name
      if(name == undefined) name = ""
      let add : TableData = {
        id : tb.getID(),
        tablename : name,
        fields : tb.getAllField()
      }
      rs.push(add)
    });
    return rs
}

export {getAllTable}