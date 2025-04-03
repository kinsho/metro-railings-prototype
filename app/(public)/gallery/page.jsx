import Galleria from 'components/Galleria';

import { getGalleryImages } from 'lib/http/galleryDAO';

import styles from 'public/styles/page/gallery.module.scss';

export const metadata = {
	title: 'Gallery',
	description: 'Portfolio of some of our loveliest railing work',
	robots: {
		index: true,
		follow: true,
		nocache: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com/gallery'
	}
};

const PublicGalleryServer = async () => {
	const galleryImages = await getGalleryImages();

	return (
		<>
			<h1 className={ styles.pageHeader }>WORK PORTFOLIO</h1>
			<Galleria jsonImages={ JSON.stringify(galleryImages) } isPublic={ true } />
			<div className={ styles.publicGalleryFooterOffset } />
		</>
	);
};

export default PublicGalleryServer;