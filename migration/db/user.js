import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

	username: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String
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
		default: 'dashboard'
	},

	role: {
		type: String,
		enum: ['superadmin', 'shop', 'admin', 'sales', 'office'],
		default: 'office'
	},

	permissions: {
		uploadFile: {
			type: Boolean,
			default: true
		},
		deleteFile: {
			type: Boolean,
			default: true
		},
		makePayments: {
			type: Boolean,
			default: true
		}
	},

	email: {
		type: String,
		lowercase: true,
	},

	phone: {
		type: String
	},

	isActive: {
		type: Boolean,
		default: true
	},

}, { collection: 'users' });

UserSchema.set('timestamps', true);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

export default mongoose.model('Users', UserSchema);