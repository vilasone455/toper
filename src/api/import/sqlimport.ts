const keywords = [
    "CREATE TABLE",
    "ALTER TABLE"
]

const OnImport = (content : string)=>{
    for (let i = 0; i < content.length; i++) {
        const str = content.substr(i , content.length-1)
        readUntilFoundKeyWord(str)
    }
}



function readUntilFoundKeyWord(content : string){
    keywords.forEach(keyword => {
        let index = content.indexOf(keyword)
        if(index !== -1){ // found
            
        }
    });
}

export {OnImport}