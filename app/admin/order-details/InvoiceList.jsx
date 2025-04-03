'use client'

import React, { useContext } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { OrdersContext, OrdersDispatchContext } from 'app/admin/order-details/orderContext';

import { cancelInvoice as cancelInvoiceServer } from 'actions/invoice';

import { obfuscateNumber, formatUSDAmount } from 'lib/utils';
import { serverActionCall } from 'lib/http/clientHttpRequester';

import styles from 'public/styles/page/orderDetails.module.scss';

const InvoiceList = () => {

	const orderDetails = useContext(OrdersContext);
	const orderDispatch = useContext(OrdersDispatchContext);

	const cancelInvoice = async (invoice) => {
		const processedInvoice = await serverActionCall(cancelInvoiceServer, { invoiceId: invoice._id }, {
			loading: 'Cancelling invoice #' + invoice._id + '...',
			success: 'Invoice #' + invoice._id + ' has been cancelled.',
			error: 'Something went wrong when trying to cancel invoice #' + invoice._id + '. Try again or consult Rickin.'
		})

		if (processedInvoice.success) {
			const updatedInvoice = JSON.parse(processedInvoice.invoice);
			let salesInvoices = structuredClone(orderDetails.invoices);
			for (let i = 0; i < salesInvoices.length; i += 1) {
				if (salesInvoices[i]._id === updatedInvoice._id) {
					salesInvoices[i] = updatedInvoice;
				}
			}

			orderDispatch({
				type: 'updateInvoice',
				invoices: salesInvoices
			});
		}
	}

	const navigateToInvoice = (invoice) => {
		if (invoice.category === 'quote') {
			window.open('/quote?oid=' + obfuscateNumber(invoice.orderId) + '&iid=' + obfuscateNumber(invoice._id), '_blank');
		} else {
			window.open('/invoice?oid=' + obfuscateNumber(invoice.orderId) + '&iid=' + obfuscateNumber(invoice._id), '_blank');
		}
	}

	const translateStatus = (status) => {
		switch (status) {
			case 'open': 
				return 'Open';
			case 'finalized':
				return 'Finalized';
			case 'cancelled':
				return 'Cancelled';
			default:
				return '';
		}
	}

	return (
		<span className={ styles.invoiceTable }>

			<div className={ styles.invoiceTableHeaderRow }>
				<span className={ styles.invoiceTableHeaderCell }>ID</span>
				<span className={ styles.invoiceTableHeaderCell }>Date Issued</span>
				<span className={ styles.invoiceTableHeaderCell }>Status</span>
				<span className={ styles.invoiceTableHeaderCell }>Invoice Amount</span>
				<span className={ styles.invoiceTableHeaderCell }>Date Paid</span>
				<span className={ styles.invoiceTableHeaderCell }>Actions</span>
			</div>

			{ orderDetails.invoices.map((invoice, index) => {
				return (
					<div className={ styles.invoiceTableRow } key={ index }>
						<span className={ styles.invoiceTableLink } onClick={ () => navigateToInvoice(invoice) }>{ invoice._id }</span>
						<span className={ styles.invoiceTableCell }>{ dayjs(invoice.dates.created).format('MM/DD/YY') }</span>
						<span className={ classNames({
							[styles.invoiceTableCell]: true,
							[styles.invoiceStatusCancelled]: invoice.status === 'cancelled',
							[styles.invoiceStatusFinalized]: invoice.status === 'finalized',
							[styles.invoiceStatusOpen]: invoice.status === 'open'
						}) }>
							<span>{ translateStatus(invoice.status) }</span>
						</span>
						<span className={ styles.invoiceTableCell }>${ formatUSDAmount(invoice.amount) }</span>
						<span className={ styles.invoiceTableCell }>{ invoice.dates.finalized ? dayjs(invoice.dates.finalized).format('MM/DD/YY') : '--' }</span>
						<span className={ styles.invoiceTableCell }>
							{ invoice.status === 'open' ? (
								<button type='button' className={ styles.invoiceCancelButton } onClick={ () => cancelInvoice(invoice) }>Cancel</button>
							) : null }
						</span>
					</div>
				);
			}) }
		</span>
	);
}

export default InvoiceList;