'use client'

import React, { useContext } from "react";

import { OrdersContext, OrdersDispatchContext } from 'app/admin/order-details/orderContext';

import { validateFloat } from 'lib/validators/inputValidators';

import { quickToastNotice } from 'components/CustomToaster';

import styles from 'public/styles/page/orderDetails.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEraser } from '@fortawesome/free-solid-svg-icons'

const SalesAssigneeActions = ({ valueInContext }) => {

	const orderDetails = useContext(OrdersContext);
	const orderDispatch = useContext(OrdersDispatchContext);

	const assignee = orderDetails.sales.assignees.find((assignee) => assignee.username === valueInContext);

	const removeSalesman = () => {
		orderDispatch({
			type: 'removeSalesAssignee',
			value: valueInContext
		});
	};

	const updateOrder = (updatedCommission) => {
		orderDispatch({
			type: 'updateSalesAssigneeInfo',
			value: {
				...assignee,
				commission: updatedCommission
			}
		});
	}

	const updateSalesCommission = (event) => {
		updateOrder(event.currentTarget.value);
	}

	const validateSalesCommission = () => {
		if (assignee.commission) {
			if ((validateFloat(assignee.commission)) === false || (window.parseFloat(assignee.commission) < 0) || (window.parseFloat(assignee.commission) > 100)) {
				quickToastNotice('You\'ve typed in an invalid commission rate.');
				updateOrder(0);
			} else {
				updateOrder(parseFloat(assignee.commission));
			}
		}
	}

	return (
		<>
			<span>
				<label className={ styles.orderFormLabel }>Commission Percentage</label>
				<input
					type='tel'
					className={ styles.smallInputControl }
					value={ assignee.commission }
					onChange={ updateSalesCommission }
					onBlur={ validateSalesCommission }
				/>
				<span className={ styles.orderInputNeighboringText }>%</span>
			</span>
			<span>
				<button type='button' className={ styles.salesmanDeleteButton } onClick={ removeSalesman }>Delete<FontAwesomeIcon icon={ faEraser } /></button>
			</span>
		</>
	);
}

export default SalesAssigneeActions;