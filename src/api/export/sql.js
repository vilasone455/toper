import {displayList} from './helperFunction'

export default function getExport(dataSet){
    return `
    
    Create Table ${dataset.name}
    ${displayList(dataSet.list)}
    
    `
}