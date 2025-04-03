import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { redirect } from 'next/navigation'
import Image from 'next/image';
import dayjs from 'dayjs';

import FinalizeSection from 'app/(public)/quote/finalize';

import { translateDesignCode, fetchDesignMetadata } from 'lib/designs/translator';
import { decryptNumber } from 'lib/utils';
import { getInvoice } from 'lib/http/invoicesDAO';
import { getUsersByUsername } from 'lib/http/usersDAO';

import styles from 'public/styles/page/quote.module.scss';
import logo from "assets/images/logos/white_logo_color_background.png";

export const metadata = {
	title: 'Quote',
	description: '',
	robots: {
		index: false,
		follow: false
	}
};

const QuoteServer = async ({ searchParams }) => {
	const orderId = decryptNumber(searchParams?.oid || '');
	const invoiceId = decryptNumber(searchParams?.iid || '');

	const quote = await getInvoice(orderId, invoiceId);

	if (quote === null || quote.category !== 'quote' ) {
		redirect('/');
	}

	// Fetch all salesman information as well as past payments made against the order with which this invoices is associated and the cards that were used on those past payments
	const salesmen = await getUsersByUsername(quote.sales.assignees.map(assignee => assignee.username));

	// Pull the city/state information together into one coherent string
	let cityStateInfo = [];
	if (quote.customer.city) {
		cityStateInfo.push(quote.customer.city);
	}
	if (quote.customer.state) {
		cityStateInfo.push(quote.customer.state);
	}
	cityStateInfo = cityStateInfo.join(',');

	// Grab a list of all selected design options
	const designs = Object.keys(quote.design);

	// Pull the 'Terms and Conditions' from the file system
	const textDir = resolve('./', 'assets/text/terms');
	const fileName = quote.termsFileHandle.split('/').pop();
	const termsRawText = readFileSync( textDir + '/' + fileName, { encoding: 'utf-8' });

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.logoHeaderContainer }>
				<Image src={ logo } alt="Logo" className={ styles.logoHeader } priority />
			</div>
			<div className={ styles.pageHeader }>QUOTE</div>

			<div className={ styles.infoSection }>
				{ /* COMPANY INFO */ }
				<span className={ styles.infoColumnCompany }>
					<span className={ styles.infoColumnHeader }>Metro Railings</span>
					<br />
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
					<span className={ styles.infoColumnHeader }>ORDER #{ quote.orderId }</span>
					<br />
					{ 'Drafted on ' + dayjs(quote.dates.created).format('MMM DD, YYYY') }
					<br />
					Status: <i className={ styles.quoteStatusText }>{ quote.status.toUpperCase() }</i>
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
					<br />
					{ quote.customer.name }
					{ quote.customer.address ? (
						<>
							<br />
							{ quote.customer.address }
						</>
					) : null }
					<br/>
					{ cityStateInfo }
					{ quote.customer.email.map((email) => {
						<>
							<br/>
							{ email }
						</>
					})}
					{ quote.customer.areaCode && quote.customer.phoneOne && quote.customer.phoneTwo ? (
							<>
								<br />
								{ quote.customer.areaCode + '-' + quote.customer.phoneOne + '-' + quote.customer.phoneTwo }								
							</>
					) : null }
				</span>
			</div>

			{ quote.status !== 'open' ? (
				<div className={ styles.invoiceNotice }>This quote has been { quote.status }.</div>
			) : null }

			<div className={ styles.quoteContainer }>
				<div className={ styles.quoteBody }>

					{ /* SUMMARY */ }
					{ quote.text.additionalDescription ? (
						<div className={ styles.quoteMemo } dangerouslySetInnerHTML={{ __html: quote.text.additionalDescription.split('\n').join('<br />') }} />
					) : null }

					{ /* DESIGN DETAILS */ }
					{ quote.design.type !== 'T-MISC' ? (
						<div className={ styles.quoteDesignDetails }>
							{ designs.map((design, index) => {
								let designSpecifics = translateDesignCode(quote.design[design]);
								let designMetadata = fetchDesignMetadata(quote.design[design]);
								return (
									<div className={ styles.quoteDesignRow } key={ index }>
										<span className={ styles.quoteDesignRowLabel }>
											<div className={ styles.quoteDesignRowCategory }>{ designMetadata.technicalLabel }</div>
											<div className={ styles.quoteDesignRowSelection }>{ designSpecifics.label }</div>
										</span>
										<span className={ styles.quoteDesignRowDescriptor }>{ quote.designDescription[design] }</span>
									</div>
								);
							})}
						</div>
					) : null }
				</div>

				{ /* PRICE */ }
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Subtotal</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.subtotal?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>Tax</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.tax?.toFixed(2) || '--' }</span>
				</div>
				<div className={ styles.quotePriceLine }>
					<span className={ styles.quotePriceHeader }>AMOUNT DUE</span>
					<span className={ styles.quotePriceListing }>${ quote.pricing.orderTotal?.toFixed(2) || '--' }</span>
				</div>

			</div>

			<FinalizeSection
				orderId={ orderId }
				jsonQuote={ JSON.stringify(quote) }
				termsText={ termsRawText }
				termsFileHandle={ quote.termsFileHandle }
			/>
		</div>
	);
};

export default QuoteServer;