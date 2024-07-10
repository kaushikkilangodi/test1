/* Colors adapted from https://tailwindcss.com/docs/customizing-colors */
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
:root {
  &,&.light-mode {
  
  /* Grey */
  --color-grey-10: #f2f1f6;
  --color-grey-50: #e6e5ed;
  --color-grey-100: #d9d8e4;
  --color-grey-200: #c0bfd5;
  --color-grey-300: #9c9ab9;
  --color-grey-400: #7a799e;
  --color-grey-500: #615f87;
  --color-grey-600: #4a495f;
  --color-grey-700: #38384a;
  --color-grey-800: #272733;
  --color-grey-900: #16161d;

  --color-blue-100: #e0f2fe;
  --color-green-100: #dcfce7;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;

  /* custom */
 --color-primary-50: #E0F7FA;
  --color-primary-100: #B2EBF2;
  --color-primary-200: #80DEEA;
  --color-primary-300: #4DD0E1;
  --color-primary-400: #26C6DA;
  --color-primary-500: #00BCD4;

  --color-outline-focus: #E0F7FA;











    
  --backdrop-color: rgba(211, 149, 149, 0.15);

  --shadow-round: 0 0 1.5rem .6rem rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 0.6rem 1.5rem rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);

  --image-grayscale: 0;
  --image-opacity: 100%;
  }

  /* Brand colors */
   /* Indigo */
  --color-brand-10: #f2f1f6; /* Almost White Indigo */
  --color-brand-50: #ff989a; /* Almost White Pink */
  --color-brand-100: #ff9094; /* Very Light Pink */
  --color-brand-200: #ff7a8f; /* Even Lighter Pink */
  --color-brand-500: #ff6389; /* Lighter Pink */
  --color-brand-600: #ff4c84; /* Your Preferred Pink */
  --color-brand-700: #3C2F55; /* Dark Purple */
  --color-brand-800: #2C1F40; /* Darker Purple */
  --color-brand-900: #201535; /* Even Darker Purple */

  --color-red-100: #FFECEC;  /* Lighter Red */
  --color-red-700: #E60000;  /* Medium Red */
  --color-red-800: #B30000;  /* Darker Red */

  --color-green-100: #E6FFF2;  /* Very Light Green */
  --color-green-700: #00DF7B;  /* Bright Green */
  --color-green-800: #008F60;  /* Darker Green */

  --color-blue-100: #E6E6FF;  /* Very Light Blue */
  --color-blue-700: #7B7BDF;  /* Medium Blue */
  --color-blue-800: #5252B0;  /* Darker Blue */

  --border-radius-tiny: 5px;
  --border-radius-sm: 7px;
  --border-radius-md: 10px;
  --border-radius-lg: 15px;
  --border-radius-xl: 25px;
  --border-radius-full: 50%;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  user-select: none;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 80%;
}

body {
  font-family: "Helvetica";
  color: var(--color-grey-700);

  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  overflow: hidden;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: var(--color-grey-10);
}

::-webkit-scrollbar-thumb {
  background: var(--color-grey-500);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-grey-700);
}
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

`;

export default GlobalStyles;
