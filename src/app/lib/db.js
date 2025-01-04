// app/lib/db.js
import mongoose from 'mongoose'

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

const MONGODB_URI = process.env.MONGODB_URI

console.log('MONGODB_URI', MONGODB_URI)

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    try {
      console.log('Connecting to MongoDB...')
      cached.promise = mongoose.connect(MONGODB_URI, opts)
    } catch (error) {
      console.error('Error creating MongoDB connection:', error)
      throw error
    }
  }

  try {
    cached.conn = await cached.promise
    console.log('Successfully connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    if (error.name === 'MongoServerError') {
      console.error('Authentication Details:', {
        code: error.code,
        codeName: error.codeName
      })
    }
    cached.promise = null
    throw error
  }

  return cached.conn
}