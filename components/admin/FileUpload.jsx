import React, { useState, useRef, useContext } from 'react';
import toast from 'react-hot-toast';

import { UserContext } from 'app/admin/userContext';

import { addFileToOrder, deleteFileFromOrder, fetchFilesByOrder } from 'actions/order';

import GalleryViewer from 'components/GalleryViewer';
import { toastValidationError } from 'components/CustomToaster';

import { acceptableMediaExtensions } from 'lib/dictionary';
import { serverActionCall } from 'lib/http/clientHttpRequester';
import { runValidators } from 'lib/validators/inputValidators';
import { publish } from 'lib/utils';

import styles from "public/styles/page/components.module.scss";

const FileUpload = ({ order, existingFiles, fileRefs, inSpanish }) => {

	existingFiles = existingFiles || [];
	const [media, setMedia] = useState(existingFiles.filter((file) => acceptableMediaExtensions[file.contentType]));
	const [nonMedia, setNonMedia] = useState(existingFiles.filter((file) => !(acceptableMediaExtensions[file.contentType])));
	const [fileIds, setFileIds] = useState(fileRefs || []);
	const user = useContext(UserContext);

	const uploadLink = useRef(null);
	const uploadForm = useRef(null);
	let isDeletingFile = false;

	// ---------- Validation functions for client-side error handling
	// @TODO - add in validation to prevent certain types of file from being uploaded. Also check file sizes

	// ---------- Client-side error tests
	// @TODO - add in client error-side tests once validation functions have been written
	const fileValidationFields = [];

	// Function to upload a new image
	const uploadFiles = async (event) => {
		event.preventDefault();

		const errors = runValidators(fileValidationFields);

		if (errors.length === 0) {
			try {
				const serverResponse = await serverActionCall(addFileToOrder, new FormData(uploadForm.current), {
					loading: 'Uploading the file...',
					success: 'The file\'s been uploaded.',
					error: 'Something went wrong when trying to upload this file. Try again or see Rickin for more details.'
				});

				if (serverResponse?.success) {
					const uploadedFile = serverResponse.file;

					if (acceptableMediaExtensions[uploadedFile.contentType]) {
						setMedia([...media, uploadedFile]);
					} else {
						setNonMedia([...nonMedia, uploadedFile]);
					}
				}
			} catch (err) {
				console.error(err);
			}
		} else {
			toastValidationError(errors);
		}
	};

	
	const loadAllFiles = async () => {
		try {
			const serverResponse = await serverActionCall(fetchFilesByOrder, { orderId: order._id }, {
				loading: 'Fetching all the files uploaded for order ' + order._id + '...',
				error: 'Something went awry when trying to retrieve all the files associated with order ' + order._id + '!'
			});

			if (serverResponse.success) {
				const recoveredFiles = JSON.parse(serverResponse.files);

				setFileIds([]);
				setMedia(recoveredFiles.filter((file) => acceptableMediaExtensions[file.contentType]));
				setNonMedia(recoveredFiles.filter((file) => !(acceptableMediaExtensions[file.contentType])));
			}
		} catch (error) {
			console.error(error);
			toast.error('Something odd happened with the server. Please try again.');
		}
	}

	// Function to delete a gallery image permanently
	const deleteFile = (file) => {
		if (isDeletingFile === false)
		{
			publish('open-confirm-modal', {
				text: 'Are you sure you want to delete the following file permanently?',
				boldText: file.name || 'Unnamed File',
				image: acceptableMediaExtensions[file.contentType] ? file.url : null,
				confirmFunction: () => deleteFileConfirm(file)
			});
		}
	};

	const deleteFileConfirm = async (fileToDelete) => {
		isDeletingFile = true;

		const serverResponse = await serverActionCall(deleteFileFromOrder, {
			orderId: fileToDelete.orderId,
			fileId: fileToDelete._id,
			fileUrl: fileToDelete.url
		}, {
			loading: 'Deleting the file...',
			success: 'The file\'s been deleted.',
			error: 'Something went wrong when trying to delete this file. See Rickin for more details.'
		});

		// After the file is deleted successfully from the server, update our local copy of the data as well to reflect the deletion
		if (serverResponse?.success)
		{
			if (acceptableMediaExtensions[fileToDelete.contentType])
			{
				setMedia(media.filter((file) => (file._id !== fileToDelete._id)));
			} else
			{
				setNonMedia(nonMedia.filter((file) => (file._id !== fileToDelete._id)));
			}
		}
		isDeletingFile = false;
	}

	return (
		<>
			{ user?.permissions?.uploadFile ? (
				<>
					<div className={ styles.fileUploadSection }>
						<button className={ styles.uploadFileButton } onClick={ () => uploadLink.current.click() }>Upload Media/File</button>
						<form ref={ uploadForm } action={ addFileToOrder }>
							<input
								type='file'
								ref={ uploadLink }
								name='newFile'
								className={ styles.uploadFileInput }
								multiple
								accept='.pdf,.jpeg,.jpg,.mp4,.png'
								onChange={ uploadFiles }
							/>
							<input type='hidden' name='orderId' value={ order._id }/>
						</form>
					</div>
				</>
			) : null }

			<div className={ styles.filesListing }>

				{ media.length ? (
					<div className={ styles.filesContainer }>
						<div className={ styles.filesContainerHeader }>
							{ inSpanish ? 'Fotos' : 'Pictures' }
						</div>
						<GalleryViewer
							files={ media }
							imgWidth={ 150 }
							imgHeight={ 150 }
							deleteFunc={ user?.permissions?.deleteFile ? deleteFile : null }
							orderId={ order._id }
						/>
					</div>
				) : null }

				{ nonMedia.length ? (
					<div className={ styles.filesContainer }>
						<div className={ styles.filesContainerHeader }>
							{ inSpanish ? 'Dibujos' : 'Drawings / Other Files' }
						</div>
						<GalleryViewer
							files={ nonMedia }
							imgWidth={ 150 }
							imgHeight={ 150 }
							deleteFunc={ user?.permissions?.deleteFile ? deleteFile : null }
							orderId={ order._id }
						/>
					</div>
				) : null }

				{ fileIds.length ? (
					<span className={ styles.filesLazyLoadLink } onClick={ () => loadAllFiles() }>
						{ inSpanish ? "Cargar Todos Los Archivos..." : "Load All Files..." }
					</span>
				) : null }

			</div>
		</>
	);
};


export default FileUpload;