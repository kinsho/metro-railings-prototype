import ContactUsForm from 'app/(public)/contact-us/form';

import styles from 'public/styles/page/contactUs.module.scss';

export const metadata = {
	title: 'Contact Us',
	description: 'Reach out to us here',
	robots: {
		index: true,
		follow: true
	},
	alternates: {
		canonical: 'https://www.metrorailings.com/contact-us'
	}
};

const ContactUsServer = () => {
	return (
		<>
			<h1 className={ styles.pageHeader }>CONTACT US</h1>
			<ContactUsForm />
		</>
	);
};

export default ContactUsServer;