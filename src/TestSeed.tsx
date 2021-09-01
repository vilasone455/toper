import React, { useEffect } from 'react'
import {SeedGenerator} from './api/seed-generator/SeedGenerator'
import { TableData } from './components/TableEditor'
import { Relation } from './interface/Relation'

const tables : TableData[] = [
    {
        tablename : "user",
        fields : [{
            fieldName : "id",
            fieldType : "int"
        },
        {
            fieldName : "name",
            fieldType : "varchar"
        },
        {
            fieldName : "pass",
            fieldType : "varchar"
        }]
    },
    {
        tablename : "product",
        fields : [{
            fieldName : "id",
            fieldType : "int"
        },
        {
            fieldName : "name",
            fieldType : "varchar"
        },
        {
            fieldName : "price",
            fieldType : "varchar"
        }]
    },
    {
        tablename : "order",
        fields : [{
            fieldName : "id",
            fieldType : "int"
        },
        {
            fieldName : "user_id",
            fieldType : "int"
        },
        {
            fieldName : "date",
            fieldType : "date"
        }]
    },
    {
        tablename : "profile",
        fields : [{
            fieldName : "id",
            fieldType : "int"
        },
        {
            fieldName : "user_id",
            fieldType : "int"
        },
        {
            fieldName : "profile_name",
            fieldType : "name"
        }]
    }
]

const relations : Relation[]= [{
    mainTable : "order",
    mainField : "user_id",
    targetTable : "user",
    targetField : "id",
    relationType : "1:N"
},
{
    mainTable : "profile",
    mainField : "user_id",
    targetTable : "user",
    targetField : "id",
    relationType : "1:1"
}]

export default function TestSeed() {

    useEffect(() => {
        let seed = new SeedGenerator()
        seed.generate(tables , relations)
    }, [])

    return (
        <div>
            Seed Gen
        </div>
    )
}
