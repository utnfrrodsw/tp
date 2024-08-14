import { MongoClient, Db } from "mongodb";

const connectionStr = process.env.MONGO_URI || 'mongodb://localhost:27017/'

const cli = new MongoClient(connectionStr)
await cli.connect()

export let db: Db = cli.db('db')