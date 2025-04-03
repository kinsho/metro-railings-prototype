import styles from 'public/styles/page/components.module.scss';

export default function Loading() {

	// @TODO: Create page-specific loading pages

	return (
		<>
			<div className={ styles.baseLoaderOverlay }>
				<span className={ styles.loadingText }>Loading</span>
				<span className={ styles.loadingBall } />
				<span className={ styles.loadingBall } />
				<span className={ styles.loadingBall } />
			</div>
		</>
	);
}