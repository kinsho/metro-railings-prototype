'use client'

import React, { } from 'react';
import Image from 'next/image';

import styles from 'public/styles/page/components.module.scss';

import { publish } from 'lib/utils';

const Galleria = ({ jsonImages, isPublic }) => {

	const images = JSON.parse(jsonImages);

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images, preventAccessToOriginal: isPublic });
	};

	return (
		<div className={ styles.galleriaContainer }>
			{ images.map((value, index) => {
				return (
					<span className={ styles.galleriaImageOuterSlot } key={ index }>
						<span className={ styles.galleriaImageInnerSlot } onClick={ () => viewImage(index) }>
							<Image
								src={ images[index].galleriaUrl }
								alt={ images[index].alt || 'Luxury railing' }
								fill={ true }
								sizes="(max-width: 768px) 50vw, 33vw"
							/>
							<span className={ styles.galleriaPhotoIndex }>{ images[index].index }</span>
						</span>
					</span>
				);
			}) }
		</div>
	);
};

export default Galleria;