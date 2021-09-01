//code template is code generate template to zip 

import JSZip from "jszip";
import BaseGenerate from "../export/BaseGenerate";
import { saveAs } from 'file-saver'

export class BaseCodeTemplate extends BaseGenerate {

    //logic how each file which generate from schema should be 
    //ex : user_table => UserSchema |& UserController |& UserMigration |& UserForm |& UserCrud ....
    export(data : any[] , relationData : any[]) : any{return []}   

    //logic how to file structure of template should be
    //ex : laravel template => model/tablename 
    generateCodeToZip(data : any[] , relationData : any[] , filename : string) {
        let filelist = this.export(data, relationData)
        let zip = new JSZip()
        filelist.forEach((f:any)=>{
            zip.file(f.folder + "/" + f.filename + ".js" , f.content)
        })
        zip.generateAsync({type: "blob"}).then(rs=> saveAs(rs , filename+".zip"))
    }

    
}