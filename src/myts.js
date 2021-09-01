import SeedGenerator from './api/seed-generator/SeedGenerator'

let testTable = [
    {
        tablename : "Product",
        fields : [
            {
                fieldName : "id",
                fieldType : "int",
                fieldOption : {
                    ai : true,
                    pk : true,
                    fk : true,
                    defaultVal : "",
                }
            }
        ]
    }
]

let relations = [

]

let seedGen = new SeedGenerator()

console.log("fxasf")

seedGen.generate(testTable , relations)