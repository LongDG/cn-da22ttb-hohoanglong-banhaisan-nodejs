const mongoose = require('mongoose');

(async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    const conn = await mongoose.connect(mongoURI);
    console.log(`Connected to ${conn.connection.host} / ${conn.connection.name}`);

    const db = conn.connection.client.db(conn.connection.name);
    const collections = await db.listCollections().toArray();
    console.log('Collections in DB:', collections.map(c => c.name));

    for (const name of ['users', 'Users', 'user']) {
      const exists = collections.some(c => c.name === name);
      if (exists) {
        const count = await db.collection(name).countDocuments();
        console.log(`Collection '${name}' exists, count = ${count}`);
        if (count > 0) {
          const sample = await db.collection(name).find({}).limit(5).toArray();
          console.log('Sample documents:', sample.map(s => ({ user_id: s.user_id, full_name: s.full_name, email: s.email })));
        }
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
