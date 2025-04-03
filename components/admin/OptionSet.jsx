'use client'

import React, { } from 'react';
import classNames from 'classnames';

import styles from "public/styles/page/components.module.scss";

const OptionSet = ({ labels, values, currentValue, isDisabled, setter }) => {

	const setValue = (value) => {
		if (isDisabled !== true) {
			setter(value);
		}
	};

	return (
		<span className={ classNames({
				[styles.optionSetContainer]: true,
				[styles.disabledOptionSet]: isDisabled
			})}>
			{ labels.map((label, index) => {
				return (
					<label key={ index } onClick={ () => setValue(values[index]) } className={ classNames({
							[styles.selectedOptionSet]: values[index] === currentValue
						})}>
						{ label }
					</label>
				);
			})}
		</span>
	);
};

export default OptionSet;