require('dotenv').config();
const mongoose = require('mongoose')
// const mongoURL = 'mongodb://root:example@localhost:27017/MusicApp?authSource=admin';

const mongoURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@musicapp.isql17r.mongodb.net/MusicApp?retryWrites=true&w=majority`;

// const connectionParams = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }
const connectToMongo = async () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
};

module.exports = connectToMongo;


