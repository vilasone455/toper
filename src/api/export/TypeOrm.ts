import BaseGenerate from "./BaseGenerate";

class TypeOrm extends BaseGenerate {

    getFields(field : any) : string{

        let mapSqltoOrm : any = {
            "interger" : "number",
            "varchar" : "string"
        }
        
        let ai = field.fieldOption?.ai
        let pk = field.fieldOption?.pk
        let defaultval = field.fieldOption?.defaultVal

        let rs = `@Column()`

        if(pk !== undefined && pk){
            rs = "@PrimaryGeneratedColumn()"
        }else if(ai !== undefined && ai){
            
        }

        rs += "\n \t"        
        rs += `${field.fieldName} ${mapSqltoOrm[field.fieldType]}; \n \t`

        return rs
    }
  
    getCreateTable(tb : any) : string{

        let fields = ``
        tb.fields.forEach((f: any , i : number)=>{
            fields += this.getFields(f )
        })

        return `
@Entity()
export class ${tb.tablename} {
${fields} \t
}`
    }

    export(data : any[] , relationData : any[]) : any[] {

        let rs : any[] = []
       data.forEach(d=>{
          let content = this.getCreateTable(d)
          rs.push({filename : d.tablename , content : content})
       })
        
      return rs
    }
}

export default TypeOrm