'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import PaymentForms from 'components/PaymentForms';
import TermsModal from 'app/(public)/quote/termsModal';

import styles from 'public/styles/page/quote.module.scss';

const FinalizeSection = ({ orderId, jsonQuote, termsText, termsFileHandle }) => {
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);

	const router = useRouter();
	const invoice = JSON.parse(jsonQuote);

	const openModal = () => {
		setShowTermsModal(true);
	};

	const closeModal = () => {
		setShowTermsModal(false);
	}

	const finalizeOrder = () => {
		window.setTimeout(() => { router.push('/quote/thank-you?orderId=' + orderId + '&amount=' + invoice.amount) }, 1500);
	}

	return (
		<>
			{ invoice.status === 'open' ? (
				<>
					<div className={ styles.termsAcceptedSection }>
						<input id='termsAccepted' type='checkbox' className={ styles.termsAcceptedCheckbox } checked={ termsAccepted } readOnly />
						<label onClick={ () => setTermsAccepted(!(termsAccepted)) }></label>
						<span className={ styles.termsAcceptedLabel }>I have read and accepted the <span className={ styles.termsAndConditionsLink } onClick={ openModal }>terms and conditions</span>.</span>
					</div>
					<div className={ styles.paymentSection }>
						{ !(termsAccepted) ? (
							<div className={ styles.paymentSectionOverlay }>
								<div className={ styles.paymentSectionOverlayNotice }>Please mark the checkbox above first indicating that you have read and agreed with the Terms and Conditions.</div>
							</div>
						) : null }
						<PaymentForms
							orderId={ orderId }
							invoiceId={ invoice._id }
							acceptCard={ true }
							acceptAlternate={ false }
							cards={ [] }
							postFunc={ finalizeOrder }
							presetPaymentAmount={ invoice.amount }
						/>
					</div>
				</>
			) : (
				<>
					<div className={ styles.termsAcceptedSection }>
						<span className={ styles.termsAndConditionsLink } onClick={ openModal }>Terms and Conditions</span>
					</div>
				</>
			)}

			{ showTermsModal ? (
				<TermsModal markdownText={ termsText } termsFileHandle={ termsFileHandle } closeFunc={ closeModal }/>
			) : null }
		</>
	);
}

export default FinalizeSection;