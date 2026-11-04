import { CATEGORY_KEYS } from './categoryKeys';
import BookLogo from '../Components/Pages/HomePages/PhilosophyPage/PhilosophyImages/BookLogo.webp';
import BrainLogo from '../Components/Pages/HomePages/PhilosophyPage/PhilosophyImages/BrainLogo.webp';
import ComputerLogo from '../Components/Pages/HomePages/PhilosophyPage/PhilosophyImages/ComputerLogo.webp';
import MicrophoneLogo from '../Components/Pages/HomePages/PhilosophyPage/PhilosophyImages/MicrophoneLogo.webp';
import WorldLogo from '../Components/Pages/HomePages/PhilosophyPage/PhilosophyImages/WorldLogo.webp';

/* What each shelf looks like on /philosophy. `empty` is the one line shown
   when a shelf has no essays yet. */
const DETAILS = {
  general: { logo: BookLogo, empty: 'The first essays are being written. Nothing on this shelf yet.' },
  neuroethics: { logo: BrainLogo, empty: 'For philosophy about the brain. Nothing on this shelf yet.' },
  technology: { logo: ComputerLogo, empty: 'For philosophy involving technology. Nothing on this shelf yet.' },
  political: { logo: MicrophoneLogo, empty: 'For the rare occasion I write about politics. Nothing on this shelf yet.' },
  world: { logo: WorldLogo, empty: 'For the rarer occasion I write about world events. Nothing on this shelf yet.' },
};

export const CATEGORIES = CATEGORY_KEYS.map((c) => ({ ...c, ...DETAILS[c.key] }));
