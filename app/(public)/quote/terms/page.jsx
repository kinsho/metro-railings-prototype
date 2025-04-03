import { readFileSync } from 'node:fs';
import Markdown from 'react-markdown';

import styles from 'public/styles/page/terms.module.scss';

const TermsServer = ({ searchParams }) => {
	const fileHandle = searchParams?.fileHandle || '';

	// Pull the 'Terms and Conditions' from the file system
	const termsRawText = fileHandle.startsWith('assets/text/terms') ?
		readFileSync(process.cwd() + '/' + fileHandle, { encoding: 'utf-8' }) :
		readFileSync(process.cwd() + '/' + process.env.CURRENT_TERMS_AND_CONDITIONS_CONTRACT);

	return (
		<div className={ styles.termsAndConditions }>
			<Markdown>{ termsRawText + '' }</Markdown>
		</div>
	);
};

export default TermsServer;