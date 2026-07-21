const mongoose = require('mongoose')
const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost/argentBankDB'

mongoose.set('sanitizeFilter', true)

module.exports = async () => {
  try {
    await mongoose.connect(databaseUrl)
    console.log('Database successfully connected')
  } catch (error) {
    console.error(`Database Connectivity Error: ${error}`)
    throw error
  }
}
