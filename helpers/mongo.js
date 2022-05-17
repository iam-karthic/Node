const { MongoClient } = require('mongodb');

const {
  ENV, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_NAME,
} = process.env;
const db = async (collection) => {
  let url = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;
  if (ENV === 'local') {
    url += '?tls=false&directConnection=true';
  } else {
    url += '?tls=true&tlsCAFile=rds-combined-ca-bundle.pem';
  }
  const client = new MongoClient(url);
  await client.connect();
  const conn = client.db(MONGO_DB_NAME);
  return conn.collection(collection);
};
module.exports = db;
