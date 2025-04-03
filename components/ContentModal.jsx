'use client'

import React, { useEffect, useRef } from 'react';

import styles from "public/styles/page/components.module.scss";

const ContentModal = ({ ContentJSX, data, confirmFunc, closeFunc }) => {

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
		<div className={ styles.modalOverlay } ref={ overlayRef } onClick={ closeModal }>
			<div className={ styles.modal } ref={ modalRef } onClick={ (event) => event.stopPropagation() }>
				<ContentJSX closeFunc={ closeModal } contentData={ data } />
			</div>
		</div>
	);
};

export default ContentModal;