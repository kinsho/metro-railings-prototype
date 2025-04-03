import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({

	_id: String,
	seq: Number

}, { collection: 'counters' });

module.exports = (mongoose.models?.Counters || mongoose.model('Counters', CounterSchema));