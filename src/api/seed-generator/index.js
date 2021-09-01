// Import stylesheets
import "./style.css";
import * as faker from "faker";

let tables = [
  {
    tablename: "user",
    fields: [
      {
        name: "id",
        type: "number"
      },
      {
        name: "user_name",
        type: "firstName"
      },
      {
        name: "user_password",
        type: "number"
      }
    ]
  },
  {
    tablename: "profile",
    fields: [
      {
        name: "id",
        type: "number"
      },
      {
        name: "profile_name",
        type: "name"
      },
      {
        name: "user_id",
        type: "number"
      }
    ]
  },
  {
    tablename: "product",
    fields: [
      {
        name: "id",
        type: "number"
      },
      {
        name: "product_name",
        type: "productName"
      },
      {
        name: "product_price",
        type: "price"
      }
    ]
  },
  {
    tablename: "order",
    fields: [
      {
        name: "id",
        type: "number"
      },
      {
        name: "seller_id",
        type: "number"
      },
      {
        name: "date",
        type: "number"
      }
    ]
  },
  {
    tablename: "order_item",
    fields: [
      {
        name: "id",
        type: "number"
      },
      {
        name: "order_id",
        type: "number"
      },
      {
        name: "product_id",
        type: "number"
      },
      {
        name: "qty",
        type: "number"
      }
    ]
  }
];

let relations = [
  {
    mainTable: "profile",
    mainField: "user_id",
    connectTable: "user",
    connectField: "id",
    relationType: "1:1"
  },
  {
    mainTable: "order",
    mainField: "seller_id",
    connectTable: "profile",
    connectField: "id",
    relationType: "1:N"
  },
  {
    mainTable: "order_item",
    mainField: "order_id",
    connectTable: "order",
    connectField: "id",
    relationType: "1:N"
  },
  {
    mainTable: "order_item",
    mainField: "product_id",
    connectTable: "product",
    connectField: "id",
    relationType: "1:N"
  }
];

let noneRelationData = [...tables];


for (let i = 0; i < relations.length; i++) {
  let indexof = noneRelationData.findIndex(
    t => t.tablename === relations[i].mainTable
  );

  if (indexof !== -1) {
    // found
    noneRelationData.splice(indexof, 1);
  }
}

let seeds = {};

for (let i = 0; i < noneRelationData.length; i++) {
  //gen non relation data
  let fields = noneRelationData[i].fields;
  seeds[noneRelationData[i].tablename] = [];
  let rs = [];
  rs = loopGen(4, fields);
  seeds[noneRelationData[i].tablename] = rs;
}

//alert(JSON.stringify(seeds));
let relationMustGen = [];
for (let i = 0; i < relations.length; i++) {
  let ele = relations[i];
  let indexof = relationMustGen.findIndex(r => r.mainTable === ele.mainTable);
  let relationAdd = {
    mainField: ele.mainField,
    connectTable: ele.connectTable,
    connectField: ele.connectField,
    relationType: ele.relationType
  };
  if (indexof === -1) {
    let add = {
      mainTable: ele.mainTable,
      relations: [relationAdd]
    };

    relationMustGen.push(add);
  } else {
    relationMustGen[indexof].relations.push(relationAdd);
  }
}

let rsSeed = onGenerateRelation(tables, relationMustGen, seeds);

for (const k in rsSeed) {
  console.log(k);
  console.log(rsSeed[k]);
}

function onGenerateRelation(tables, relationMustGen, seeds) {
  if (relationMustGen.length > 0) {
    for (let i = 0; i < relationMustGen.length; i++) {
      let ele = relationMustGen[i];
      let isCanGenerate = indexOfRelationSeedTable(ele, seeds);
      //alert(ele.mainTable)
      //for generate relation all target field current must have seed 
      //ex: generate order => id , user_id , seller_id but seed is only have user then cannot generate must all field in seed
      if (isCanGenerate.length > 0) {
        let addseed = generateRelationData(tables, ele, seeds, isCanGenerate);
        seeds[ele.mainTable] = addseed;
        relationMustGen.splice(i, 1);
      }
    }
    onGenerateRelation(tables, relationMustGen, seeds);
  }
  //
  //alert("e");
  //alert(seeds);

  return seeds;
}

function generateRelationData(tables, ele, seeds, indexofRelation) {
  let tb = tables.find(t => t.tablename === ele.mainTable);
  let relations = ele.relations;
  let fields = tb.fields;
  let cout = 4;
  let rs = [];
  //console.log(seeds);
  for (let row = 0; row < cout; row++) {
    let add = {};
    for (let i = 0; i < fields.length; i++) {
      // loop propertie
      //check is
      let fieldName = fields[i].name;
      let relationIndex = relations.findIndex(r => r.mainField === fieldName);
      if (relationIndex === -1) { // dont relation field
        let random = getGenerateString(fields[i].type);
        add[fields[i].name] = random;
      } else {
        let connectTable = relations[relationIndex].connectTable;
        let mainField = relations[relationIndex].mainField;
        let relationType = relations[relationIndex].relationType;
        //console.log(ele.mainTable);
        let mainSeed = seeds[ele.mainTable];
        let randomSource = randomRelationData(
          mainSeed,
          mainField,
          relationType,
          seeds[connectTable],
          relations[relationIndex].connectField
        );
        add[fields[i].name] = randomSource;
      }
    }
    rs.push(add);
    seeds[ele.mainTable] = rs;
  }

  return rs;
}

function randomRelationData(
  mainSeed,
  mainField,
  relationType,
  targetSeed,
  targetField
) {
  //console.log("main field : " + mainField + " realtion : " + relationType)

  let index = Math.floor(Math.random() * targetSeed.length);

  if (relationType === "1:N") {
    let random = targetSeed[index][targetField];
    return random;
  } else {
    let random = targetSeed[index][targetField];

    if (Array.isArray(mainSeed)) {
      let randomArr = targetSeed.map(m => m[targetField]);
      let fieldCheck = mainSeed.map(m => m[mainField]);
      random = randomUniqueArray(randomArr, fieldCheck);
      //console.log(randomData)
      //console.log(fieldDataCheck);
      let isDuplicate = mainSeed.findIndex(m => m[mainField] === random);
    }

    return random;
  }

  //if random is in seeds & 1:1 => random until get new random duplicate
}

function randomUniqueArray(arr, arrCheck) {
  let index = Math.floor(Math.random() * arr.length);
  let randomData = arr[index];
  //console.log(arrCheck);
  //console.log("random found " + randomData);
  //console.group()
  let isDuplicate = arrCheck.includes(randomData);
  //console.log(isDuplicate);
  if (isDuplicate) {
    //
    return randomUniqueArray(arr, arrCheck);
  } else {
    return randomData;
  }
}

//alert(JSON.stringify(relationMustGen));

function loopGen(cout, fields) {
  let rs = [];

  for (let row = 0; row < cout; row++) {
    let add = {};
    for (let i = 0; i < fields.length; i++) {
      let random = getGenerateString(fields[i].type);
      add[fields[i].name] = random;
    }
    rs.push(add);
  }

  return rs;
}

function indexOfRelationSeedTable(relation, generatedData) {
  let generatedTable = Object.keys(generatedData);
  let indexofTable = [];
  for (let i = 0; i < relation.relations.length; i++) {
    let ele = relation.relations[i];
    let isHaveConnect = generatedTable.indexOf(ele.connectTable);
    if (isHaveConnect === -1) {
      indexofTable = [];
      break;
    } else {
      indexofTable.push(isHaveConnect);
    }
  }

  return indexofTable;
}

function getGenerateString(typename) {
  switch (typename) {
    case "number":
      return faker.datatype.number();
    case "price":
      return faker.commerce.price();
    case "productName":
      return faker.commerce.productName();
    case "firstName":
      return faker.name.findName();
  }
}

