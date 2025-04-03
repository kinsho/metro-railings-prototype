import React, { } from 'react';
import Image from 'next/image';

import styles from 'public/styles/page/components.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import pdfFileThumbnail from 'assets/images/miscellany/pdf-thumbnail.png';
import genericFileThumbnail from 'assets/images/miscellany/file-thumbnail.png';

import { publish } from 'lib/utils';
import { acceptableMediaExtensions } from 'lib/dictionary';

const GalleryViewer = ({ files, orderId, imgWidth, imgHeight, deleteFunc }) => {

	// Function to open the image and any other images it's associated with in a whole-page gallery viewer
	const viewImage = (index) => {
		publish('open-photo-viewer', { currentIndex: index, photos: files });
	};

	// Function used to download non-media files
	const downloadFile = (url) => {
		window.open(url, '_blank');
	};

	return (
		<div className={ styles.fileCarousel }>
			{ files.map((file, index) => {
				return (
					<div key={ orderId + '-file-' + file._id }>
						{ acceptableMediaExtensions[file.contentType] ? (
							<div className={ styles.fileThumbnailContainer }>
								<Image
									src={ file.url }
									width={ imgWidth }
									height={ imgHeight }
									alt={ file.pathname }
									index={ index }
									onClick={ () => viewImage(index) }
								/>
								<div className={ styles.thumbnailTitleBar }>{ file.name || file.pathname }</div>
								{ deleteFunc ? (
									<FontAwesomeIcon icon={ faCircleXmark } className={ styles.fileDeleteIcon } onClick={ () => deleteFunc(file) } />
								) : null }
							</div>
						) : (
							<div className={ styles.fileThumbnailContainer }>
								{ file.pathname.split('.').pop().toLowerCase() === 'pdf' ? (
									<Image
										src={ pdfFileThumbnail }
										alt={ file.name }
										width={ imgWidth }
										height={ imgHeight }
										onClick={() => downloadFile(file.url, file.pathname)}
									/>
								) : (
									<Image
										src={ genericFileThumbnail }
										alt={ file.name }
										width={ imgWidth }
										height={ imgHeight }
										onClick={() => downloadFile(file.url, file.pathname)}
									/>
								)}
								<div className={ styles.thumbnailTitleBar }>{ file.name || file.pathname }</div>
								{ deleteFunc ? (
									<FontAwesomeIcon icon={ faCircleXmark } className={ styles.fileDeleteIcon } onClick={ () => deleteFunc(file) } />
								) : null }
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default GalleryViewer;