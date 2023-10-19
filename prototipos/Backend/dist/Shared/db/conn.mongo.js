import { MongoClient } from "mongodb";
const connectionStr = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/";
const cli = new MongoClient(connectionStr);
await cli.connect();
export let db = cli.db("LibraryMongo");
//# sourceMappingURL=conn.mongo.js.map