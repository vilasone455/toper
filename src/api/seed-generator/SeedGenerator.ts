import { TableData } from "../../components/TableEditor";
import { Relation } from "../../interface/Relation";
import faker from 'faker'
import { Field } from "../../schemanode/node/SchemaNodeModel";

interface Seed {
    [seedName: string]: SeedData[]
}

interface SeedData {
    [fieldName: string]: any
}

interface TableWithRelation {
    tableName: string
    fields: FieldWithRelation[]
}

interface FieldWithRelation extends Field {
    targetTable: string
    targetField: string
    relationType: string
}

export class SeedGenerator {

    generate(tables: TableData[], relations: Relation[]) {
        let noneRelationData = this.getNonRelationData(tables, relations)
        let seeds: Seed = this.getSeedNoneRelationData(noneRelationData)
        let tableWithRelations: TableWithRelation[] = this.mergetTableWithRelation(tables, relations)
        //console.log(seeds)
        //console.log(tableWithRelations)
        let testFaker = faker.address.city
        console.log(testFaker)
        let relationSeed = this.getRelationSeedData(tableWithRelations, seeds)
        console.log(relationSeed)
        return this.generateSeedScript(relationSeed)
    }

    generateSeedScript(seeds : Seed){
        let insertSql = ""
        for (const tbname in seeds) {
            const tb = seeds[tbname];
            
            tb.forEach(row => {
                let fieldNameList = Object.keys(row)
                let fieldValueList = Object.values(row)
                let fieldNameSql = fieldNameList.join(", ")
                let fieldValueSql = fieldValueList.map(f => `'${f}'`).join(',');
                let sql = `INSERT INTO ${tbname} (${fieldNameSql}) VALUES (${fieldValueSql}); \n`
                insertSql += sql
            });
            insertSql += "\n"
        }

        return insertSql
    }

    mergetTableWithRelation(tables: TableData[], relations: Relation[]) {
        let rs: TableWithRelation[] = []
        tables.forEach(tb => {
            let relationOfTb = relations.filter(r => r.mainTable === tb.tablename)

            if (relationOfTb.length > 0) { // add
                let fields: FieldWithRelation[] = []

                tb.fields.forEach(f => {
                    let targetTable = ""
                    let targetField = ""
                    let relationType = ""
                    let relationData = relationOfTb.find(r => r.mainField === f.fieldName)
                    if (relationData !== undefined) {
                        targetTable = relationData.targetTable
                        targetField = relationData.targetField
                        relationType = relationData.relationType
                    }
                    let add: FieldWithRelation = { ...f, targetTable, targetField, relationType }
                    fields.push(add)
                });

                let add = {
                    tableName: tb.tablename,
                    fields
                }
                rs.push(add)
            }
        });
        return rs
    }

    getNonRelationData(tables: TableData[], relations: Relation[]) {
        let noneRelationData = [...tables];
        for (let i = 0; i < relations.length; i++) {
            let indexof = noneRelationData.findIndex(t => t.tablename === relations[i].mainTable)
            if (indexof !== -1) {   // found
                noneRelationData.splice(indexof, 1);
            }
        }
        return noneRelationData
    }

    getSeedNoneRelationData(noneRelationData: TableData[]) {
        let seeds: Seed = {}
        for (let i = 0; i < noneRelationData.length; i++) {
            let fields = noneRelationData[i].fields;
            seeds[noneRelationData[i].tablename] = this.generateNoneRelationData(4, fields)
        }
        return seeds
    }

    generateNoneRelationData(cout: number, fields: Field[]): SeedData[] {
        let rs: SeedData[] = [];
        for (let row = 0; row < cout; row++) {
            let add: SeedData = {};
            for (let i = 0; i < fields.length; i++) {
                let random = this.mapFakerRandom(fields[i].fieldOption?.faker)
                add[fields[i].fieldName] = random;
            }
            rs.push(add)
        }
        return rs;
    }

    getRelationSeedData(tables: TableWithRelation[], seeds: Seed): any {
        if (tables.length > 0) {
            for (let i = 0; i < tables.length; i++) {
                let isCanGenerate = this.isCanGenerateYet(tables[i], seeds)
                if (isCanGenerate) {
                    //generate 
                    let addSeed: SeedData[] = this.onGenerateRelationSeed(4, tables[i], seeds)

                    //add seed
                    seeds[tables[i].tableName] = addSeed

                    //remove table
                    tables.splice(i, 1)
                }
            }
            return this.getRelationSeedData(tables, seeds)
        }

        return seeds

    }

    isCanGenerateYet(tb: TableWithRelation, seeds: Seed) {
        let seedNameList = Object.keys(seeds)
        let isPass = true
        for (let i = 0; i < tb.fields.length; i++) {
            const field = tb.fields[i];
            if (field.targetField !== "") {
                isPass = seedNameList.includes(field.targetTable)
                alert(field.fieldName + " " + field.targetTable)

                if (!isPass) {
                    isPass = false
                    break
                }
            }
        }
        return isPass

    }

    // generate each table 
    onGenerateRelationSeed(cout: number, table: TableWithRelation, seeds: Seed): SeedData[] {
        let rs: SeedData[] = []
        seeds[table.tableName] = []
        for (let i = 0; i < cout; i++) {
            let add: SeedData = {}
            table.fields.forEach(f => {

                if (f.targetField !== "") { // if field is relation 
                    if (f.relationType === "1:N") {
                        //user_id target : user 
                        add[f.fieldName] = this.oneToManyGenerate(f, seeds)
                    } else if(f.relationType === "1:1") {
                        let mainSeed = seeds[table.tableName]
                        
                        add[f.fieldName] = this.oneToOneGenerate(mainSeed,f, seeds)
                    }
                } else  { //normal gen
                    let random = this.mapFakerRandom(f.fieldOption?.faker)
                    add[f.fieldName] = random
                }

            })
            rs.push(add)
            seeds[table.tableName] = rs

        }

        return rs;
    }

    normalRandom(fieldName: string) {
        let a = Math.floor(Math.random() * 11).toString();
        let b = Math.floor(Math.random() * 11).toString();
        let c = Math.floor(Math.random() * 11).toString();
        return fieldName + a + b + c
    }

    oneToManyGenerate(field: FieldWithRelation, seeds: Seed) {
        let seedListName = Object.keys(seeds)
        let rs = ""
        let indexofSeed = seedListName.indexOf(field.targetTable)
        if (indexofSeed !== -1) {
            let seedName = seedListName[indexofSeed]
            let targetSeed = seeds[seedName]
            let randomData = this.randomArray(targetSeed)
            rs = randomData[field.targetField]
        }
        return rs
    }



    //one to one is generate without duplcate data and must same lenght of target
    //ex user and profile : if user(target) have 5 row and profile must 5 row
    oneToOneGenerate(mainSeed : SeedData[] ,field: FieldWithRelation, seeds: Seed) {
        
        let targetSeed = seeds[field.targetTable]
        let random = ""
        let fieldName = field.fieldName
        let targetField = field.targetField
        //ex field is user_id , mainSeed is order => id , user_id , date 
        if (Array.isArray(mainSeed)) {
            let randomArr = targetSeed.map(m => m[targetField]);
            let fieldCheck = mainSeed.map(m => m[fieldName]);
            random = this.randomUniqueArray(randomArr, fieldCheck);

        }
        return random
    }

    randomArray(arr: SeedData[]) {
        let randomIndex = Math.floor(Math.random() * arr.length)
        return arr[randomIndex]
    }

    mapFakerRandom(type:string | undefined) : any{
        if(type === undefined || type === "") return "" 
        switch(type){
            case "number" : return faker.datatype.number(6)
            case "float" : return faker.datatype.float(6)
            case "string" : return faker.datatype.string(6)
            case "uuid" : return faker.datatype.uuid()
            case "productName" : return faker.commerce.productName()
            case "name" : return faker.name.findName()
            case "boolean" : return faker.datatype.boolean()
        }
    }

    randomUniqueArray(randomSet : any[] , fieldCheck : any[]) : any{
        // randomset user = [u1 , u2 , u3 , u4]  ,
        //random is from randomset 
        //fieldcheck order.user_id = [u1 , ... n]
        let randomIndex = Math.floor(Math.random() * randomSet.length)
        let randomData = randomSet[randomIndex]
        let isDuplicate = fieldCheck.includes(randomData)
        if(isDuplicate){
            return this.randomUniqueArray(randomSet , fieldCheck)
        }
        return randomData
    }

}
