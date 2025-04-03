'use client'

import { } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from "public/styles/page/headerFooter.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {

	const pathname = usePathname();

	if (pathname !== '/login') {
		return (
			<footer className={ styles.footerPublic }>

			<span className={ styles.footerContactNumber }>
				<FontAwesomeIcon icon={ faPhone } />
				{ process.env.NEXT_PUBLIC_HOTLINE_NUMBER }
			</span>

				<Link href='/contact-us' className={ styles.footerMobileContactUs} passHref>
					<FontAwesomeIcon icon={ faEnvelope } />
					Write Us
				</Link>

				<span className={ styles.footerCopyright }>
				<FontAwesomeIcon icon={ faCopyright } />
					{ new Date().getFullYear() }
			</span>

				<Link href={ "tel:" + process.env.NEXT_PUBLIC_HOTLINE_NUMBER } className={ styles.footerMobileCallUs } passHref>
					<FontAwesomeIcon icon={ faPhone } />
					Call Us
				</Link>

			</footer>
		);
	} else {
		return (<></>);
	}
}