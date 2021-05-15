const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: { type: String, required: true },
  details: { type: String, required: true},
  author: { type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true})

module.exports = mongoose.model("Todo", TodoSchema);