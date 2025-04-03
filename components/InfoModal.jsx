'use client'

import React, { useState, useEffect, useRef } from 'react';

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';

const InfoModal = ({ text, closeFunc }) => {

	const [showScrollNotice, setShowScrollNotice] = useState(false);

	const overlayRef = useRef(null);
	const modalRef = useRef(null);
	const modalBodyRef = useRef(null);

	const isCurrentlyAnimating = () => {
		return (modalRef.current.classList.contains(styles.modalShiftDownOut));
	}

	const closeModal = () => {
		event.preventDefault();

		if (isCurrentlyAnimating() === false) {
			modalRef.current.classList.add(styles.modalShiftDownOut);

			window.setTimeout(() => {
				modalRef.current.classList.remove(styles.modalOverlayShow);
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
			overlayRef.current.classList.add(styles.modalOverlayShow);
			modalRef.current.classList.add(styles.modalShiftDownIn);

			if (modalBodyRef.current.scrollHeight > modalBodyRef.current.scrollTop + modalBodyRef.current.offsetHeight) {
				setShowScrollNotice(true);
			}
		}, 100);
	}, []);

	return (
		<div className={ styles.modalOverlay } ref={ overlayRef }>
			<div className={ styles.modal } ref={ modalRef }>
				<div className={ styles.modalBody } ref={ modalBodyRef }>
					{ text }
				</div>
				{ showScrollNotice ? (
					<div className={ styles.modalScrollDownNotice } onClick={ scrollDown }>
						Scroll Down <FontAwesomeIcon icon={ faArrowAltCircleDown } className={ styles.modalScrollDownIcon } />
					</div>
				) : null }
				<div className={ styles.modalButtonRow }>
					<button type='button' onClick={ () => closeModal() } className={ styles.modalConfirmButton }>OK</button>
				</div>
			</div>
		</div>
	);
};

export default InfoModal;