import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({

	_id: String,
	seq: Number

}, { collection: 'counters' });

export default mongoose.model('Counters', CounterSchema);