import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface CachedMongoose {
  conn: any;
  promise: any;
}

const getCached = (): CachedMongoose => {
  const globalAny = global as any;
  if (!globalAny.mongoose) {
    globalAny.mongoose = { conn: null, promise: null };
  }
  return globalAny.mongoose;
};

async function dbConnect() {
  const cached = getCached();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
