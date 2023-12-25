import mongoose from 'mongoose';
const Account = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const account = mongoose.model('Account', Account);
// module.exports = account;
export default account;