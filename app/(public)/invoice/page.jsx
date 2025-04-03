import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { redirect } from 'next/navigation'
import dayjs from 'dayjs';
import Markdown from 'react-markdown';
import Image from 'next/image';

import FinalizeSection from 'app/(public)/invoice/finalize';

import { decryptNumber, formatUSDAmount } from 'lib/utils';
import { getPaymentsByOrderId } from 'lib/http/paymentsDAO';
import { getInvoice } from 'lib/http/invoicesDAO';
import { getUsersByUsername } from 'lib/http/usersDAO';
import { retrieveCards } from 'lib/http/ordersDAO';

import styles from 'public/styles/page/quote.module.scss';
import logo from "assets/images/logos/white_logo_color_background.png";

export const metadata = {
	title: 'Invoice',
	description: '',
	robots: {
		index: false,
		follow: false
	}
};

const InvoiceServer = async ({ searchParams }) => {
	const orderId = decryptNumber(searchParams?.oid || '');
	const invoiceId = decryptNumber(searchParams?.iid || '');

	const invoice = await getInvoice(orderId, invoiceId);

	if (invoice === null || invoice.category === 'quote' ) {
		redirect('/');
	}

	// Fetch all salesman information as well as past payments made against the order with which this invoices is associated and the cards that were used on those past payments
	const salesmen = await getUsersByUsername(invoice.sales.assignees.map(assignee => assignee.username));
	const payments = await getPaymentsByOrderId(orderId);
	const cards = await retrieveCards(orderId);

	// Pull the city/state information together into one coherent string
	let cityStateInfo = [];
	if (invoice.customer.city) {
		cityStateInfo.push(invoice.customer.city);
	}
	if (invoice.customer.state) {
		cityStateInfo.push(invoice.customer.state);
	}
	cityStateInfo = cityStateInfo.join(',');

	// Pull the 'Terms and Conditions' from the file system
	// Pull the 'Terms and Conditions' from the file system
	const textDir = resolve('./', 'assets/text/terms');
	const fileName = invoice.termsFileHandle.split('/').pop();
	const termsRawText = readFileSync( textDir + '/' + fileName, { encoding: 'utf-8' });

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.logoHeaderContainer }>
				<Image src={ logo } alt="Logo" className={ styles.logoHeader } priority/>
			</div>
			<div className={ styles.pageHeader }>INVOICE</div>

			<div className={ styles.infoSection }>
				{ /* COMPANY INFO */ }
				<span className={ styles.infoColumnCompany }>
					<span className={ styles.infoColumnHeader }>Metro Railings</span>
					<br/>
					{ process.env.NEXT_PUBLIC_COMPANY_ADDRESS_1 }
					<br/>
					{ process.env.NEXT_PUBLIC_COMPANY_ADDRESS_2 }
					<br/>
					{ process.env.NEXT_PUBLIC_SUPPORT_MAILBOX }
					<br/>
					{ process.env.NEXT_PUBLIC_HOTLINE_NUMBER }
				</span>

				{ /* ORDER ID */ }
				<span className={ styles.infoColumnOrder }>
					<span className={ styles.infoColumnHeader }>ORDER #{ invoice.orderId }</span>
					<br/>
					Invoice #{ invoice._id }
					<br />
					{ 'Drafted on ' + dayjs(invoice.dates.created).format('MMMM DD, YYYY') }
					<br/>
					Status: <i className={ styles.quoteStatusText }>{ invoice.status.toUpperCase() }</i>
				</span>

				{ /* SALES REPS */ }
				<span className={ styles.infoColumnSalesReps }>
					<span className={ styles.infoColumnHeader }>Sales Reps</span>
					{ salesmen.map((salesman, index) => {
						return (
							<div key={ index } className={ styles.salesmanListing }>
								<div>{ salesman.firstName + ' ' + salesman.lastName }</div>
								<div>{ salesman.email }</div>
								<div>{ salesman.phone }</div>
							</div>
						);
					})}
				</span>

				{ /* BILL TO INFO */ }
				<span className={ styles.infoColumnCustomer }>
					<span className={ styles.infoColumnHeader }>Customer</span>
					<br/>
					{ invoice.customer.name }
					{ invoice.customer.address ? (
						<>
							<br/>
							{ invoice.customer.address }
						</>
					) : null }
					<br/>
					{ cityStateInfo }
					{ invoice.customer.email.map((email) => {
						<>
							<br/>
							{ email }
						</>
					})}
					{ invoice.customer.areaCode && invoice.customer.phoneOne && invoice.customer.phoneTwo ? (
						<>
							<br/>
							{ invoice.customer.areaCode + '-' + invoice.customer.phoneOne + '-' + invoice.customer.phoneTwo }
						</>
					) : null }
				</span>
			</div>

			<div className={ styles.invoiceNotice }>INVOICE AMOUNT: ${ formatUSDAmount(invoice.amount) }</div>

			<FinalizeSection
				orderId={ orderId }
				jsonInvoice={ JSON.stringify(invoice) }
				jsonCards={ JSON.stringify(cards) }
				jsonPayments={ JSON.stringify(payments) }
				invoiceAmount={ invoice.amount }
			/>

			<div className={ styles.termsAndConditions }>
				<div className={ styles.termsAndConditionsHeader }>INVOICE TERMS</div>
				<Markdown>{ termsRawText }</Markdown>
				<p>Consult the finalized quote that was sent for this order for the full terms and conditions.</p>
			</div>
		</div>
	);
};

export default InvoiceServer;