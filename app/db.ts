import { MongoClient } from "mongodb";
import config from "../config.json";
import logger from "./logger";

const d = logger("mongodb");

const mongourl = `mongodb://${config.mongo.username}:${encodeURIComponent(
  config.mongo.password
)}@${config.mongo.host}:${config.mongo.port}/${config.mongo.dbname}`;

const client = await MongoClient.connect(mongourl);
const db = client.db(config.mongo.dbname);

d.info("mongodb connected");

export default db;
