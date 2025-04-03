import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import React, { Suspense } from 'react';
import { list } from '@vercel/blob'
import Image from 'next/image';
import Link from 'next/link';

import StatsSection from 'app/(public)/Stats';
import GallerySection from 'app/(public)/Gallery';
import ReviewsServer from 'app/(public)/ReviewsServer';
import ReviewSkeleton from 'app/(public)/ReviewSkeleton';
import VideoComponent from 'components/public/VideoComponent';

import { textToParagraphs } from 'lib/utils';
import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/home.module.scss';
import mLogo from 'assets/images/logos/m-logo.png';
import sassLogo from 'assets/images/logos/sass.svg';
import reactLogo from 'assets/images/logos/react.png';
import mongoDbLogo from 'assets/images/logos/mongodb.svg';
import nextJsLogo from 'assets/images/logos/nextJS.png';
import products from 'assets/text/products.js';

const HomeServer = async () => {

	// Grab the video to show on the home page
	const { blobs } = await list({
		token: process.env.BLOB_READ_WRITE_TOKEN,
		prefix: 'montage.webm',
		limit: 1
	});

	// Grab the 'About Me' text as well
	const textDir = resolve('./', 'assets/text');
	const aboutMeText = readFileSync(textDir + '/aboutUs.txt', { encoding: 'utf-8' });
	const aboutMeParagraphs = textToParagraphs(aboutMeText);

	// Grab the initial pictures to show on the gallery section
	const galleryImages = await getGalleryImages();

	return (
		<>
			{ /* BANNER VIDEO */ }
			<div className={ styles.homeVideoContainer }>
				<div className={ styles.companyName }>
					<span className={ styles.mLogoContainer }>
						<Image
							src={ mLogo }
							alt='M'
							fill={ true }
							sizes='(max-width: 768px) 80px, (max-width: 1200px) 96px, 128px'
						/>
					</span>
					<h1>ETRO RAILINGS</h1>
				</div>
				<Suspense fallback={ <p></p> }>
					<VideoComponent videos={ blobs }/>
				</Suspense>
			</div>

			{ /* PRODUCTS */ }
			<div className={ styles.productsSection }>
				<div className={ styles.productsSectionHeader }>WHAT WE DO</div>
				<div className={ styles.productBoxListing }>
					{ products.map((product, index) => {
						return (
							<span key={ index } className={ styles.productBox }>
							<div className={ styles.productBoxTitle }>{ product.name }</div>
							<Image
								src={ product.picture.src }
								alt={ product.pictureAlt }
								className={ styles.productBoxImage }
								width={ 250 }
								height={ 250 }
							/>
							<p className={ styles.productBoxText }>{ product.text }</p>
							<Link href={ product.link } className={ styles.productBoxLearningLink }>Show Me More</Link>
						</span>
						);
					}) }
				</div>
			</div>

			{ /* ABOUT US */ }
			<div className={ styles.aboutUsSection }>
				<div className={ styles.aboutUsSectionHeader }>ABOUT US</div>
				<div className={ styles.aboutUsText }>
					{ aboutMeParagraphs.map((paragraph, index) => {
						return (
							<p key={ index } className={ styles.aboutUsParagraph }>{ paragraph }</p>
						);
					}) }
				</div>
			</div>

			{ /* STATS */ }
			<StatsSection/>

			{ /* GALLERY */ }
			<GallerySection jsonImages={ JSON.stringify(galleryImages) }/>

			{ /* REVIEWS */ }
			<div className={ styles.reviewSection }>
				<div className={ styles.reviewSectionHeader }>CLIENT TESTIMONIALS</div>
				<Suspense fallback={ <ReviewSkeleton/> }>
					<ReviewsServer/>
				</Suspense>
			</div>

			{ /* SPECIAL THANKS */ }
			<div className={ styles.specialThanksSection }>
				<div className={ styles.specialThanksSectionHeader }>SPECIAL THANKS</div>
				<p className={ styles.specialThanksText }>Special thanks to the following technologies and libraries for helping us build this wonderful site.</p>
				<div className={ styles.specialThanksLogoContainer }>
					<Image src={ nextJsLogo } alt='Next JS' width={ 128 } height={ 64 } className={ styles.specialThanksLogo } />
					<Image src={ mongoDbLogo } alt='MongoDB' width={ 128 } height={ 64 } className={ styles.specialThanksLogo } />
					<Image src={ reactLogo } alt='React' width={ 64 } height={ 64 } className={ styles.specialThanksLogo } />
					<Image src={ sassLogo } alt='Sass' width={ 96 } height={ 64 } className={ styles.specialThanksLogo } />
				</div>
			</div>

		</>
	);
};

export default HomeServer;