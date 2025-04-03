'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import { serverActionCall } from 'lib/http/clientHttpRequester';
import { validateEmpty, validateDefined, validateNumberOnly, validateCurrency, runValidators } from 'lib/validators/inputValidators';
import { formatUSDAmount } from 'lib/utils';

import { toastValidationError } from 'components/CustomToaster';

import { addCardAndPayByCard, payByCard, payByImage } from 'actions/payment';

import styles from 'public/styles/page/paymentWidget.module.scss';
import visaLogo from 'assets/images/logos/visa.svg';
import amexLogo from 'assets/images/logos/amex.svg';
import mastercardLogo from 'assets/images/logos/mastercard.svg';
import discoverLogo from 'assets/images/logos/discover.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faImage } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcDiscover, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';

const PaymentForms = ({ orderId, invoiceId, cards, acceptCard, acceptAlternate, presetPaymentAmount, postFunc, balanceRemaining }) => {

	// ---------- State Variables
	const [paymentAmount, setPaymentAmount] = useState(presetPaymentAmount || '');
  const [existingCards, setExistingCards] = useState(cards || []);
	const [selectedCard, setSelectedCard] = useState('');
	const [creditCard, setCreditCard] = useState({
		cardNumber: '',
		expiration: '',
		cardCode: '',
		brand: null
	});
	const [alternatePaymentImage, setAlternatePaymentImage] = useState(null);

	// ---------- React References
	const cardSection = useRef(null);
	const alternateSection = useRef(null);
	const uploadAlternateImageLink = useRef(null);
	const submitButtonRef = useRef(null);

	// ---------- Validation functions for client-side error handling
	balanceRemaining = isNaN(Number.parseFloat(balanceRemaining)) === false ? balanceRemaining : Number.POSITIVE_INFINITY;
	const validateCreditCardNumber = () => validateEmpty(creditCard.cardNumber) === false || (creditCard.cardNumber.split(' ').join('').length === (creditCard.brand === 'amex' ? 15 : 16));
	const validateCreditCardExpiration = () => validateEmpty(creditCard.expiration) === false || (creditCard.expiration.split('/').join('').length === 4);
	const validateCreditCardCVC = () => validateEmpty(creditCard.cardCode) === false || (creditCard.cardCode.length === (creditCard.brand === 'amex' ? 4 : 3));
	const isValidAmount = () => (validateEmpty(paymentAmount) === false) || (parseFloat(paymentAmount) < parseFloat(balanceRemaining));

	// ---------- Client-side error tests
	const paymentValidationFields = [
		{ prop: paymentAmount, validator: validateEmpty, errorMsg: 'Please specify how much exactly is going to be paid here.' },
		{ prop: paymentAmount, validator: isValidAmount, errorMsg: 'Please enter a payment amount less than the balance outstanding on this order.' }
	];
	const newCardValidationFields = [
		{ prop: creditCard.cardNumber, validator: validateCreditCardNumber, errorMsg: 'The credit card number you provided us is missing some digits.' },
		{ prop: creditCard.expiration, validator: validateCreditCardExpiration, errorMsg: 'The credit card expiration date you provided us is incomplete.' },
		{ prop: creditCard.cardCode, validator: validateCreditCardCVC, errorMsg: 'Your CVC is too short.' },
		{ prop: creditCard.cardNumber, validator: validateEmpty, errorMsg: 'A credit card number is required.' },
		{ prop: creditCard.expiration, validator: validateEmpty, errorMsg: 'Your credit card\'s expiration month and year are required.' },
		{ prop: creditCard.cardCode, validator: validateEmpty, errorMsg: 'Your credit card\'s CVC is required.'  },
	];
	const existingCardValidationFields = [
		{ prop: selectedCard, validator: validateEmpty, errorMsg: 'A registered card needs to be selected. Either select a card if one\'s been registered or put in your credit card details.' }
	];
	const alternateValidationFields = [
		{ prop: alternatePaymentImage, validator: validateDefined, errorMsg: 'Select what file you want uploaded first before submitting this payment.' }
	];

	// ---------- State Update Functions
	const handleCreditCardUpdate = (event) => {
		const prop = event.currentTarget.name;
		let value = event.currentTarget.value;
		let newCard = { ...creditCard };

		if (prop === 'cardNumber') {
			// Update the brand information as well should the credit card number been changed
			switch (value[0]) {
				case '3':
					newCard.brand = 'amex';
					break;
				case '4':
					newCard.brand = 'visa';
					break;
				case '5':
					newCard.brand = 'mastercard';
					break;
				case '6':
					newCard.brand = 'discover';
					break;
				default:
					newCard.brand = null;
			}

			// Also reformat the credit card number so that it displays nicely on screen
			value = value.split(' ').join('');
			if (newCard.brand === 'amex') {
				value = (value.slice(0, 4) + ' ' + value.slice(4, 10) + ' ' + value.slice(10, 15)).trim();
			} else {
				value = (value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 12) + ' ' + value.slice(12, 16)).trim();
			}
		} else if (prop === 'expiration') {
			// Format the expiration date so that a slash appears between the month and the year
			value = value.split('/').join('');
			if (value.length >= 3) {
				value = (value.slice(0, 2) + '/' + value.slice(2, 4));
			}
		}

		newCard[prop] = value;
		setCreditCard(newCard);
	};

	const uploadAlternatePaymentImage = (event) => {
		setAlternatePaymentImage(event.currentTarget.files[0]);
	}

	const handleCardToUse = (event) => {
		setSelectedCard(event.currentTarget.value);
	}

	// Use this function to test whether characters are being properly typed into the credit card inputs
	const testCCNumbers = (event, limit, inputValue) => {
		const prop = event.currentTarget.name;

		// First, verify that the character that was pressed is indeed a number
		if (validateNumberOnly(event.data) === false) {
			event.preventDefault();
		}

		// Test whether more numbers are needed in any of the credit card input fields
		if (prop === 'cardNumber') {
			if (inputValue.split(' ').join('').length >= limit) {
				event.preventDefault();
			}
		} else {
			if (inputValue.split('/').join('').length >= limit) {
				event.preventDefault();
			}
		}
	};

	// Use this function to test whether characters are being properly typed into the payment amount input
	const testPaymentAmountNumber = (event) => {
		if (validateCurrency(paymentAmount + event.data) === false) {
			event.preventDefault();
		}
	}

	// Control cursor positioning in the inputs
	const placeCursorAtEnd = (event) => {
		const inputField = event.currentTarget;

		inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
		inputField.focus();
	};

	const showSection = (refElement) => {
		if (cardSection.current) { cardSection.current.style.height = '0px'; }
		if (alternateSection.current) { alternateSection.current.style.height = '0px'; }

		refElement.current.style.height = refElement.current.scrollHeight + 'px';
	};


	const resizeSection = () => {
		if (cardSection.current && cardSection.current.style.height !== '0px') { cardSection.current.style.height = cardSection.current.scrollHeight + 'px'; }
		if (alternateSection.current && alternateSection.current.style.height !== '0px') { alternateSection.current.style.height = alternateSection.current.scrollHeight + 'px'; }
	}

	const determineCardIcon = (brand) => {
		switch (brand?.toLowerCase()) {
			case 'visa': return faCcVisa;
			case 'mastercard': return faCcMastercard;
			case 'discover': return faCcDiscover;
			case 'amex': return faCcAmex;
			default: return faCreditCard;
		}
	};

	// ---------- Server Functions
	const addCardAndSubmitPayment = async () => {
		const errors = runValidators(newCardValidationFields);

		if (errors.length === 0) {
			const serverResult = await serverActionCall(addCardAndPayByCard, {
				...creditCard,
				orderId: orderId,
				invoiceId: invoiceId,
				paymentAmount: paymentAmount
			}, {
				loading: 'Processing the credit card...',
				success: 'Your credit card has been successfully processed!',
				error: 'Something went wrong when trying to validate and charge the credit card. Please check your credit card details and try again.'
			});

			if (serverResult?.success && serverResult?.card) {
				setExistingCards([...existingCards, serverResult.card]);
			}

			return { success: serverResult?.success, data: { card: serverResult?.card, payment: serverResult?.payment } };
		} else {
			toastValidationError(errors);
		}

		return { success : false };
	};

	const submitCardPayment = async () => {
		const errors = runValidators(existingCardValidationFields);

		if (errors.length === 0) {
			const serverResult = await serverActionCall(payByCard, {
				card: selectedCard,
				orderId: orderId,
				invoiceId: invoiceId,
				paymentAmount: paymentAmount
			}, {
				loading: 'Now processing the credit card payment...',
				success: 'A new payment has been successfully processed!',
				error: 'Something went wrong when trying to charge the credit card. Please try again. If you keep seeing this error message, the card is likely being declined.'
			});

			return { success: serverResult?.success, data: { payment: serverResult?.payment } };
		} else {
			toastValidationError(errors);
		}

		return { success : false };
	};

	const submitAlternatePayment = async () => {
		const errors = runValidators(alternateValidationFields);

		if (errors.length === 0) {
			const serverResult = await serverActionCall(payByImage, new FormData(alternateSection.current), {
				loading: 'Uploading the image...',
				success: 'A new payment has been successfully registered!',
				error: 'Something went wrong when trying to process this payment. Please try again.'
			});

			return { success: serverResult?.success, data: { payment: serverResult?.payment } };
		} else {
			toastValidationError(errors);
		}

		return { success : false };
	};

	const submitPayment = async () => {
		const errors = runValidators(paymentValidationFields);
		let serverResults = false;

		if (errors.length === 0) {
			submitButtonRef.current.disabled = true;

			if (cardSection.current && window.parseInt(cardSection.current.style.height, 10)) {
				serverResults = selectedCard ? await submitCardPayment() : await addCardAndSubmitPayment();
			}
			else if (alternateSection.current && window.parseInt(alternateSection.current.style.height, 10)) {
				serverResults = await submitAlternatePayment();
			}

			submitButtonRef.current.disabled = false;

			if (serverResults.success) {
				// Clear out all fields across all the payment forms
				setPaymentAmount('');
				setSelectedCard('');
				setCreditCard({
					cardNumber: '',
					expiration: '',
					cardCode: '',
					brand: null
				});
				setAlternatePaymentImage(null);

				if (postFunc) {
					postFunc(serverResults.data || {});
				}
			}
		} else {
			toastValidationError(errors);
		}
	};

	useEffect(() => {
		if (cardSection.current) {
			showSection(cardSection);
		} else if (alternateSection.current) {
			showSection(alternateSection);
		}

		screen.orientation.addEventListener("change", resizeSection);

		return () => {
			screen.orientation.removeEventListener('change', resizeSection);
		}
	}, []);

	return (
		<>
			<div className={ styles.paymentAccordion }>

				{ balanceRemaining < Number.POSITIVE_INFINITY ? (
					<div className={ styles.balanceRemainingTab }>
						Balance Remaining: ${ formatUSDAmount(balanceRemaining) }
					</div>
				) : null }
				<div className={ styles.paymentAmountSection }>
					{ presetPaymentAmount ? (
						<div>
							Amount Owed Now: ${ formatUSDAmount(presetPaymentAmount) }
						</div>
					) : (
						<>
							<label htmlFor='paymentAmount'>Payment Amount ($)</label>
							<input
								type='text'
								id='paymentAmount'
								className={ styles.paymentAmountField }
								onChange={ (event) => setPaymentAmount(event.currentTarget.value) }
								value={ paymentAmount }
								tabIndex='-1'
								onBeforeInput={ (event) => testPaymentAmountNumber(event) }
								onPaste={ (event) => event.preventDefault() }
								onClick={ placeCursorAtEnd }
								onKeyUp={ placeCursorAtEnd }
								autoComplete='off'
							/>
						</>
					)}
				</div>

				{ /* CREDIT CARD SECTION */ }
				{ acceptCard ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(cardSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Credit Card</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faCreditCard }/>
						</div>
						<form className={ styles.paymentAccordionSectionBody } ref={ cardSection }>
							<input type='hidden' name='paymentAmount' value={ paymentAmount }/>
							<input type='hidden' name='orderId' value={ orderId }/>

							<div className={ styles.paymentRegularRowFlexEnd }>
								<span className={ styles.paymentCcExistingCard }>
									<input id={ 'card_new' } type='radio' name='card' defaultChecked={ true } value='' onClick={ handleCardToUse }/>
									<label htmlFor={ 'card_new' } className={ styles.paymentCcExistingCardLogo }>New Card</label>
								</span>
								{ existingCards.map((card, index) => {
									if (index < 3) {
										return (
											<span key={ index }>
											<input id={ 'card_' + card.id } type='radio' name='card' value={ card.id } onClick={ handleCardToUse }/>
											<label htmlFor={ 'card_' + card.id } className={ styles.paymentCcExistingCardLogo }>
												<FontAwesomeIcon icon={ determineCardIcon(card.brand) } className={ styles.paymentCcExistingCardLogo }/>
												{ '(...' + card.last4 + ')' }
											</label>
										</span>
										);
									}
								}) }
							</div>

							<hr className={ styles.paymentRegularRowRule }/>

							<div className={ classNames({
								[styles.paymentRegularRowCenter]: true,
								[styles.paymentRegularRowDisabled]: !!selectedCard
							})}>
								<input
									name='cardNumber'
									type='tel'
									className={ styles.paymentCcNumberInput }
									tabIndex='-1'
									placeholder='Enter your 15 or 16-digit card number here...'
									value={ creditCard.cardNumber }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testCCNumbers(event, (creditCard.brand === 'amex' ? 15 : 16), creditCard.cardNumber) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
									disabled={ !!(selectedCard) }
								/>
							</div>
							<div className={ classNames({
								[styles.paymentRegularRowCenter]: true,
								[styles.paymentRegularRowDisabled]: !!selectedCard
							})}>
								<label htmlFor='creditCardExp' className={ styles.paymentAmountLabel }>Exp Date</label>
								<input
									id='creditCardExp'
									name='expiration'
									type='tel'
									className={ styles.paymentSmallInput }
									tabIndex='-1'
									placeholder='MM/YY'
									value={ creditCard.expiration }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testCCNumbers(event, 4, creditCard.expiration) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
									disabled={ !!(selectedCard) }
								/>
								<label htmlFor='creditCardCode' className={ styles.paymentAmountLabel }>CSC</label>
								<input
									id='creditCardCode'
									name='cardCode'
									type='tel'
									className={ styles.paymentSmallInput }
									tabIndex='-1'
									placeholder={ (creditCard.brand === 'amex' ? '####' : '###') }
									value={ creditCard.cardCode }
									onChange={ handleCreditCardUpdate }
									onBeforeInput={ (event) => testCCNumbers(event, (creditCard.brand === 'amex' ? 4 : 3), creditCard.cardCode) }
									onPaste={ (event) => event.preventDefault() }
									onClick={ placeCursorAtEnd }
									onKeyUp={ placeCursorAtEnd }
									autoComplete='off'
									disabled={ !!(selectedCard) }
								/>
								<span className={ styles.paymentCcIcons }>
									<Image
										src={ visaLogo }
										className={ creditCard.brand === 'visa' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Visa"
									/>
									<Image
										src={ amexLogo }
										className={ creditCard.brand === 'amex' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Amex"
									/>
									<Image
										src={ mastercardLogo }
										className={ creditCard.brand === 'mastercard' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="MasterCard"
									/>
									<Image
										src={ discoverLogo }
										className={ creditCard.brand === 'discover' ? styles.emphasizeCardBrand : (creditCard.brand !== null ? styles.hideCardBrand : '') }
										width={ 32 }
										height={ 32 }
										alt="Discover"
									/>
								</span>
							</div>
						</form>
					</div>
				) : null }

				{ /* ALTERNATE SECTION */ }
				{ acceptAlternate ? (
					<div className={ styles.paymentAccordionSection }>
						<div className={ styles.paymentAccordionSectionHeader } onClick={ () => showSection(alternateSection) }>
							<span className={ styles.paymentAccordionSectionHeaderText }>Other</span>
							<FontAwesomeIcon className={ styles.paymentAccordionSectionHeaderIcon } icon={ faImage }/>
						</div>
						<form className={ styles.paymentAccordionSectionBody } ref={ alternateSection }>
							<input type='hidden' name='paymentAmount' value={ paymentAmount }/>
							<input type='hidden' name='orderId' value={ orderId } />

							<div className={ styles.paymentRegularRowCenter }>
								{ alternatePaymentImage ? alternatePaymentImage.name : 'No file selected yet...' }
							</div>
							<div className={ styles.paymentRegularRowCenter }>
								<button type='button' className={ styles.uploadImageButton } onClick={ () => uploadAlternateImageLink.current.click() }>
									Upload Image
								</button>
								<input
									type='file'
									name='paymentImage'
									ref={ uploadAlternateImageLink }
									className={ styles.uploadFileInput }
									accept='.pdf,.jpeg,.jpg,.png'
									onChange={ uploadAlternatePaymentImage }
								/>
							</div>
						</form>
					</div>
				) : null }

				<div className={ styles.submitRow }>
					<button className={ styles.submitButton } type='button' onClick={ submitPayment } ref={ submitButtonRef }>Make Payment</button>
				</div>
			</div>
		</>
	);
}

export default PaymentForms;