const { makeDb } = require('./db')

export const get = async (req, res) => {
  const db = await makeDb()
  const result = await db.collection('users').find({})

  res.json(await result.toArray())
}
