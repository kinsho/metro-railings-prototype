import DashboardBubble from 'app/admin/dashboard/bubble';

import { getAllOpenOrders } from 'lib/http/ordersDAO';

import styles from 'public/styles/page/dashboard.module.scss';

export const revalidate = 300; // invalidate every 5 minutes

const DashboardServer = async () => {
	// Fetch all open orders
	const orders = await getAllOpenOrders();

	return (
		<>
			<h3 className={ styles.pageHeader }>DASHBOARD</h3>
			<hr className={ styles.pageDivider }></hr>

			<div className={ styles.dashboardBubblesContainer }>
				{ orders.map((order, index) => {
					return (
						<DashboardBubble jsonOrder={ JSON.stringify(order) } key={ index } />
					);
				})}
			</div>
		</>
	);
};

export default DashboardServer;