
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttemptSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'User'},
  quiz: {type: Schema.Types.ObjectId, ref:'Quiz'},
  answers: Schema.Types.Mixed,
  score: Number,
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Attempt', AttemptSchema);
