import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import styles from 'public/styles/page/components.module.scss';

export function SubLoader() {
	return ( <FontAwesomeIcon icon={ faSpinner } /> );
}

export function UploadingLoader() {
	return (
		<>
			<div className={ styles.uploadingIndicators }>
				<span className={ styles.sectionLoadingText }>Processing</span>
				<span className={ styles.loadingBall }></span>
				<span className={ styles.loadingBall }></span>
				<span className={ styles.loadingBall }></span>
			</div>
		</>
	);
}