import mongoose from 'mongoose';

import { hashWithSecret } from 'lib/utils';

const UserSchema = new mongoose.Schema({

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
		required: true
	},

	lastName: {
		type: String,
		required: true
	},

	access: {
		type: String
	},

	landingPage: {
		type: String,
		enum: ['dashboard', 'shop-schedule'],
		default: 'dashboard'
	},

	role: {
		type: String,
		enum: ['superadmin', 'shop', 'admin', 'sales', 'office']
	},

	permissions: {
		uploadFile: Boolean,
		deleteFile: Boolean,
		makePayments: Boolean
	},

	email: {
		type: String,
		lowercase: true,
		unique: true,
	},

	phone: {
		type: String
	},

	isActive: {
		type: Boolean,
		default: true
	},

}, { collection: 'users' });

UserSchema.pre('validate', function (next) {
	if (this.isNew) {
		if (this.password === undefined || this.password === null) {
			return next(new Error("No password defined"));
		}
	}
	return next();
});

UserSchema.pre('save', function (next) {
	const user = this;
	if (this.isModified('password') || this.isNew) {
		try {
			user.password = hashWithSecret(this.password);
		} catch (error) {
			return next(error);
		}
	}
	return next()
});

UserSchema.methods.validatePassword = function (pw) {
	try {
		return (hashWithSecret(pw) === this.password);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

UserSchema.post('save', function () {
	// TODO: Send e-mail to new user
});

UserSchema.virtual('fullName').get(function () {
	return this.firstName + ' ' + this.lastName;
});

UserSchema.set('timestamps', true);
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = (mongoose.models?.Users || mongoose.model('Users', UserSchema));