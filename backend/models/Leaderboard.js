const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaderboardEntrySchema = new Schema({
  student: {type: Schema.Types.ObjectId, ref:'User', unique:true},
  totalXP: {type:Number, default:0},
  rank: {type:Number, default:0},
  updatedAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('LeaderboardEntry', LeaderboardEntrySchema);
