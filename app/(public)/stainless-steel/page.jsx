import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Image from 'next/image';

import { getGalleryImages } from 'lib/http/galleryDAO';

import Galleria from 'components/Galleria';

import styles from 'public/styles/page/productPage.module.scss';
import stainlessSteelBanner from 'assets/images/products/stainless-steel/railing-1.jpeg';
import cableRailing1 from 'assets/images/products/stainless-steel/cable-railing-1.jpeg';
import cableRailing2 from 'assets/images/products/stainless-steel/cable-railing-2.jpeg';
import glassRailing1 from 'assets/images/products/stainless-steel/glass-railing-1.jpeg';
import glassRailing2 from 'assets/images/products/stainless-steel/glass-railing-2.jpeg';

export const metadata = {
	title: 'Stainless Steel Railings',
	description: 'A brief summary of the stainless steel railings and products we offer',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com/stainless-steel'
	}
};

const StainlessSteelProductServer = async () => {

	const textDir = resolve('./', 'assets/text/stainlessSteel');
	const introText = readFileSync( textDir + '/intro.txt', { encoding: 'utf-8' });
	const customizationText = readFileSync(textDir + '/customization.txt', { encoding: 'utf-8' });
	const materialText = readFileSync(textDir + '/material.txt', { encoding: 'utf-8' });

	const galleryPhotos = await getGalleryImages('stainless');

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.productBanner }>
				<Image
					src={ stainlessSteelBanner }
					alt='Stainless steel railing signature'
					fill={ true }
					sizes='100vw'
					className={ styles.productBannerImage }
				/>
				<h1 className={ styles.productBannerName }>Stainless Steel Railings</h1>
			</div>

			<div className={ styles.productBlock }>
				<p className={ styles.productBlockTextAlignRight }>{ introText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ cableRailing2 }
						alt='Stainless steel cable railing'
						fill={ true }
						sizes='(max-width: 768px) 75vw, 50vw'
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ glassRailing2 }
						alt='Stainless steel glass railing'
						fill={ true }
						sizes='(max-width: 768px) 75vw, 50vw'
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockTextAlignLeft }>{ materialText }</p>
			</div>

			<div className={ styles.productBlock }>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ cableRailing1 }
						alt='Stainless steel cable railing'
						fill={ true }
						sizes='(max-width: 768px) 75vw, 50vw'
						className={ styles.productBlockImage }
					/>
				</span>
				<p className={ styles.productBlockText }>{ customizationText }</p>
				<span className={ styles.productBlockImageContainer }>
					<Image
						src={ glassRailing1 }
						alt='Stainless steel glass railing'
						fill={ true }
						sizes='(max-width: 768px) 75vw, 50vw'
						className={ styles.productBlockImage }
					/>
				</span>
			</div>

			<div className={ styles.galleriaTitle }>Stainless Steel Rails Gallery</div>
			<Galleria jsonImages={ JSON.stringify(galleryPhotos) } isPublic={ true }/>
		</div>
	);
};

export default StainlessSteelProductServer;