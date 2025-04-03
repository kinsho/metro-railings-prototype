import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Image from 'next/image';

import { getGalleryImages } from 'lib/http/galleryDAO';

import Galleria from 'components/Galleria';

import styles from 'public/styles/page/productPage.module.scss';
import cableBanner from 'assets/images/products/cable/cable-banner.jpg';
import blackenedCable from 'assets/images/products/cable/blackened-cable.jpg';
import cableCoil2 from 'assets/images/products/cable/cable-coil-2.jpeg';
import cableFixtures1 from 'assets/images/products/cable/cable-railing-fixtures-1.jpg';
import cableFixtures2 from 'assets/images/products/cable/cable-railing-fixtures-2.png';
import altCableRailing from 'assets/images/products/cable/ss-cable-railing-neck-wood.jpeg';
import deckRailing from 'assets/images/products/cable/deck-cable-railing.jpg';
import poolRailing from 'assets/images/products/cable/pool-cable-railing.jpg';

export const metadata = {
	title: 'Cable Railings',
	description: 'A brief summary of the cable railings we offer',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com/cable'
	}
};

const CableProductServer = async () => {

	const textDir = resolve('./', 'assets/text/cable');
	const introText = readFileSync(textDir + '/intro.txt', { encoding: 'utf-8' });
	const colorText = readFileSync(textDir + '/color.txt', { encoding: 'utf-8' });
	const customizationText = readFileSync(textDir + '/customization.txt', { encoding: 'utf-8' });
	const cableDetailText = readFileSync(textDir + '/cable.txt', { encoding: 'utf-8' });

	const galleryPhotos = await getGalleryImages('cable');

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.productBanner }>
				<Image
					src={ cableBanner }
					alt='Black cable railing signature'
					fill={ true }
					sizes="100vw"
					className={ styles.productBannerImage }
				/>
				<h1 className={ styles.productBannerName }>Cable Railings</h1>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ poolRailing }
						alt='Cable railing poolside'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockText }>{ introText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ deckRailing }
						alt='Cable railing poolside'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ cableDetailText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ cableCoil2 }
						alt='Stainless steel cable'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ cableFixtures1 }
						alt='Stainless steel cable fixture'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ cableFixtures2 }
						alt='Stainless steel cable fixture'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ altCableRailing }
						alt='Wire railing with wood top rail'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockTextAlignLeft }>{ customizationText }</p>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ colorText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ blackenedCable }
						alt='Black cable railing'
						fill={ true }
						sizes="(max-width: 768px) 75vw, 33vw"
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.galleriaTitle }>Cable Gallery</div>
			<Galleria jsonImages={ JSON.stringify(galleryPhotos) } isPublic={ true } />

		</div>
	);
}

export default CableProductServer;