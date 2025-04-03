import {
  Roboto_Mono,
  Poppins as _poppins,
  Raleway as _raleway,
  Comfortaa as _comfortaa
} from 'next/font/google';
import localFont from 'next/font/local';

export const RobotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-roboto-mono'
});

export const Poppins = _poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-poppins'
});

export const Raleway = _raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-raleway'
});

export const Comfortaa = _comfortaa({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-comfortaa'
});

export const AvenirLight = localFont({
  src: '../public/styles/foundation/fonts/Avenir-Light.ttf',
  display: 'swap',
  variable: '--font-avenir-light'
});

export const AvenirHeavy = localFont({
  src: '../public/styles/foundation/fonts/Avenir-Bold.ttf',
  display: 'swap',
  variable: '--font-avenir-heavy'
});