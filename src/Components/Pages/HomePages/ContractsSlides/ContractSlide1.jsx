import React from 'react';
import { motion } from 'framer-motion';
import headshot from './assets/headshot.webp';
import signature from './assets/signature.webp';
import './ContractSlide1.css';

const SKILLS = [
  { name: 'TypeScript',            proof: 'Census, GateKeep, lickpod.com' },
  { name: 'React / React Native',  proof: 'Cipher Tracker, Rambler, GateKeep' },
  { name: 'Node.js / Express',     proof: 'Census gateway, Rambler backend' },
  { name: 'Firebase',              proof: 'Cipher Tracker, GateKeep, Hike Away' },
  { name: 'Cloud Run / Cloud SQL', proof: 'Census jobs and database' },
  { name: 'Stripe',                proof: 'GateKeep escrow, Hike Away checkout' },
  { name: 'On-device encryption',  proof: 'Cipher Tracker, Paper Trail' },
  { name: 'Automated testing',     proof: '3,822 tests on Cipher Tracker' },
  { name: 'SEO / prerendering',    proof: 'This site, cipher-app.org' },
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
