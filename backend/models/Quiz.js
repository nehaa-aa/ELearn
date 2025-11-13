
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: String,
  type: {type:String, enum:['mcq','short'], default:'mcq'},
  choices: [String],
  answer: Schema.Types.Mixed
});

const QuizSchema = new Schema({
  course: {type: Schema.Types.ObjectId, ref:'Course'},
  moduleIndex: Number,
  title: String,
  questions: [QuestionSchema],
  difficulty: {type:String, enum:['easy','medium','hard'], default:'easy'}
});

module.exports = mongoose.model('Quiz', QuizSchema);
