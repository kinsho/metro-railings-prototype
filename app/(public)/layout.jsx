import classNames from 'classnames';

import Header from 'components/public/Header';
import Footer from 'components/public/Footer';
import EventOrganizer from 'components/EventOrganizer';
import CustomToaster from 'components/CustomToaster';

import 'public/styles/foundation/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { RobotoMono, Poppins, Raleway, Comfortaa, AvenirLight, AvenirHeavy } from 'app/fonts';

export const metadata = {
	title: {
		template: 'Metro Railings | %s',
		default: 'Metro Railings'
	},
	description: 'Artisan railings for NJ, NY, and much more',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com'
	}
};

export default function RootPublicLayout({ children }) {

	return (
		<html lang='en' className={ classNames({
			[RobotoMono.variable]: true,
			[Poppins.variable]: true,
			[Raleway.variable]: true,
			[Comfortaa.variable]: true,
			[AvenirHeavy.variable]: true,
			[AvenirLight.variable]: true
		})}>
			<body>
				<Header />
				{ children }
				<Footer />

				<EventOrganizer />
				<CustomToaster />
			</body>
		</html>
	);
}