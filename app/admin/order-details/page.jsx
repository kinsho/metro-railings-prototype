import OrderDetailsPage from "app/admin/order-details/client";

import { prospectStatuses, openStatuses, closedStatuses } from 'lib/dictionary';
import { getOrderById } from 'lib/http/ordersDAO';
import { sortNotes } from 'lib/utils';

const OrderDetailsServer = async ({ searchParams }) => {
	const orderId = searchParams?.id || 0;
	let order = {};
	if (orderId) {
		order = await getOrderById(orderId);
		sortNotes(order.notes);
	}

	const statuses = [
		...prospectStatuses(),
		...openStatuses(),
		...closedStatuses()
	];

	return (
		<>
			<OrderDetailsPage
				jsonOrder={ JSON.stringify(order) }
				jsonStatuses={ JSON.stringify(statuses) }
			/>
		</>
	);
};

export default OrderDetailsServer;