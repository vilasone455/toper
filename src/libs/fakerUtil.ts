import { TableData } from "../components/TableEditor"
import { Field } from "../schemanode/node/SchemaNodeModel"

export const defaultFakerForTable = (tbs:TableData[]) => {
    let tables = [...tbs]
    tables.forEach(tb=>{
        const tbname = tb.tablename
        tb.fields.forEach(f=>{
            let fieldOption = f.fieldOption
            if(fieldOption !== undefined){
                let faker = fieldOption.faker
                if(faker === undefined || faker === ""){
                    fieldOption.faker = mapFieldToDefaultFaker(f)
                }else{
                    //alert(tbname + "is have faker field : " + f.fieldName)
                }
            }
            
        })
        console.log(tb.fields)
    })
    return tables
}

const mapFieldToDefaultFaker = (field : Field) : any => {
    switch (field.fieldType) {
        case "int": return "number"
        case "float": return "float"
        case "varchar": return "string"
        case "bool": return "boolean"
        
    }
}