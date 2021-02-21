import BaseGenerate from "./BaseGenerate"

class MySqlGenerate extends BaseGenerate {

    getFields(field : any , isLastLine : boolean = false) : string{
        let newLineAndTab = ", \n \t"
        let rs = `${field.fieldName} ${field.fieldType}` 
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

    export(data : any[]) : any {

        let rs = ``
       data.forEach(d=>{
          rs += this.getCreateTable(d)
          rs += "\n \n"
       })
       return rs
    }
}

export default MySqlGenerate
  