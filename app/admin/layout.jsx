import classNames from 'classnames';

import { RobotoMono, Poppins, Raleway, Comfortaa, AvenirLight, AvenirHeavy } from 'app/fonts';

import 'public/styles/foundation/global.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@fortawesome/fontawesome-svg-core/styles.css';

import ContextLoader from 'app/admin/ContextLoader';

// @TODO - Beautify the admin system on mobile sometime in the far future
export const viewport = {
	width: '1202',
	initialScale: '0.1'
};

export const metadata = {
	title: {
		default: 'Metro Railings Admin Platform'
	},
	description: 'Administration platform for Metro Railings',
	robots: {
		index: false,
		follow: false
	}
};

export default function RootAdminLayout({ children }) {

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
				<ContextLoader>
					{ children }
				</ContextLoader>
			</body>
		</html>
	);
}