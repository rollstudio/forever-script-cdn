import { autoNumbers } from './autoNumbers';
import { locations } from './locations';
import { staggerText } from './staggerText';
import { transitions } from './transitions';
import { who } from './who';

export const all = () => {
  console.log('all');

  transitions();
  autoNumbers();
  staggerText();
  locations();
  who();
};
