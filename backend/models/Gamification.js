
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GamificationSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User', unique:true},
  xp: {type:Number, default:0},
  badges: [String],
  level: {type:Number, default:1},
  streak: {type:Number, default:0}
});

module.exports = mongoose.model('Gamification', GamificationSchema);
