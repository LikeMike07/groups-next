import { Poppins, Space_Mono, JetBrains_Mono } from 'next/font/google';

const poppins = Poppins({
    weight: ['400', '800'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-poppins',
});

const spaceMano = Space_Mono({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-space-mono',
});

const jetMono = JetBrains_Mono({
    weight: ['400'],
    style: 'normal',
    subsets: ['latin'],
    variable: '--font-jet-mono',
});

export { poppins, spaceMano, jetMono };
