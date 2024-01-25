import mongoose from 'mongoose';
const RecentPlayed = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    recent: {
        type: Array,
    }
});

const recentplayed = mongoose.model('RecentPlayed', RecentPlayed);
export default recentplayed;