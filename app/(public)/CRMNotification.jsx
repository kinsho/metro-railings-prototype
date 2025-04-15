'use client'

import React, { useEffect, useRef } from 'react';

import styles from 'public/styles/page/home.module.scss';

const ReviewSection = () => {
	
	const notificationRef = useRef(null);

	const dismissThisNotification = () => {
		notificationRef.current.classList.add(styles.crmNotificationBarPopOut);
		notificationRef.current.style.top = '105vh';
	}

	const resetNotification = () => {
		if (notificationRef.current.classList.contains(styles.crmNotificationBarPopIn)) {
			notificationRef.current.style.top = window.innerHeight - notificationRef.current.offsetHeight + 'px';
		}
	}

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			notificationRef.current.classList.add(styles.crmNotificationBarPopIn);
			notificationRef.current.style.top = window.innerHeight - notificationRef.current.offsetHeight + 'px';
		}, 2000);

		window.addEventListener('resize', resetNotification);

		return () => {
			clearTimeout(timeoutId);
			window.removeEventListener('resize', resetNotification);
		};
	}, []);

	return (
		<div className={ styles.crmNotificationBar } ref={ notificationRef }>
			<div className={ styles.crmNotificationBarBody }>
				<p>Welcome to the public-facing website for Metro Railings! Feel free to navigate around here and check out the way I portray Metro Railings to the general public.</p>
				<p>Once you are ready to visit our hand-made CRM, click <a href='/login' target='_blank' className={ styles.crmNotificationBarLink }>here</a> to navigate there.</p>
			</div>
			<div className={ styles.crmNotificationBarDismissRow }>
				<span onClick={ dismissThisNotification }>Dismiss This Notification</span>
			</div>
		</div>
	);
};

export default ReviewSection;