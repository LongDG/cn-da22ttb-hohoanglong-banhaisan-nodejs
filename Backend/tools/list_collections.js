const { MongoClient } = require('mongodb');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/BIENTUOI_DB';

async function listCollections() {
  const client = new MongoClient(mongoURI, { useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db();
    console.log('Connected to', client.s.url);
    console.log('Database:', db.databaseName);

    const collections = await db.listCollections().toArray();
    if (!collections.length) {
      console.log('No collections found in this database.');
      return;
    }

    for (const coll of collections) {
      try {
        const name = coll.name;
        const col = db.collection(name);
        const count = await col.countDocuments();
        console.log(`\nCollection: ${name} — count: ${count}`);
        if (count > 0) {
          const sample = await col.findOne();
          console.log(' Sample document:', JSON.stringify(sample, null, 2));
        }
      } catch (err) {
        console.error(' Error inspecting collection', coll.name, err.message);
      }
    }
  } catch (err) {
    console.error('Failed to list collections:', err.message);
    process.exitCode = 2;
  } finally {
    await client.close();
  }
}

listCollections();
