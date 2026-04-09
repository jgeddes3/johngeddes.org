import React from 'react';
import { motion } from 'framer-motion';
import headshot from './assets/headshot.webp';
import signature from './assets/signature.webp';
import './ContractSlide1.css';

const SKILLS = [
  { name: 'React / React Native', proof: 'Cipher Tracker, Rambler, Chess Deck' },
  { name: 'TypeScript',           proof: 'Snipe IT end-to-end' },
  { name: 'Node.js / Express',    proof: 'Rambler and Snipe IT backends' },
  { name: 'SQLite / Firebase',    proof: 'Courses DB, Chess Deck rooms' },
  { name: 'REST / GraphQL',       proof: '20+ endpoints, live data feeds' },
  { name: 'Puppeteer Scraping',   proof: 'Daily LOCUS harvest at 4 AM' },
  { name: 'WebRTC / PeerJS',      proof: 'Chess Deck online multiplayer' },
  { name: 'Tailwind / Vite',      proof: 'This site and Snipe IT' },
  { name: 'HTML / CSS',           proof: 'Every page, every project' },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ContractSlide1 = ({ active }) => {
  return (
    <div className="cs1">
      <div className="cs1-left">
        <div className="cs1-headshot-wrap">
          <img
            src={headshot}
            alt="John Geddes"
            className="cs1-headshot"
            loading="lazy"
            decoding="async"
          />
          <motion.img
            src={signature}
            alt=""
            aria-hidden="true"
            className="cs1-signature"
            initial={{ opacity: 0, x: -6 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
          />
        </div>
        <p className="cs1-name">JOHN GEDDES</p>
      </div>

      <div className="cs1-right">
        <h2 className="cs1-heading">SKILLS</h2>
        <motion.ul
          className="cs1-skills"
          variants={listVariants}
          initial="hidden"
          animate={active ? 'visible' : 'hidden'}
        >
          {SKILLS.map((skill) => (
            <motion.li key={skill.name} className="cs1-skill" variants={itemVariants}>
              <span className="cs1-skill-name">{skill.name}</span>
              <span className="cs1-skill-proof">{skill.proof}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default ContractSlide1;
