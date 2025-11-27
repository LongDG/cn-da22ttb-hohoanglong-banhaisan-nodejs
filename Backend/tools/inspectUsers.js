const mongoose = require('mongoose');

(async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';
    const conn = await mongoose.connect(mongoURI);
    console.log(`Connected to ${conn.connection.host} / ${conn.connection.name}`);

    const admin = conn.connection.db.admin();
    const dbs = await admin.listDatabases();

    console.log('Databases found:');
    for (const dbInfo of dbs.databases) {
      const dbName = dbInfo.name;
      const db = conn.connection.client.db(dbName);
      const collections = await db.listCollections().toArray();
      const collNames = collections.map(c => c.name);

      if (collNames.includes('users') || collNames.includes('user')) {
        const usersCount = collNames.includes('users') ? await db.collection('users').countDocuments() : 0;
        const userCount = collNames.includes('user') ? await db.collection('user').countDocuments() : 0;
        console.log(`- ${dbName}: users=${usersCount}, user=${userCount}`);
      }
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
