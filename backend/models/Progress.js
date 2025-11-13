const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressSchema = new Schema({
  student: {type: Schema.Types.ObjectId, ref:'User', required:true},
  course: {type: Schema.Types.ObjectId, ref:'Course', required:true},
  completedModules: [{type: Number}], // module indices
  scoreHistory: [{score: Number, quizId: Schema.Types.ObjectId, date: Date}],
  weakTopics: [String],
  strongTopics: [String],
  timeSpentDaily: {type: Number, default: 0}, // minutes
  lastAccessed: {type: Date, default: Date.now}
});

ProgressSchema.index({student:1, course:1}, {unique:true});

module.exports = mongoose.model('Progress', ProgressSchema);