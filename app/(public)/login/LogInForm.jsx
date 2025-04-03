'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { toastValidationError } from 'components/CustomToaster';

import styles from 'public/styles/page/logIn.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEyeSlash, faKey } from '@fortawesome/free-solid-svg-icons';

import { validateCredentials, validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { storeUserSession } from 'lib/userInfo';
import { AUTH_API } from 'lib/http/apiEndpoints';
import { httpRequest } from 'lib/http/clientHttpRequester';

const LoginForm = () => {
	const [showPasswordFlag, setShowPasswordFlag] = useState(false);
	const [rememberMeFlag, setRememberMeFlag] = useState(false);
	const [credentials, setCredentials] = useState({
		username: '',
		password: '',
	});

	const router = useRouter()

	// ---------- Validation functions for client-side error handling
	const validateUserName = (username) => validateEmpty(username) === false || (validateCredentials(username, '-_.', 1, 15));
	const validatePassword = (password) => validateEmpty(password) === false || (password.length >= 6);

	// ---------- Client-side error tests
	const validationFields = [
		{ prop: credentials.username, validator: validateEmpty, errorMsg: 'Please type in a valid username.' },
		{ prop: credentials.password, validator: validateEmpty, errorMsg: 'Please enter a valid password.' },
		{ prop: credentials.username, validator: validateUserName, errorMsg: 'Your username can only contain alphanumeric characters and dashes.' },
		{ prop: credentials.password, validator: validatePassword, errorMsg: 'The password has to be at least 6 characters long.' }
	];

	const handleCredentialUpdate = (event) => {
		setCredentials({
			...credentials,
			[event.currentTarget.name]: event.currentTarget.value
		});
	};

	const handleSubmit = async () => {
		// Relay any errors should the form not be ready for submission
		const errors = runValidators(validationFields);

		if (errors.length === 0) {
			const response = await httpRequest(AUTH_API.AUTHORIZE, 'POST', credentials, {
				loading: 'Testing your credentials...',
				success: 'Logged you in! Redirecting you to the admin page now...',
				error: 'Your username and password didn\'t match anything in our database.'
			});
			storeUserSession(response);

			// Move to the orders listing page
			window.setTimeout(() => {
				toast.dismiss();
				router.push('/admin/order-search');
			},1750);
		} else {
			toastValidationError(errors);
		}
	};

	return (
		<div className={ styles.loginBox }>
			<form>
				<div className={ styles.loginBoxBody }>

					<label className={ styles.loginBoxLabel }>User Name</label>
					<div className={ styles.loginInputGrouping }>
						<span className={ styles.loginInputGroupingIcon }>
							<FontAwesomeIcon icon={faUser} />
						</span>
						<input
							type='text'
							name='username'
							className={ styles.loginInputField }
							placeholder='Enter your user name or e-mail address...'
							onChange={ handleCredentialUpdate }
							autoComplete='username'
						/>
					</div>

					<label className={ styles.loginBoxLabel }>Password</label>
					<div className={ styles.loginInputGrouping }>
						<span className={ styles.loginInputGroupingIcon }>
							<FontAwesomeIcon icon={ faKey } />
						</span>
						<input
							type={ showPasswordFlag ? 'text' : 'password' }
							name='password'
							className={ styles.loginInputField }
							placeholder='Enter your password here...'
							onChange={ handleCredentialUpdate }
							autoComplete='current-password'
						/>
						<span className={ styles.loginInputGroupingIcon }>
							<FontAwesomeIcon
								icon={showPasswordFlag ? faEye : faEyeSlash}
								onClick={() => { setShowPasswordFlag(!showPasswordFlag) }}
							/>
						</span>
					</div>

					<div className={ styles.rememberMe }>
						<input
							type='checkbox'
							id='rememberMe'
							className={ styles.loginCheckbox }
							checked={ rememberMeFlag }
							readOnly
						/>
						<label
							htmlFor='rememberMe'
							className={ styles.secondaryLabel }
							onClick={() => setRememberMeFlag(!rememberMeFlag) }
						>
							Remember Me
						</label>
					</div>

				</div>

				<div>
					<button className={ styles.buttonPrimary } onClick={ handleSubmit } type='button'>Submit</button>
				</div>

			</form>
		</div>
	);
};

export default LoginForm;