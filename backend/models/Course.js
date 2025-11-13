
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  title: String,
  content: String, // markdown or html
  contentType: {type:String, enum:['video','article','quiz'], default:'article'},
  order: Number,
  meta: Schema.Types.Mixed
});

const CourseSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  teacher: {type: Schema.Types.ObjectId, ref:'User'},
  tags: [String],
  level: {type:String, enum:['beginner','intermediate','advanced'], default:'beginner'},
  modules: [ModuleSchema],
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Course', CourseSchema);
