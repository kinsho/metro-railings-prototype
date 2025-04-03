import React, { useState } from 'react';

import { quickToastNotice } from 'components/CustomToaster';

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const Multitext = ({ values, placeholder, updateFunc, validator, validatorFailMessage }) => {

	const [textValue, setTextValue] = useState('');

	const addNewValue = () => {
		// Check if the value is not empty
		if (textValue.trim() === '') {
			return false;
		}

		// If a validator function has been provided, test the value first before moving on and setting the value
		if (validator && validator(textValue) === false) {
			if (validatorFailMessage) {
				quickToastNotice(validatorFailMessage);
			}

			return false;
		}

		// Check to see if the value is already present in the multitext field.
		// If so, do not record t= he value
		for (let i = 0; i < values.length; i += 1) {
			if (textValue === values[i]) {
				quickToastNotice('You\'ve already typed that in.');
				return false;
			}
		}

		// If all checks pass, invoke whatever function is responsible for adding the new value into the parent component's data model
		updateFunc([...values, textValue]);
		setTextValue('');
	};

	const removeValue = (value) => {
		updateFunc(values.filter((existingValue) => existingValue !== value));
	}

	const detectComma = (event) => {
		const newTextValue = event.currentTarget.value;

		// Remember that new values are only stored once the comma button is pressed
		if (newTextValue.charAt(newTextValue.length - 1) === ',') {
			addNewValue(event);
			return false;
		}

		setTextValue(newTextValue.trim());
		return true;
	};
	
	return (
		<>
			<div className={ styles.multitextContainer }>
				<div className={ styles.multitextExistingValues }>
					{ values.map((each, index) => {
						return (
							<span className={ styles.multitextSetValue } key={ index }>
								{ each }
								<FontAwesomeIcon icon={ faTimesCircle } className={ styles.multitextRemoveMark } onClick={() => removeValue(each) } />
							</span>
						)
					})}
				</div>
				<textarea
					className={ styles.multitextNewValue }
					placeholder={ placeholder || 'Separate entries here with a comma' }
					onChange={ detectComma }
					onBlurCapture={ addNewValue }
					value={ textValue }
				></textarea>
			</div>
		</>
	);
};

export default Multitext;