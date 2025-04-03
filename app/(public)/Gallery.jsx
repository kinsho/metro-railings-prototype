'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import { publish } from 'lib/utils';

import styles from 'public/styles/page/home.module.scss';

const GallerySection = ({ jsonImages }) => {

	const images = JSON.parse(jsonImages);
	const [shownImageCount, setShownImageCount] = useState(Math.min(images.length, 6));
	const galleryContainerRef = useRef(null);
	const imageRef = useRef(null);
	const imageContainerRef = useRef(null);

	const loadMoreImages = () => {
		// Only load more images when we have images that have yet to be shown
		if (shownImageCount < images.length) {
			setShownImageCount(Math.min(shownImageCount + 6, images.length));
		}
	}

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images.slice(0, shownImageCount) });
	};

	const setGallerySectionHeight = () => {
		if (imageRef?.current) {
			window.setTimeout(() => {
				const imagesPerRow = Math.floor(document.documentElement.clientWidth / (imageContainerRef.current.clientWidth - 1));
				galleryContainerRef.current.style.height = ((imageRef.current.clientHeight + 30) * Math.ceil(shownImageCount / imagesPerRow)) + 'px';
			}, 100);
		}
	}

	useEffect(() => {
		setGallerySectionHeight();

		// Keep this listener here in this useEffect function as it depends on a state value that can change at any moment
		window.screen.orientation.addEventListener('change', setGallerySectionHeight);

		return () => {
			window.screen.orientation.removeEventListener('change', setGallerySectionHeight);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shownImageCount]);

	return (
		<div className={ styles.gallerySection }>
			<div className={ styles.gallerySectionHeader }>GALLERY</div>
			<p className={ styles.sectionDescriptiveText }>
				We are proud of all our past work. Check out a sampling of the railings we craft with pride.
			</p>
			<div className={ styles.galleryImagesContainer } ref={ galleryContainerRef }>
				{ Array.from(Array(shownImageCount).keys()).map((value, i) => {
					return (
						<span className={ styles.galleryImageOuterSlot } key={ i } ref={ imageContainerRef }>
							<span className={ styles.galleryImageInnerSlot } onClick={ () => viewImage(i) } ref={ imageRef }>
								<Image
									src={ images[i].galleriaUrl }
									alt={ images[i].alt || 'Luxury railing' }
									fill={ true }
									sizes="(max-width: 768px) 50vw, 33vw"
								/>
								<span className={ styles.galleryImageIndex }>{ images[i].index }</span>
							</span>
						</span>
					);
				}) }
			</div>
			{ shownImageCount < images.length ? (
				<div className={ styles.expandGalleryLinkActive } onClick={ loadMoreImages }>- click here for more pictures -</div>
			) : (
				<div className={ styles.expandGalleryLink }>- no more pictures to load -</div>
			)}
		</div>
	);
};

export default GallerySection;