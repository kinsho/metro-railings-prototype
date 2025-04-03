'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toastValidationError } from 'components/CustomToaster';
import { createProspectFromContactUs } from 'actions/order';

import { validateEmail, validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { serverActionCall } from 'lib/http/clientHttpRequester';

import styles from 'public/styles/page/contactUs.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPhone, faEnvelope, faHome, faCity } from '@fortawesome/free-solid-svg-icons'

const ContactUsForm = () => {
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [comments, setComments] = useState('');

	const validationFields = [
		{ prop: name, validator: validateEmpty, errorMsg: 'Your name is required.' },
		{ prop: phone, validator: validateEmpty, errorMsg: 'Please enter your phone number so that we can reach out to you.' },
		{ prop: comments, validator: validateEmpty, errorMsg: 'Please include some comments before sending us this message.' },
		{ prop: email, validator: validateEmail, errorMsg: 'Please write a proper e-mail address in the e-mail field.' }
	];

	const router = useRouter()

	const updateProp = (event, updaterFunction) => {
		updaterFunction(event.currentTarget.value);
	}

	const formatPhoneNumber = (event) => {
		let phoneNumber = event.currentTarget.value.split('-').join('');
		const numberLength = phoneNumber.length;

		if (numberLength > 3) {
			phoneNumber = phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3);
		}
		if (numberLength > 6) {
			phoneNumber = phoneNumber.slice(0, 7) + '-' + phoneNumber.slice(7);
		}

		setPhone(phoneNumber);
	}

	const placeCursorAtEnd = (event) => {
		const inputField = event.currentTarget;

		inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
		inputField.focus();
	};

	const submitForm = async () => {
		// Relay any errors should the form not be ready for submission
		const errors = runValidators(validationFields);
		let serverResult = false;

		if (errors.length === 0) {
			try {
				serverResult = await serverActionCall(createProspectFromContactUs, {
					name: name,
					address: address,
					city: city,
					state: state,
					phone: phone,
					email: email,
					comments: comments
				}, {
					loading: 'Sending form...',
					success: 'Your information has been sent to us! Expect a response by the next business day. Taking you back to the home page in 5 seconds...',
					error: 'Something weird happened here. Try sending the form again. If that doesn\'t work, give us a call at ' + process.env.NEXT_PUBLIC_HOTLINE_NUMBER + '.'
				});
			} catch (err) {
				console.error(err);
			} finally {
				if (serverResult?.success) {
					setName('');
					setPhone('');
					setAddress('');
					setCity('');
					setState('');
					setEmail('');
					setComments('');

					window.setTimeout(() => router.push('/'), 6000);
				}
			}
		} else {
			toastValidationError(errors);
		}
	};

	return (
		<form className={ styles.contactUsForm }>
			<div className={ styles.contactUsFormBody }>

				<label className={ styles.contactUsFormLabel }>Name</label>
				<div className={ styles.contactUsFormInputGrouping }>
					<span className={ styles.contactUsFormInputGroupingIcon }>
						<FontAwesomeIcon icon={ faUser }/>
					</span>
					<input
						type='text'
						name='name'
						className={ styles.contactUsFormInputField }
						placeholder='Write your name here...'
						onChange={ (event) => updateProp(event, setName) }
						value={ name }
						autoComplete='name'
					/>
				</div>

				<label className={ styles.contactUsFormLabel }>E-mail Address (Optional)</label>
				<div className={ styles.contactUsFormInputGrouping }>
					<span className={ styles.contactUsFormInputGroupingIcon }>
						<FontAwesomeIcon icon={ faEnvelope }/>
					</span>
					<input
						type='text'
						name='email'
						className={ styles.contactUsFormInputField }
						placeholder='Optional'
						onChange={ (event) => updateProp(event, setEmail) }
						value={ email }
						autoComplete='email'
					/>
				</div>

				<label className={ styles.contactUsFormLabel }>Phone Number</label>
				<div className={ styles.contactUsFormInputGrouping }>
					<span className={ styles.contactUsFormInputGroupingIcon }>
						<FontAwesomeIcon icon={ faPhone }/>
					</span>
					<input
						type='tel'
						name='phone'
						className={ styles.contactUsFormInputField }
						placeholder='Area code first'
						onChange={ (event) => formatPhoneNumber(event) }
						maxLength={ 12 }
						onPaste={ (event) => event.preventDefault() }
						onClick={ placeCursorAtEnd }
						onKeyUp={ placeCursorAtEnd }
						value={ phone }
						autoComplete='tel-national'
					/>
				</div>

				<label className={ styles.contactUsFormLabel }>Street Address (Optional)</label>
				<div className={ styles.contactUsFormInputGrouping }>
					<span className={ styles.contactUsFormInputGroupingIcon }>
						<FontAwesomeIcon icon={ faHome }/>
					</span>
					<input
						type='text'
						name='address'
						placeholder='Optional'
						className={ styles.contactUsFormInputField }
						onChange={ (event) => updateProp(event, setAddress) }
						value={ address }
						autoComplete='street-address'
					/>
				</div>

				<label className={ styles.contactUsFormLabel }>City (Optional)</label>
				<div className={ styles.contactUsFormInputGrouping }>
					<span className={ styles.contactUsFormInputGroupingIcon }>
						<FontAwesomeIcon icon={ faCity }/>
					</span>
					<input
						type='text'
						name='city'
						placeholder='Optional'
						className={ styles.contactUsFormInputField }
						onChange={ (event) => updateProp(event, setCity) }
						value={ city }
						autoComplete='address-level2'
					/>
				</div>

				<label className={ styles.contactUsFormLabel }>State (Optional)</label>
				<select
					name='state'
					className={ styles.contactUsFormSelectField }
					onChange={ (event) => updateProp(event, setState) }
					value={ state }
					autoComplete='address-level1'
				>
					<option value='' disabled>Pick a State</option>
					<option value="NJ">New Jersey</option>
					<option value="NY">New York</option>
					<option value="PA">Pennsylvania</option>
					<option value="AL">Alabama</option>
					<option value="AK">Alaska</option>
					<option value="AZ">Arizona</option>
					<option value="AR">Arkansas</option>
					<option value="CA">California</option>
					<option value="CO">Colorado</option>
					<option value="CT">Connecticut</option>
					<option value="DE">Delaware</option>
					<option value="DC">Washington DC</option>
					<option value="FL">Florida</option>
					<option value="GA">Georgia</option>
					<option value="HI">Hawaii</option>
					<option value="ID">Idaho</option>
					<option value="IL">Illinois</option>
					<option value="IN">Indiana</option>
					<option value="IA">Iowa</option>
					<option value="KS">Kansas</option>
					<option value="KY">Kentucky</option>
					<option value="LA">Louisiana</option>
					<option value="ME">Maine</option>
					<option value="MD">Maryland</option>
					<option value="MA">Massachusetts</option>
					<option value="MI">Michigan</option>
					<option value="MN">Minnesota</option>
					<option value="MS">Mississippi</option>
					<option value="MO">Missouri</option>
					<option value="MT">Montana</option>
					<option value="NE">Nebraska</option>
					<option value="NV">Nevada</option>
					<option value="NH">New Hampshire</option>
					<option value="NM">New Mexico</option>
					<option value="NC">North Carolina</option>
					<option value="ND">North Dakota</option>
					<option value="OH">Ohio</option>
					<option value="OK">Oklahoma</option>
					<option value="OR">Oregon</option>
					<option value="RI">Rhode Island</option>
					<option value="SC">South Carolina</option>
					<option value="SD">South Dakota</option>
					<option value="TN">Tennessee</option>
					<option value="TX">Texas</option>
					<option value="UT">Utah</option>
					<option value="VT">Vermont</option>
					<option value="VA">Virginia</option>
					<option value="WA">Washington</option>
					<option value="WV">West Virginia</option>
					<option value="WI">Wisconsin</option>
					<option value="WY">Wyoming</option>
				</select>

				<label className={ styles.contactUsFormLabel }>Comments</label>
				<textarea
					name='comments'
					className={ styles.contactUsFormCommentsField }
					placeholder='Write a brief summary of what you need from us here'
					onChange={ (event) => updateProp(event, setComments) }
					value={ comments }
				/>

			</div>

			<button type='button' className={ styles.contactUsFormSubmit } onClick={ submitForm }>Submit</button>
		</form>
	);
};

export default ContactUsForm;