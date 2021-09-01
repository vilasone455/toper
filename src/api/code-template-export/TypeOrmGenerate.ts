import JSZip from 'jszip'
import { BaseCodeTemplate } from './BaseCodeTemplate'
import {saveAs} from 'file-saver'
import { camelCase, pascalCase } from "change-case";
import { lowerCase } from 'lodash';

export class TypeOrmGenerate extends BaseCodeTemplate {
  
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

    getController(tb:any) : string{
        let tbname = pascalCase(tb.tablename)
        let tbnameCamel = camelCase(tb.tablename)
        let rs = `import {getRepository} from "typeorm"; 
        import {NextFunction, Request, Response} from "express"; 
        import {${tbname}} from "../entity/${tbname}"; 
        
        export class ${tbname}Controller {
        
           private ${tbnameCamel}Repository = getRepository(${tbname}); 
           
           async all(request: Request, response: Response, next: NextFunction) { 
              return this.${tbnameCamel}Repository.find(); 
           } 
           
           async one(request: Request, response: Response, next: NextFunction) { 
              return this.${tbnameCamel}Repository.findOne(request.params.id); 
           } 
           
           async save(request: Request, response: Response, next: NextFunction) { 
              return this.${tbnameCamel}Repository.save(request.body); 
           } 
           
           async remove(request: Request, response: Response, next: NextFunction) { 
              let ${tbnameCamel}ToRemove = await this.${tbnameCamel}Repository.findOne(request.params.id); 
              await this.${tbnameCamel}Repository.remove(${tbnameCamel}ToRemove); 
           } 
        }
        `
        return rs
    }

    getRoute(tb:any){
        let tbname = pascalCase(tb.tablename)
        let tbnameLower =lowerCase(tb.tablename)
        let rs = `
        { 
            method: "get", 
            route: "/${tbnameLower}", 
            controller: ${tbname}Controller, action: "all" 
        }, { 
            method: "get", 
            route: '/${tbnameLower}/:id', controller: ${tbname}Controller, action: "one" 
        }, { 
            method: "post", 
            route: "/${tbnameLower}", 
            controller: ${tbname}Controller, action: "save" 
        }, { 
            method: "delete", route: '/${tbnameLower}/:id', controller: ${tbname}Controller,
            action: "remove" 
        },\n`
      let routeImport = `import {${tbname}Controller} from "../controller/${tbname}Controller"; `
      return {content : rs , import : routeImport}
    }

    export(data : any[] , relationData : any[]) : any[] {
        let rs : any[] = []
        let routeContent = "["
        let routeImports = ""
        data.forEach(d=>{
            let content = this.getCreateTable(d)
            let controller = this.getController(d)
            let route = this.getRoute(d)
            routeContent += route.content
            routeImports += route.import + "\n"
            rs.push({filename : d.tablename , content : content , folder : "entity"})
            rs.push({filename : d.tablename + "Controller" , content : controller , folder : "controller"})
        })
        routeContent += "\n]"
        let routeRs = `${routeImports} \n
export const Routes = ${routeContent}`
        rs.push({filename : "index" , content : routeRs , folder : "routes"})
        return rs
    }

    generateCodeToZip(data: any[], relationData: any[] , filename : string) {
        let filelist = this.export(data, relationData)
        let zip = new JSZip()
        filelist.forEach(f=>{
            zip.file(f.folder + "/" + f.filename + ".js" , f.content)
        })
        zip.generateAsync({type: "blob"}).then(rs=> saveAs(rs , filename+".zip"))
        
    }

}