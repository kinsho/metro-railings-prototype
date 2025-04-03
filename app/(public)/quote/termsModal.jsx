'use client'

import React, { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import styles from 'public/styles/page/quote.module.scss';
import componentStyles from 'public/styles/page/components.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faPrint } from '@fortawesome/free-solid-svg-icons';

const TermsModal = ({ markdownText, termsFileHandle, closeFunc }) => {

	const overlayRef = useRef(null);
	const modalRef = useRef(null);
	const modalBodyRef = useRef(null);

	const isCurrentlyAnimating = () => {
		return (modalRef.current.classList.contains(styles.modalShiftDownOut));
	}

	const closeModal = () => {
		event.preventDefault();

		if (isCurrentlyAnimating() === false) {
			modalRef.current.classList.add(componentStyles.modalShiftDownOut);

			window.setTimeout(() => {
				modalRef.current.classList.remove(componentStyles.modalOverlayShow);
				window.setTimeout(() => {
					closeFunc();
				}, 100);
			}, 275);
		}
	}

	const scrollDown = () => {
		modalBodyRef.current.scrollTo({
			top: modalBodyRef.current.scrollTop + 400,
			behavior: 'smooth'
		});
	}

	useEffect(() => {
		window.setTimeout(() => {
			overlayRef.current.classList.add(componentStyles.modalOverlayShow);
			modalRef.current.classList.add(componentStyles.modalShiftDownIn);
		}, 100);
	}, []);

	const printPage = () => {
		const iframe = document.frames ? document.frames['terms'] : document.getElementById('terms');
		const iframeWindow = iframe.contentWindow || iframe;

		iframe.focus();
		iframeWindow.print();

		return false;
	};

	return (
		<div className={ componentStyles.modalOverlay } ref={ overlayRef }>
			<div className={ componentStyles.modal } ref={ modalRef }>
				<div className={ componentStyles.modalBody } ref={ modalBodyRef }>
					<div className={ componentStyles.modalBodyMarkdown }>
						<Markdown>{ markdownText }</Markdown>
					</div>
				</div>
				<div className={ styles.modalScrollDownNotice } onClick={ scrollDown }>
					Scroll Down <FontAwesomeIcon icon={ faArrowAltCircleDown } className={ styles.modalScrollDownIcon }/>
				</div>
				<div className={ componentStyles.modalButtonRow }>
					<button type='button' onClick={ () => closeModal() } className={ componentStyles.modalConfirmButton }>OK</button>
					<button type='button' className={ styles.printButton } onClick={ printPage }>
						Print <FontAwesomeIcon icon={ faPrint } className={ styles.printIcon }/>
					</button>
					<iframe id='terms' src={ ' /quote/terms?fileHandle=' + termsFileHandle } className={ styles.printIframe } title='Terms and Conditions'/>
				</div>
			</div>
		</div>
	);
};

export default TermsModal;