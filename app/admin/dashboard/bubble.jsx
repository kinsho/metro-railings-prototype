'use client'

import React, { } from 'react';
import dayjs from "dayjs";

import styles from 'public/styles/page/dashboard.module.scss';

const DashboardBubble = ({ jsonOrder }) => {

	const order = JSON.parse(jsonOrder);

	const navigateToOrderPage = () => window.open('/admin/order-details?id=' + order.id, '_blank');

	return (
		<span className={ styles.dashboardBubble } onClick={ navigateToOrderPage }>
			<div className={ styles.dashboardBubbleBody }>
				<div className={ styles.dashboardBubbleCustomerName }>
					{ order.customer.company ? (
						<div className={ styles.dashboardBubbleCOmpanyText }>
							{ order.customer.company }
						</div>
					) : null }
					<div>{ order.customer.name }</div>
				</div>
				<div className={ styles.dashboardBubbleInfo }>
					<div>
						{ order.status.toUpperCase() }
					</div>
					{ order.tasks && order.tasks.length ? (
						<div className={ styles.dashboardBubbleTask }>
							<div>
								- Tasks -
							</div>
							<div>
								{ order.tasks[0].text }
							</div>
							{ order.tasks.length > 0 ? (
								<>
									<div>
										and more...
									</div>
								</>
							) : null }
						</div>
					) : null }
				</div>
			</div>

			{ order.dates.due ? (
				<div className={ styles.dashboardBubbleDueDate }>
					{ dayjs(order.dates.due).format('MMM') }
					<br />
					{ dayjs(order.dates.due).format('DD') }
				</div>
			) : null }

		</span>
	);
};

export default DashboardBubble;