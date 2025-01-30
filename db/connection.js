const { MongoClient } = require('mongodb');

// Create a new MongoClient
const client = new MongoClient(process.env.MONGO_URI);

async function connectToUserDB() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to Integrations Database successfully!');
    } catch (err) {
        console.log(err);
    }
}

async function accessToDatabase(DBType) {
    try {
        // Access and Return the database instance
        let db_name = null;
        if (DBType == 'USER') {
            db_name = process.env.USER_DATABASE_NAME;
        }
        else {
            db_name = process.env.GITHUB_DATABASE_NAME;
        }

        return client.db(db_name);
    } catch (err) {
        console.log(err);
    }
}

module.exports = { connectToUserDB, accessToDatabase };