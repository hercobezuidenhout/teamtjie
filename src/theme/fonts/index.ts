import localFont from 'next/font/local';

const roboto = localFont({
  src: [
    {
      path: './Roboto-Bold.ttf',
      weight: '400',
      style: 'bold',
    },
  ],
  fallback: ['Roboto'],
});

export const fonts = {
  heading: roboto.style.fontFamily,
};
