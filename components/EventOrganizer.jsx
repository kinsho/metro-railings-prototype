'use client'

import React, { useState, useEffect } from 'react';

import { subscribe, unsubscribe } from 'lib/utils';

import PhotoViewer from 'components/PhotoViewer';
import ConfirmModal from 'components/ConfirmModal';
import InfoModal from 'components/InfoModal';
import ContentModal from 'components/ContentModal';

const EventOrganizer = () => {

	const [photoViewerOpen, setPhotoViewerOpen] = useState(false);
	const [photos, setPhotos] = useState([]);
	const [openIndex, setOpenIndex] = useState(0);
	const [preventAccessToOriginal, setPreventAccessToOriginal] = useState(false);

	const [confirmModalOpen, setConfirmModalOpen] = useState(false);
	const [infoModalOpen, setInfoModalOpen] = useState(false);
	const [contentModalOpen, setContentModalOpen] = useState(false);
	const [modalText, setModalText] = useState('');
	const [modalBoldText, setModalBoldText] = useState('');
	const [modalImage, setModalImage] = useState(null);
	const [ContentJSX, setContentJSX] = useState(null);
	const [contentData, setContentData] = useState({});
	const [postModalFunc, setPostModalFunc] = useState(null);

	const openViewer = (event) => {
		setPhotoViewerOpen(true);
		setPhotos(event.detail.photos);
		setOpenIndex(event.detail.currentIndex);
		setPreventAccessToOriginal(event.detail.preventAccessToOriginal || false);
	}
	const closeViewer = () => {
		setPhotoViewerOpen(false);
		setPhotos([]);
		setOpenIndex(0);
		setPreventAccessToOriginal(false);
	}

	const openConfirmModal = (event) => {
		setConfirmModalOpen(true);
		openModal(event);
	}
	const openInfoModal = (event) => {
		setInfoModalOpen(true);
		openModal(event);
	}
	const openContentModal = (event) => {
		setContentModalOpen(true);
		openModal(event);
	}
	const openModal = (event) => {
		setModalText(event.detail.text);
		setModalBoldText(event.detail.boldText);
		setModalImage(event.detail.image);
		setContentJSX(event.detail.ContextJSX);
		setContentData(event.detail.contentData || {});
		setPostModalFunc(() => event.detail.confirmFunction);
	}
	const closeModal = () => {
		setConfirmModalOpen(false);
		setInfoModalOpen(false);
		setContentModalOpen(false);
		setModalText('');
		setModalBoldText('');
		setModalImage(null);
		setContentJSX(null);
		setContentData({});
		setPostModalFunc(null);
	}

	useEffect(() => {
		subscribe('open-photo-viewer', openViewer);
		subscribe('open-info-modal', openInfoModal);
		subscribe('open-confirm-modal', openConfirmModal);
		subscribe('open-content-modal', openContentModal);

		return () => {
			unsubscribe('open-photo-viewer', openViewer);
			unsubscribe('open-info-modal', openInfoModal);
			unsubscribe('open-confirm-modal', openConfirmModal);
			unsubscribe('open-content-modal', openContentModal);
		}
	});

	return (
		<>
			{ photoViewerOpen ? (
				<PhotoViewer photos={ photos } currentIndex={ openIndex } preventAccessToOriginal={ preventAccessToOriginal || false } closeFunc={ closeViewer } />
			) : null }

			{ confirmModalOpen ? (
				<ConfirmModal text={ modalText } boldText={ modalBoldText } image={ modalImage } confirmFunc={ postModalFunc } closeFunc={ closeModal } />
			) : null }

			{ infoModalOpen ? (
				<InfoModal text={ modalText } closeFunc={ closeModal } />
			) : null }

			{ contentModalOpen ? (
				<ContentModal ContentJSX={ ContentJSX } data={ contentData } confirmFunc={ postModalFunc } closeFunc={ closeModal } />
			) : null }
		</>
	);
};

export default EventOrganizer;