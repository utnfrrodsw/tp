import { MongoClient } from "mongodb";
const connectionStr = process.env.MONGO_URI || 'mongodb://localhost:27017/';
const cli = new MongoClient(connectionStr);
await cli.connect();
export let db = cli.db('BD');
//# sourceMappingURL=conn.js.map