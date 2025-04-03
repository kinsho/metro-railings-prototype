import { httpRequest } from 'lib/http/serverHttpRequester';
import { obfuscateNumber } from 'lib/utils';

/**
 * Function designed to send an e-mail to us whenever a prospect fills out the "contact us" form
 */
export async function sendLeadEmail(data) {
	// Format the data before it's packaged and sent over the wire to Loop
	data.replyEmail = data.email || process.env.NEXT_PUBLIC_SUPPORT_MAILBOX;
	data.email = data.email || 'N/A';
	data.address = data.address || 'N/A';
	data.city = data.city || 'N/A';
	data.state = data.state || 'N/A';

	const postData = {
		email: process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
		transactionalId: process.env.LOOPS_LEAD_EMAIL_TRANSACTION_ID,
		dataVariables: data
	};

	const emailResult = await httpRequest('https://app.loops.so/api/v1/transactional', 'POST', postData, 'Bearer ' + process.env.LOOPS_API_KEY);
	if (emailResult.success === false) {
		console.error(emailResult.error?.message || 'E-mail not sent');
		return false;
	}

	return true;
}

/**
 * Function designed to send an e-mail informing a prospect or customer that a quote or invoice is ready for him
 */
export async function sendQuoteInvoiceEmail(order, invoiceId, isQuote) {
	let address = [];
	let data = {};

	// Figure out the elements that will be forming the address
	if (order.customer.address) {
		address.push(order.customer.address);
	}
	if (order.customer.city) {
		address.push(order.customer.city);
	}
	if (order.customer.state) {
		address.push(order.customer.state);
	}

	// Format the data before it's packaged and sent over the wire to Loop
	data.replyEmail = process.env.NEXT_PUBLIC_SUPPORT_MAILBOX;
	data.id = order._id;
	data.productDesc = order.sales.header;
	data.name = order.customer.name;
	data.address = address.join(', ');
	data.quoteLink = process.env.BASE_URL + '/' + (isQuote ? 'quote' : 'invoice') + '?oid=' + obfuscateNumber(order._id) + '&iid=' + obfuscateNumber(invoiceId);

	// As we may have multiple e-mail addresses associated with this quote, send an e-mail to each one individually
	for (let i = 0; i < order.customer.email.length; i += 1) {
		const postData = {
			email: order.customer.email[i],
			transactionalId: (isQuote ? process.env.LOOPS_QUOTE_EMAIL_TRANSACTION_ID : process.env.LOOPS_INVOICE_EMAIL_TRANSACTION_ID),
			dataVariables: data
		};

		const emailResult = await httpRequest('https://app.loops.so/api/v1/transactional', 'POST', postData, 'Bearer ' + process.env.LOOPS_API_KEY);
		if (emailResult.success === false) {
			console.error(emailResult.error?.message || 'E-mail not sent');
			return false;
		}
	}

	return true;
}

/**
 * Function designed to send an e-mail informing us that an order has been finalized
 */
export async function sendFinalizedOrderEmail(orderId) {
	const postData = {
		email: process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
		transactionalId: process.env.LOOPS_ORDER_FINALIZED_TRANSACTION_ID,
		dataVariables: {
			orderId: orderId
		}
	};

	const emailResult = await httpRequest('https://app.loops.so/api/v1/transactional', 'POST', postData, 'Bearer ' + process.env.LOOPS_API_KEY);
	if (emailResult.success === false) {
		console.error(emailResult.error?.message || 'E-mail not sent');
		return false;
	}

	return true;
}

/**
 * Function designed to send an e-mail informing us that an invoice has been paid
 */
export async function sendInvoicePaidEmail(orderId, invoiceId) {
	const postData = {
		email: process.env.NEXT_PUBLIC_SUPPORT_MAILBOX,
		transactionalId: process.env.LOOPS_INVOICE_PAID_TRANSACTION_ID,
		dataVariables: {
			orderId: orderId,
			invoiceId: invoiceId
		}
	};

	const emailResult = await httpRequest('https://app.loops.so/api/v1/transactional', 'POST', postData, 'Bearer ' + process.env.LOOPS_API_KEY);
	if (emailResult.success === false) {
		console.error(emailResult.error?.message || 'E-mail not sent');
		return false;
	}

	return true;
}