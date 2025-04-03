import { permanentRedirect } from 'next/navigation'

import OrderSearchPage from "app/admin/order-search/client";

import { getAllOrders } from 'lib/http/ordersDAO';
import { prospectStatuses, openStatuses, closedStatuses } from 'lib/dictionary';

const OrderSearchServer = async (request) => {

	const orders = await getAllOrders();
	const params = request.searchParams || {};

	// Should no filters be set in the URL, reset the URL to include default filters
	if (Object.keys(params).length === 0) {
		permanentRedirect('/admin/order-search?status=open')
	}

	const statuses = [
		{
			key: '',
			label: 'All',
			state: 'all'
		},
		{
			key: 'prospect',
			label: 'Prospect',
			state: 'prospect'
		},
		...prospectStatuses(),
		{
			key: 'open',
			label: 'Open',
			state: 'open'
		},
		...openStatuses(),
		...closedStatuses()
	];

	return (
		<>
			<OrderSearchPage
				jsonOrders={ JSON.stringify(orders) }
				jsonStatuses={ JSON.stringify(statuses) }
			/>
		</>
	);
};

export default OrderSearchServer;