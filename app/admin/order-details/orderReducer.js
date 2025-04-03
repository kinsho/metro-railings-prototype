import { validateAllDesignFields } from 'app/admin/order-details/designValidation';

import { validateFloat } from 'lib/validators/inputValidators';

/**
 * Reducer function meant to govern all changes to the order object.
 * Only applies to Order General v1
 */
export default function orderReducer(order, action) {
	switch (action.type) {
		case 'genericOrderUpdate': {
			const updatedOrder = { ...order };
			let propPath = updatedOrder;

			let i = 0;
			for (i = 0; i < action.properties.length - 1; i += 1) {
				propPath = propPath[action.properties[i]];
			}
			propPath[action.properties[i]] = action.value;

			return updatedOrder;
		}
		case 'genericOrderUpdateNum': {
			const updatedOrder = { ...order };
			let propPath = updatedOrder;

			let i = 0;
			for (i = 0; i < action.properties.length - 1; i += 1) {
				propPath = propPath[action.properties[i]];
			}
			propPath[action.properties[i]] = validateFloat(action.value) ? parseFloat(action.value) : 0;

			return updatedOrder;
		}
		case 'updateEmail': {
			return {
				...order,
				customer: {
					...(order.customer),
					email: action.value
				}
			};
		}
		case 'addNewSalesAssignee': {
			return {
				...order,
				sales: {
					...(order.sales),
					assignees: [
						...(order.sales.assignees),
						{
							username: action.value,
							commission: 0
						}
					]
				}
			};
		}
		case 'removeSalesAssignee': {
			return {
				...order,
				sales: {
					...(order.sales),
					assignees: order.sales.assignees.filter((assignee) => assignee.username !== action.value)
				}
			};
		}
		case 'updateSalesAssigneeInfo': {
			return {
				...order,
				sales: {
					...(order.sales),
					assignees: order.sales.assignees.map((assignee) => assignee.username === action.value.username ? action.value : assignee)
				}
			};
		}
		case 'designChanged': {
			let orderDesign = {
				...(order.design),
				[action.propName]: action.design
			};
			let orderDesignDesc = {
				...(order.designDescription),
				[action.propName]: action.designDesc
			};
			validateAllDesignFields(orderDesign, orderDesignDesc);

			return {
				...order,
				design: orderDesign,
				designDescription: orderDesignDesc
			};
		}
		case 'designDescriptionChanged': {
			return {
				...order,
				designDescription: {
					...(order.designDescription),
					[action.propName]: action.designDesc
				}
			}
		}
		case 'addInvoice': {
			return {
				...order,
				invoices: [...order.invoices, action.invoice]
			};
		}
		case 'updateInvoice': {
			return {
				...order,
				invoices: action.invoices
			};
		}
		case 'addNewPayment': {
			return {
				...order,
				payments: {
					...(order.payments),
					charges: [...(order.payments.charges), action.newPayment]
				}
			};
		}
		case 'updateDescription': {
			return {
				...order,
				text: {
					...(order.text),
					additionalDescription: action.value.split('\n').join('<br />')
				}
			};
		}
		case 'overwriteOrder': {
			return {
				...order,
				...(action.value)
			};
		}
		default: {
			throw Error('Unknown action: ' + action.type);
		}
	}
}

