import { TableData } from "../../components/TableEditor"
import { Field } from "../../schemanode/node/SchemaNodeModel"
import BaseGenerate from "./BaseGenerate"

class MySqlGenerate extends BaseGenerate {

    getFields(field : Field , isLastLine : boolean = false) : string{
        let newLineAndTab = ", \n \t"

        let ai = field.fieldOption?.ai
        let pk = field.fieldOption?.pk
        let defaultval = field.fieldOption?.defaultVal
        let notnull = field.fieldOption?.notnull

        let rs = `${field.fieldName} ${field.fieldType}` 

        if(ai !== undefined && ai) rs += " AUTO_INCREMENT"

        if(pk !== undefined && pk) rs += " PRIMARY KEY"

        if(defaultval !== undefined && defaultval !== "") rs += ` DEFAULT '${defaultval}'`

        if(notnull !== undefined && notnull) rs += " NOT NULL" 

        if(isLastLine == false) rs += newLineAndTab
        return rs 
    }
  
    getCreateTable(tb : any) : string{
        let fields = ``
        tb.fields.forEach((f: any , i : number)=>{
            let isLastLine = false
            if(tb.fields.length-1 == i) isLastLine = true
            fields += this.getFields(f , isLastLine)
        })

        return `CREATE TABLE ${tb.tablename} (\n \t${fields} \n ) `
    }

    generateFieldOption(){

    }

    generateRelation(relationData : any[]){
        let rs = ""
        relationData.forEach(r => {
            let cmd = `ALTER TABLE ${r.mainTable} ADD FOREIGN KEY (${r.mainField}) REFERENCES ${r.targetTable}(${r.targetField});`
            rs += cmd + "\n"
        });
        return rs
    }

    export(data : TableData[] , relationData : any[]) : any {

       let rs = ``
       data.forEach(d=>{
          rs += this.getCreateTable(d)
          rs += "\n \n"
       })

       rs += "\n"

       rs += this.generateRelation(relationData)

       return rs
    }
}

export default MySqlGenerate
  