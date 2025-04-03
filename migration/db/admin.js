import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({

	username: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true,
		transform: () => null
	},

	firstName: {
		type: String,
	},

	lastName: {
		type: String,
	},

	access: {
		type: String
	},

	landingPage: {
		type: String,
		enum: ['dashboard', 'shopSchedule']
	}

	}, { collection: 'admins' });

AdminSchema.set('timestamps', true);
AdminSchema.set('toJSON', { virtuals: true });
AdminSchema.set('toObject', { virtuals: true });

export default mongoose.model('Admins', AdminSchema);