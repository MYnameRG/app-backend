const { mongoose } = require('mongoose');

async function connectToMainDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/' + process.env.MAIN_DATABASE_NAME);
        console.log('Connected to Main Database successfully!');
    } catch (err) {
        console.log(err);
    }
}

module.exports = { connectToMainDB };