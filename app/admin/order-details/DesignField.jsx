'use client'

import React, { useState, useEffect } from "react";

import styles from 'public/styles/page/orderDetails.module.scss';

import { validateDesignProp } from 'app/admin/order-details/designValidation';

const DesignField = ({ data, order, propName, dispatch }) => {

	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		setDisabled(validateDesignProp(order.design, propName) === false);
	}, [order.design, order.designDescription, propName]);

	const handleDesignUpdate = (event) => {
		const selection = event.currentTarget.value;
		let newDesc = '';

		// Update the design description in accordance with whatever option was selected
		for (let i = 0; i < data.options.length; i += 1) {
			if (selection === data.options[i].id) {
				newDesc = data.options[i].description || '';
				break;
			}
		}

		dispatch({
			type: 'designChanged',
			propName: propName,
			design: selection,
			designDesc: newDesc
		});
	};

	const handleDescUpdate = (event) => {
		const newDesc = event.currentTarget.value;

		dispatch({
			type: 'designDescriptionChanged',
			propName: propName,
			designDesc: newDesc
		})
	};

	return (
		<>
			<span className={ styles.inputGroup }>
				<label htmlFor={ 'design.' + propName } className={ styles.orderFormLabel }>{ data.technicalLabel }</label>
				<span className={ styles.designInputGroup }>
					<select
						className={ styles.mediumInputControl }
						onChange={ handleDesignUpdate }
						value={ order.design[propName] }
						disabled={ disabled }
						id={ 'design.' + propName }
					>
						<option value=''>Select...</option>
						{ data.options.map((each, index) => {
							return (
								<option key={ index } value={ each.id }>{ each.label }</option>
							)
						})}
					</select>
					<textarea
						value={ order.designDescription[propName] }
						onChange={ handleDescUpdate }
						className={ styles.largeInputControl }
						disabled={ disabled }
						id={ 'designDesc.' + propName }
					/>
				</span>
			</span>
		</>
	);
}

export default DesignField;