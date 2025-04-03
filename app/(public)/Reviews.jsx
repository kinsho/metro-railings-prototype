'use client'

import React from 'react';
import Image from 'next/image';
import dayjs from "dayjs";

import EmblaCarousel from 'lib/carousel/EmblaCarousel';

import styles from 'public/styles/page/home.module.scss';
import 'public/styles/foundation/embla.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import googleLogo from 'assets/images/logos/google-name.png';

const ReviewSection = ({ jsonReviews }) => {
	const googleReviews = JSON.parse(jsonReviews);

	return (
		<EmblaCarousel options={{ loop: true }}>
			{ googleReviews.map((review, index) => {
				return (
					<div className={ styles.reviewBlock + ' embla__slide' } key={ index }>
						<div className={ styles.reviewBlockBody }>{ review.text }</div>
						<div className={ styles.reviewBlockData }>
							{ Array.from(Array(parseInt(review.rating, 10)).keys()).map((index) => {
								return (<FontAwesomeIcon key={ index } icon={ faStar } className={ styles.reviewBlockStar } />);
							})}
							<Image src={ googleLogo } alt='Goo Logo' height={ 20 } />
						</div>
						<div className={ styles.reviewBlockAuthor }>{ review.author }</div>
						<div className={ styles.reviewBlockData }>
							{ dayjs(review.date).format('MMMM DD, YYYY') }
						</div>
						{ review.images.length ? (
							<div className={ styles.reviewBlockImages }>
								{ review.images.map((imageURL, index) => {
									return (
										<Image 
											src={ imageURL }
											key={ index }
											alt='Railing Image'
											width={ 150 }
											height={ 150 }
										/>
									);
								})}
							</div>
						) : null }
					</div>
				);
			}) }
		</EmblaCarousel>
	);
};

export default ReviewSection;