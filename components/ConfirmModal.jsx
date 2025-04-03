'use client'

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

import styles from "public/styles/page/components.module.scss";

const ConfirmModal = ({ text, boldText, image, confirmFunc, closeFunc }) => {

	const overlayRef = useRef(null);
	const modalRef = useRef(null);

	const isCurrentlyAnimating = () => {
		return (modalRef.current.classList.contains(styles.modalShiftDownOut));
	}

	const closeModal = (runConfirmFunction) => {
		event.preventDefault();

		if (isCurrentlyAnimating() === false) {
			modalRef.current.classList.add(styles.modalShiftDownOut);

			window.setTimeout(() => {
				modalRef.current.classList.remove(styles.modalOverlayShow);
				window.setTimeout(() => {
					if (runConfirmFunction) { confirmFunc() }
					closeFunc();
				}, 100);
			}, 275);
		}
	}

	useEffect(() => {
		window.setTimeout(() => {
			overlayRef.current.classList.add(styles.modalOverlayShow);
			modalRef.current.classList.add(styles.modalShiftDownIn);
		}, 100);
	}, []);

	return (
		<div className={ styles.modalOverlay } ref={ overlayRef }>
			<div className={ styles.modal } ref={ modalRef }>
				<div className={ styles.modalBody }>
					{ image ? (
						<Image
							src={ image }
							alt={ 'Railing' }
							height={ 150 }
							width={ 150 }
						/>
					) : null }
					{ boldText ? (
						<div className={ styles.modalBodyText }><b>{ boldText }</b></div>
					) : null }
					<div className={ styles.modalBodyText }>{ text }</div>
				</div>
				<div className={ styles.modalButtonRow }>
					<button type='button' onClick={ () => closeModal(true) } className={ styles.modalConfirmButton }>Yes</button>
					<button type='button' onClick={ () => closeModal(false) } className={ styles.modalCancelButton }>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;