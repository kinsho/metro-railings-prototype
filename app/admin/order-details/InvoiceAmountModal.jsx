'use client'

import React, { useState } from 'react';

import { quickToastNotice } from 'components/CustomToaster';

import { validateFloat } from 'lib/validators/inputValidators';
import { formatUSDAmount } from 'lib/utils';

import styles from 'public/styles/page/orderDetails.module.scss';
import componentStyles from 'public/styles/page/components.module.scss';

const InvoiceAmountModal = ({ closeFunc, contentData }) => {

	const [invoiceAmount, setInvoiceAmount] = useState(0);

	const orderDetails = contentData.order;
	const modalData = contentData.modalData;

	const calculatePaymentAmount = (percentage) => {
		setInvoiceAmount(Math.round(orderDetails.payments.balanceRemaining * percentage) / 100);
	}

	const setPaymentAmount = (event) => {
		setInvoiceAmount(event.currentTarget.value);
	}

	const submitAmount = (event) => {
		event.preventDefault();

		if (validateFloat(invoiceAmount)) {
			const amount = parseFloat(invoiceAmount);
			if (amount > 0 && amount <= orderDetails.payments.balanceRemaining) {
				modalData.amount = amount;
				closeFunc(true);
				return true;
			}
		}

		quickToastNotice('Enter a valid amount to charge. Make sure the amount is less than the balance outstanding on this order.')
	}

	return (
		<>
			<div className={ componentStyles.modalBody }>
				<p>Specify the amount that needs to be charged in this new quote/invoice.</p>

				<div className={ styles.invoiceAmountModalForm }>
					<span className={ styles.modalInputGroup }>
						<label htmlFor='invoiceAmount' className={ styles.orderFormLabel }>Amount</label>
						<span className={ styles.orderDetailsInputRow }>
							<span className={ styles.orderInputNeighboringText }>$</span>
							<input
								type='text'
								name='invoiceAmount'
								id='invoiceAmount'
								className={ styles.smallInputControl }
								value={ invoiceAmount }
								onChange={ setPaymentAmount }
							/>
						</span>
						<div className={ styles.orderInputNeighboringText }>
							Charge
							<button className={ styles.orderDetailsSectionActionButton } onClick={ () => calculatePaymentAmount(25) }>25%</button>
							<button className={ styles.orderDetailsSectionActionButton } onClick={ () => calculatePaymentAmount(50) }>50%</button>
							<button className={ styles.orderDetailsSectionActionButton } onClick={ () => calculatePaymentAmount(100) }>100%</button>
							of the balance remaining
						</div>
					</span>

					<span className={ styles.invoiceAmountModalInfo }>
						<span className={ styles.priceGroup }>
							<label className={ styles.priceLabel }>Order Total</label>
							<div className={ styles.priceText }>${ formatUSDAmount(orderDetails.pricing.orderTotal) }</div>
						</span>
						<span className={ styles.priceGroup }>
							<label className={ styles.priceLabel }>Balance Remaining</label>
							<div className={ styles.priceText }>${ formatUSDAmount(orderDetails.payments.balanceRemaining) }</div>
						</span>
					</span>
				</div>

			</div>
			<div className={ componentStyles.modalButtonRow }>
				<button type='button' onClick={ submitAmount } className={ componentStyles.modalConfirmButton }>OK</button>
				<button type='button' onClick={ () => closeFunc(false) } className={ componentStyles.modalCancelButton }>Cancel</button>
			</div>
		</>
	);
};

export default InvoiceAmountModal;