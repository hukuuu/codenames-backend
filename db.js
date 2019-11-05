const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const url = process.env.DB_URL
const dbName = process.env.DB_NAME
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

export const makeDb = async () => {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}
