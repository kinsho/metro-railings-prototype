import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Image from 'next/image';

import { getGalleryImages } from 'lib/http/galleryDAO';

import Galleria from 'components/Galleria';

import styles from 'public/styles/page/productPage.module.scss';
import glassBanner from 'assets/images/products/glass/glass-banner.jpeg';
import framedGlass1 from 'assets/images/products/glass/framed-glass-1.jpeg';
import framedGlass2 from 'assets/images/products/glass/framed-glass-2.jpg';
import channelGlass1 from 'assets/images/products/glass/channel-glass-1.jpg';
import channelGlass2 from 'assets/images/products/glass/channel-glass-2.jpg';
import postGlass1 from 'assets/images/products/glass/post-glass-1.jpeg';
import postGlass2 from 'assets/images/products/glass/post-glass-2.jpeg';
import talonGlass1 from 'assets/images/products/glass/talon-glass-1.jpeg';
import fasciaGlass1 from 'assets/images/products/glass/fascia-glass-1.jpeg';
import glassPanel from 'assets/images/products/glass/glass-panel-1.jpeg';

export const metadata = {
	title: 'Glass Railings',
	description: 'A brief summary of the glass railings and products we offer',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com/glass'
	}
};

const GlassProductServer = async () => {

	const textDir = resolve('./', 'assets/text/glass');
	const introText = readFileSync(textDir + '/intro.txt', { encoding: 'utf-8' });
	const stylesText = readFileSync(textDir + '/styles.txt', { encoding: 'utf-8' });
	const channelRailingText = readFileSync(textDir + '/channelRailings.txt', { encoding: 'utf-8' });
	const fasciaRailingText = readFileSync(textDir + '/fasciaRailings.txt', { encoding: 'utf-8' });
	const framedRailingText = readFileSync(textDir + '/framedRailings.txt', { encoding: 'utf-8' });
	const postRailingText = readFileSync(textDir + '/postRailings.txt', { encoding: 'utf-8' });
	const talonRailingText = readFileSync(textDir + '/talonRailings.txt', { encoding: 'utf-8' });

	const galleryPhotos = await getGalleryImages('glass');

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.productBanner }>
				<Image
					src={ glassBanner }
					alt='Glass railing signature'
					fill={ true }
					sizes='100vw'
					className={ styles.productBannerImage }
				/>
				<h1 className={ styles.productBannerName }>Glass Railings</h1>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ introText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ glassPanel }
						alt='Custom glass panel railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ framedGlass2 }
						alt='Framed glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockTextAlignLeft }>{ stylesText }</p>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ framedRailingText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ framedGlass1 }
						alt='Framed glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ channelGlass1 }
						alt='Interior channel glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockText }>{ channelRailingText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ channelGlass2 }
						alt='Interior channel glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ talonGlass1 }
						alt='Talon glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockTextAlignLeft }>{ talonRailingText }</p>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ postGlass1 }
						alt='Post-mounted glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockText }>{ postRailingText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ postGlass2 }
						alt='Post-mounted glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ fasciaRailingText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ fasciaGlass1 }
						alt='Fascia glass railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.galleriaTitle }>Glass Gallery</div>
			<Galleria jsonImages={ JSON.stringify(galleryPhotos) } isPublic={ true }/>
		</div>
	);
};

export default GlassProductServer;