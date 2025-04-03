import { getUsersByUsername } from 'lib/http/usersDAO';
import { getOrderById } from 'lib/http/ordersDAO';

import { formatUSDAmount } from 'lib/utils';

import styles from 'public/styles/page/thankYou.module.scss';

export const metadata = {
	title: 'Thank You!',
	description: '',
	robots: {
		index: false,
		follow: false
	}
};

const ThankYouServer = async ({ searchParams }) => {
	const orderId = searchParams?.orderId || '';
	const amount = searchParams?.amount || '';

	let order = {};
	let users = [];

	// If the order can be found, track down the order and the metadata for all the salespeople assigned to the order 
	if (orderId) {
		order = await getOrderById(orderId);
		const salesAssignees = order?.sales?.assignees || [];
		const usernames = salesAssignees.map((assignee) => { return assignee.username });
		users = await getUsersByUsername(usernames);
	}

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.pageHeader }>
				Thank you so much for choosing us!
			</div>
			<p className={ styles.infoText }>
				We have received your payment! Our credit card processor should be sending a receipt for ${ formatUSDAmount(amount) } soon to one of the e-mail addresses listed on this order.
			</p>
			<p className={ styles.infoText }>
				If a receipt never arrives or there is no e-mail address associated with this order, please call your sales rep for a copy of the receipt.
			</p>
			<p className={ styles.infoText }>
				We will now proceed forward with your order. If you have any more questions, feel free to reach out to the sales rep(s) managing your order. All contact information is below.
			</p>
			<div className={ styles.salesmanTable }>
				{ users.map((user, index) => {
					return (
						<div className={ styles.salesmanRow } key={ index }>
							<span className={ styles.salesmanName } key={ index }>{ user.fullName }</span>
							<span className={ styles.salesmanContactInfoCell }>
								<div className={ styles.salesmanContactInfo }>{ user.email }</div>
								<div className={ styles.salesmanContactInfo }>{ user.phone }</div>
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default ThankYouServer;