const mongoose = require('mongoose');

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
    },
    recentSongIds: {
        type: [ String ],
        default: []
    }
});

const account = mongoose.model('Account', Account);
module.exports = account;
