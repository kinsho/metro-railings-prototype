'use client'

import React, { useState } from 'react';

import styles from 'public/styles/page/components.module.scss';

const MultiSelect = ({ keyValueMap, placeholder, selectedValues, maxSelectionsAllowed, updateFunc, ActionBar }) => {

	const [dropdownValue, setDropdownValue] = useState('');

	maxSelectionsAllowed = maxSelectionsAllowed || 1000;
	const keys = Object.keys(keyValueMap);

	const isSelected = (testValue) => {
		return selectedValues.some((selection) => selection === testValue);
	}

	const addNewSelection = (event) => {
		setDropdownValue('');
		updateFunc(event.currentTarget.value);
	}

	return (
		<div className={ styles.multiSelectContainer }>
			<select className={ styles.multiSelectDropdown }
				disabled={ selectedValues.length >= maxSelectionsAllowed}
				onChange={ addNewSelection }
				value={ dropdownValue }
			>
				<option value='' disabled={ true }>{ placeholder }</option>
				{ keys.map((key, index) => {
					return (
						<option value={ key } key={ index } disabled={ isSelected(key) }>{ keyValueMap[key] }</option>
					);
				})}
			</select>
			<span className={ styles.multiSelectSelectedValuesContainer }>
				{ selectedValues.map((selection, index) => {
					return (
						<span className={ styles.multiSelectSelectedValueRow } key={ index }>
							<span className={ styles.multiSelectSelectedValueText }>{ keyValueMap[selection] }</span>
							<span className={ styles.multiSelectSelectedValueActions }>
								{ ActionBar? <ActionBar valueInContext={ selection } /> : null }
							</span>
						</span>
					);
				}) }
			</span>
		</div>
	);
};

export default MultiSelect;