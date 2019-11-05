const { makeDb } = require('./db')

export const findByToken = async token => {
  const db = await makeDb()
  return await db.collection('users').findOne({
    token
  })
}

export const register = async user => {
  const db = await makeDb()
  const found = await db.collection('users').findOne({
    id: user.id
  })

  if (found) {
    return found
  }

  const created = await db.collection('users').insertOne(user)
  return created
}
