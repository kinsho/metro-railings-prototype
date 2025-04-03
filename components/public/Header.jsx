'use client'

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from "public/styles/page/headerFooter.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import logo from "assets/images/logos/color_logo_transparent_background_small.png";

export default function Header() {

	const mobileMenuRef = useRef(null);

	const toggleMobileMenu = (event) => {
		event.stopPropagation();

		mobileMenuRef.current.style.height = mobileMenuRef.current.style.height || '0px';
		if (window.parseInt(mobileMenuRef.current.style.height, 10)) {
			mobileMenuRef.current.style.height = '0px';
		} else {
			mobileMenuRef.current.style.height = mobileMenuRef.current.scrollHeight + 'px';
		}
	};

	const closeMobileMenu = () => {
		mobileMenuRef.current.style.height = '0px';
	}

	return (
		<>
			<header className={ styles.topMenu } onClick={ closeMobileMenu }>

				<span className={ styles.topMenuLogoContainer }>
					<Image
						src={ logo }
						alt="Logo"
						fill={ true }
						sizes="25vw"
					/>
				</span>

				<span className={ styles.desktopMenuLinks }>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/contact-us' className={ styles.topMenuLink }>CONTACT US</Link>
					</span>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/gallery' prefetch={ true } className={ styles.topMenuLink }>GALLERY</Link>
					</span>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/aluminum' prefetch={ true } className={ styles.topMenuLink }>ALUMINUM HANDRAILS</Link>
					</span>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/cable' prefetch={ true } className={ styles.topMenuLink }>CABLE HANDRAILS</Link>
					</span>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/glass' prefetch={ true } className={ styles.topMenuLink }>GLASS HANDRAILS</Link>
					</span>
					<span className={ styles.desktopMenuLinkSlot }>
						<Link href='/stainless-steel' prefetch={ true } className={ styles.topMenuLink }>STAINLESS STEEL HANDRAILS</Link>
					</span>
				</span>

				<span className={ styles.mobileMenuExpander } onClick={ toggleMobileMenu }>
					<FontAwesomeIcon icon={ faBars }/> MENU
				</span>

				<div className={ styles.mobileMenuLinks } ref={ mobileMenuRef }>
					<div className={ styles.mobileMenuLinkSlot }>
						<Link href='/contact-us' className={ styles.topMenuLink }>CONTACT US</Link>
					</div>
					<div className={ styles.mobileMenuLinkSlot }>
						<Link href='/gallery' prefetch={ true } className={ styles.topMenuLink }>GALLERY</Link>
					</div>
					<div className={ styles.mobileMenuLinkSlot }>
						<Link href='/aluminum' prefetch={ true } className={ styles.topMenuLink }>ALUMINUM HANDRAILS</Link>
					</div>
					<div className={ styles.mobileMenuLinkSlot }>
						<Link href='/cable' prefetch={ true } className={ styles.topMenuLink }>CABLE HANDRAILS</Link>
					</div>
					<div className={ styles.mobileMenuLinkSlot }>
						<Link href='/glass' prefetch={ true } className={ styles.topMenuLink }>GLASS HANDRAILS</Link>
					</div>
					<span className={ styles.mobileMenuLinkSlot }>
						<Link href='/stainless-steel' prefetch={ true } className={ styles.topMenuLink }>STAINLESS STEEL HANDRAILS</Link>
					</span>
				</div>
			</header>

			<div className={ styles.topMenuSpace }></div>
		</>
	);
}