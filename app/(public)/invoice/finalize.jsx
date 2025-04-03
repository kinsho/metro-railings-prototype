'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import PaymentHistory from 'components/public/PaymentHistory';
import PaymentForms from 'components/PaymentForms';

import { formatUSDAmount } from 'lib/utils';

import styles from 'public/styles/page/quote.module.scss';

const FinalizeSection = ({ orderId, jsonInvoice, jsonCards, jsonPayments }) => {

	const router = useRouter();
	const invoice = JSON.parse(jsonInvoice);
	const cards = JSON.parse(jsonCards);
	const payments = JSON.parse(jsonPayments);

	const finalizeInvoice = () => {
		window.setTimeout(() => { router.push('/invoice/thank-you?orderId=' + orderId + '&amount=' + invoice.amount) }, 1500);
	}

	return (
		<div className={ styles.invoiceBody }>
			<span className={ styles.invoiceBodySection }>
				<div className={ styles.invoiceBodySectionHeader }>Payment Form</div>
				<div className={ styles.invoiceBodyRow }>
					<span className={ styles.invoiceBodyLabel }>Order Total:</span>
					<span className={ styles.invoiceBodyAmount }>${ formatUSDAmount(invoice.pricing.orderTotal) }</span>
				</div>

				{ invoice.status === 'open' ? (
					<div className={ styles.invoiceBodyRow }>
						<span className={ styles.invoiceBodyLabel }>Balance Remaining:</span>
						<span className={ styles.invoiceBodyAmount }>${ formatUSDAmount(invoice.payments.balanceRemaining) }</span>
					</div>
				) : null }

				{ invoice.status === 'open' ? (
					<PaymentForms
						orderId={ orderId }
						invoiceId={ invoice._id }
						acceptCard={ true }
						acceptAlternate={ false }
						cards={ cards }
						postFunc={ finalizeInvoice }
						presetPaymentAmount={ invoice.amount }
					/>
				) : null }
				{ invoice.status === 'finalized' ? (
					<div className={ styles.invoiceBodyRowCenter }>
						This invoice was paid on { dayjs(invoice.dates.finalized).format('MM/DD/YY') }.
					</div>
				) : null }
				{ invoice.status === 'cancelled' ? (
					<div className={ styles.invoiceBodyRowCenter }>
						This invoice was cancelled.
					</div>
				) : null }

			</span>
			<span className={ styles.invoiceBodySection }>
				<div className={ styles.invoiceBodySectionHeader }>Payment History on Order</div>
				<PaymentHistory payments={ payments }/>
			</span>
		</div>
	);
}

export default FinalizeSection;