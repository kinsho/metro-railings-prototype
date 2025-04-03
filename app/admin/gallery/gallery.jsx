'use client'

import React, { useState } from 'react';
import Image from 'next/image';

import AddForm from 'app/admin/gallery/addForm';

import { deleteGalleryImage, updateGalleryMetadata } from 'actions/gallery';

import { publish } from 'lib/utils';
import { serverActionCall } from 'lib/http/clientHttpRequester';

import styles from 'public/styles/page/gallery.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Gallery = ({ jsonImages }) => {

	const [images, setImages] = useState(JSON.parse(jsonImages));
	const [isDeletingPicture, setIsDeletingPicture] = useState(false);

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: images });
	};

	const addNewlyRegisteredImage = (newImage) => {
		setImages([...images, newImage]);
	}

	// Function to delete a gallery image permanently
	const deleteImage = (photo) => {
		if (isDeletingPicture === false) {
			publish('open-confirm-modal', {
				text: 'Are you sure you want to delete the following image from the gallery permanently?',
				image: photo.galleriaUrl,
				confirmFunction: () => deleteImageConfirm(photo)
			});
		}
	};

	const deleteImageConfirm = async (photo) => {
		setIsDeletingPicture(true);
		const serverResponse = await serverActionCall(deleteGalleryImage, {
			index: photo.index,
			name: photo.name,
			originalUrl: photo.originalUrl,
			galleriaUrl: photo.galleriaUrl
		}, {
			loading: 'Deleting an image...',
			success: 'An image has been successfully deleted.',
			error: 'The image couldn\'t be properly deleted. Try it again.'
		});

		setIsDeletingPicture(false);
		
		if (serverResponse.success) {
			// Rather than relying on the database to update the indexing on the gallery photos, just reindex the gallery on the client side
			let updatedImages = images.filter((image) => image.index !== photo.index);
			for (let i = photo.index - 1; i < updatedImages.length; i += 1) {
				updatedImages[i].index -= 1;
			}

			setImages(updatedImages);
		}
	}

	const updateImageData = async (event, image, index) => {
		let newImages = [...images];
		newImages[index][event.currentTarget.name] = event.currentTarget.value;
		setImages(newImages);

		await serverActionCall(updateGalleryMetadata, newImages[index], {
			loading: 'Saving changes...',
			success: 'All recently modified image metadata has been successfully updated.',
			error: 'Changes couldn\'t be saved. Reload the page and try again.'
		}, 2500);
	}

	return (
		<>
			<div className={ styles.galleryPictures }>
				{ images.map((photo, index) => {
					return (
						<div className={ styles.imageCard } key={ index }>
							<div className={ styles.imageContainer }>
								<Image
									src={ photo.galleriaUrl }
									alt={ photo.alt || 'Railing' }
									fill={ true }
									sizes='15vw'
									onClick={ () => viewImage(index) }
								/>
								<FontAwesomeIcon
									icon={ faCircleXmark }
									className={ styles.photoDeleteIcon }
									onClick={ () => deleteImage(photo) }
								/>
								<span className={ styles.photoIndex }>{ photo.index }</span>
							</div>
							<div className={ styles.imageDataForm }>
								<div className={ styles.imageDataRow }>
									<label className={ styles.imageDataLabel }>Description</label>
									<input
										type='text'
										name='alt'
										value={ photo.alt }
										className={ styles.imageDataField }
										onChange={ (event) => updateImageData(event, photo, index) }
									/>
								</div>
								<div className={ styles.imageDataRow }>
									<label className={ styles.imageDataLabel }>Category</label>
									<select
										className={ styles.imageDataField }
										value={ photo.category }
										name='category'
										onChange={ (event) => updateImageData(event, photo, index) }
									>
										<option value='' disabled>Select a category</option>
										<option value='cable'>Cable Railing</option>
										<option value='glass'>Glass Railing</option>
										<option value='aluminum'>Aluminum Railing</option>
										<option value='stainless'>Stainless Steel</option>
										<option value='other'>Other</option>
									</select>
								</div>
							</div>
						</div>
					);
				}) }
			</div>

			<AddForm addToGalleryFunc={ addNewlyRegisteredImage } />
		</>
	);
}

export default Gallery;