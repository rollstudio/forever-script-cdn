import { about } from './about';
import { all } from './all';
import { home } from './home';

export const pages = () => {
  const { pathname } = window.location;

  switch (pathname) {
    case '/':
      console.log('home');
      home();
      break;
    case '/about':
      console.log('about');
      about();
      break;
    default:
      break;
  }

  all();
};
