import { DefaultLinkModel, LabelModel } from '@projectstorm/react-diagrams';
import {  DeserializeEvent } from '@projectstorm/react-canvas-core';
export class SchemaLinkModel extends DefaultLinkModel {
    
    //ຕົວແປທີ່ກຳຫນົດວ່າ ref ທີ່ເປັນ belong to ແມ່ນມາຈາກ Port In ຫລື ຫນ້າ ຫລື ບໍ່
    public RefInPort : boolean = false

    setLabels(labelset : LabelModel[]){
        alert("set label")
        this.labels = labelset
    }

}