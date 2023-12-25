import mongoose from 'mongoose';
// const mongoose = require('mongoose')
// const mongoURL = 'mongodb://127.0.0.1:27017/MusicApp';
const mongoURL = 'mongodb+srv://chatapp0321:tU7jEziHy0QzfytE@musicapp.isql17r.mongodb.net/MusicApp?retryWrites=true&w=majority';

// const connectionParams = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connection made successfully');
    } catch (error) {
        console.error('Connection error:', error);
    }
};

// module.exports = connectToMongo;
export default connectToMongo;
// tU7jEziHy0QzfytE