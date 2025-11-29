const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';

async function run() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Mongoose connected to', mongoose.connection.name || mongoose.connection.host);

    const db = mongoose.connection.db;
    const users = await db.collection('Users').find().toArray();
    console.log('Users collection count via mongoose.db:', users.length);
    if (users.length) console.log('Sample:', users[0]);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 2;
  }
}

run();
