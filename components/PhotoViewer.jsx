'use client'

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";

import styles from "public/styles/page/components.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle, faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

// @TODO - Update the photo viewer to show the index of the photo if the viewer is being used for gallery images
const PhotoViewer = ({ photos, currentIndex, preventAccessToOriginal, closeFunc }) => {

	const [photoIndex, setPhotoIndex] = useState(currentIndex);

	const overlayRef = useRef(null);
	const pictureContainerRef = useRef(null);

	const isCurrentlyShifting = () => {
		return (pictureContainerRef.current.classList.contains(styles.galleryPictureViewerShiftLeftIn) ||
			pictureContainerRef.current.classList.contains(styles.galleryPictureViewerShiftLeftOut) ||
			pictureContainerRef.current.classList.contains(styles.galleryPictureViewerShiftRightIn) ||
			pictureContainerRef.current.classList.contains(styles.galleryPictureViewerShiftRightOut));
	};

	const finishShifting = () => {
		pictureContainerRef.current.classList.remove(styles.galleryPictureViewerShiftLeftIn);
		pictureContainerRef.current.classList.remove(styles.galleryPictureViewerShiftLeftOut);
		pictureContainerRef.current.classList.remove(styles.galleryPictureViewerShiftRightIn);
		pictureContainerRef.current.classList.remove(styles.galleryPictureViewerShiftRightOut);
	};

	const changeCurrentPhoto = (event, newIndex) => {
		event.stopPropagation();

		// Note that the logic below is complicated in order to animate the viewer properly
		// Do not change the photo if we're in the middle of a shift
		if (isCurrentlyShifting()	=== false && newIndex >= 0 && newIndex < photos.length) {
			if (newIndex > photoIndex) {
				pictureContainerRef.current.classList.add(styles.galleryPictureViewerShiftLeftOut);
				window.setTimeout(() => {
					setPhotoIndex(newIndex);
					pictureContainerRef.current.classList.add(styles.galleryPictureViewerShiftLeftIn);
					window.setTimeout(finishShifting, 275);
				}, 275);
			} else {
				pictureContainerRef.current.classList.add(styles.galleryPictureViewerShiftRightOut);
				window.setTimeout(() => {
					setPhotoIndex(newIndex);
					pictureContainerRef.current.classList.add(styles.galleryPictureViewerShiftRightIn);
					window.setTimeout(finishShifting, 275);
				}, 275);
			}
		}
	};

	const closeViewer = () => {
		// Only close out the photo viewer if there's no animation currently taking place
		if (isCurrentlyShifting() === false && overlayRef.current.classList.contains(styles.galleryOverlayShow)) {
			overlayRef.current.classList.remove(styles.galleryOverlayShow);
			window.setTimeout(closeFunc, 500);
		}
	};

	const viewOriginalPhoto = (event, url) => {
		event.stopPropagation();
		if (preventAccessToOriginal !== true) {
			window.open(url, '_blank');
		}
	}

	const navigateWithKeyPresses = (event) => {
		if (event.keyCode === 37) {
			changeCurrentPhoto(event, photoIndex - 1);
		} else if (event.keyCode === 39) {
			changeCurrentPhoto(event, photoIndex + 1);
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', navigateWithKeyPresses);
		setTimeout(() => overlayRef.current.classList.add(styles.galleryOverlayShow), 100);

		return () => { 
			document.removeEventListener('keydown', navigateWithKeyPresses);
		}
	});

	return (
		<>
			<div className={ styles.galleryOverlay } onClick={ closeViewer } ref={ overlayRef }>
				<div className={ styles.galleryContainer }>

					<div className={ styles.galleryExitRow }>
						<FontAwesomeIcon
							icon={ faXmarkCircle }
							onClick={ closeViewer }
							className={ styles.galleryExitButton }
						/>
					</div>

					<div className={ styles.galleryPictureViewer } ref={ pictureContainerRef }>
						<Image
							className={ styles.galleryPicture }
							src={ photos[photoIndex].galleriaUrl || photos[photoIndex].originalUrl || photos[photoIndex].url }
							alt={ photos[photoIndex].alt || 'Railing' }
							fill={ true }
							onClick={(event) => { viewOriginalPhoto(event, photos[photoIndex].originalUrl || photos[photoIndex].url) }}
						/>
					</div>

					<div className={ styles.galleryControls }>
						<span className={ (photoIndex > 0) ? styles.galleryLeftButton : styles.galleryLeftButtonDisabled }>
							<FontAwesomeIcon
								icon={ faCircleArrowLeft }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex - 1 ) }}
							/>
						</span>
						<span className={ (photoIndex + 1 < photos.length) ? styles.galleryRightButton : styles.galleryRightButtonDisabled }>
							<FontAwesomeIcon
								icon={ faCircleArrowRight }
								onClick={ (event) => { changeCurrentPhoto(event, photoIndex + 1 ) }}
							/>
						</span>
					</div>

				</div>
			</div>
		</>
	);
};

export default PhotoViewer;