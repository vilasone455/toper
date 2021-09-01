import { TableData } from "../../components/TableEditor"
import { Relation } from "../../interface/Relation"

export function setDefaultSeedPropertie(tbs: TableData[], relations: Relation[]) {
    tbs.forEach(tb => {
        tb.fields.forEach(f => {
            let fieldOpt = f.fieldOption
            if (fieldOpt !== undefined) {
                let faker = fieldOpt.faker
                if (faker === undefined || faker === "") {
                    let fieldType = f.fieldType
                    let fieldName = f.fieldName
                    let newFaker = fieldTypeAndNameToFaker(fieldName, fieldType)
                    fieldOpt.faker = newFaker
                }
            }
        })
    })
    return tbs
}

function fieldTypeAndNameToFaker(fieldName: string, fieldType: string) {
    switch (fieldType) {
        case "int":
            return "datatype.number"
        case "float":
            return "datatype.float"
        case "varchar":
            return "datatype.string"
        case "bool":
            return "datatype.boolean";   
        case "date":
            return "datatype.datetime"
    }
}