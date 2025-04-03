import Gallery from 'app/admin/gallery/gallery';

import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/gallery.module.scss';

const GalleryServer = async () => {

	const galleryImages = await getGalleryImages();

	return (
		<>
			<div className={ styles.pageHeader }>GALLERY MANAGEMENT</div>
			<Gallery jsonImages={ JSON.stringify(galleryImages) } />
		</>
	);
};

export default GalleryServer;