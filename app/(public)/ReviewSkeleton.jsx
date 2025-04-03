import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import React from 'react';

import styles from 'public/styles/page/home.module.scss';

const ReviewSkeleton = () => {
	return (
		<SkeletonTheme baseColor={ styles.silverSkeleton } highlightColor={ styles.whiteHighlighter }>
			<div className={ styles.reviewBlock }>
				<Skeleton count={ 2 } containerClassName={ styles.reviewBlockBody } />
				<Skeleton containerClassName={ styles.reviewBlockData } />
				<Skeleton containerClassName={ styles.reviewBlockAuthor } />
				<Skeleton containerClassName={ styles.reviewBlockData } />
				<Skeleton containerClassName={ styles.reviewBlockImages } height={ 100 } />
				<Skeleton count={ 1 } containerClassName={ styles.reviewBlockBody } />
			</div>
		</SkeletonTheme>
	);
}

export default ReviewSkeleton;