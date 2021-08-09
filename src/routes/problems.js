/* import {connectToDatabase } from '$lib/db'
import { ObjectId } from 'mongodb'

export async function get(request){
    try{
        //const course = request.query.get('course')
        const dbConnection = await connectToDatabase()
        const db = dbConnection.db
        const collection = db.collection('problems')
        const problems = await collection.find().toArray()

        return {
            body: {
                problems
            }
        }
    } catch(err) {
        return {
            body: {
                error: 'A server error ocurred'
            }
        }
    }
}

export async function post(request){
    try{
        const dbConnection = await connectToDatabase()
        const db = dbConnection.db
        const collection = db.collection('problems')

        const problem = JSON.parse(request.body)
        await collection.insertOne(problem)
        return {
            //change this?
            status: 'Success'
        }
    } catch(err) {
        return {
            body: {
                error: 'A server error ocurred'
            }
        }
    }

}

export async function put(request){

}

export async function del(request){

}
*/