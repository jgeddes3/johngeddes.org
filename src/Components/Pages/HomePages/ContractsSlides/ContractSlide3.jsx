import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ContractSlide3.css';

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ContentSlide3 = ({ active }) => {
  return (
    <div className="content-slide-3-container">
      <motion.h2
        initial={{ opacity: 0, y: -6 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        I am looking to build other projects, but while you're here check out what the rest of this page has to offer!
      </motion.h2>
      <motion.div
        className="buttons-container"
        variants={listVariants}
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
      >
        <motion.div variants={itemVariants}>
          <Link to="/about" className="content-slide-3-button">About</Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/projects" className="content-slide-3-button">Projects</Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link to="/misc" className="content-slide-3-button">Misc</Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContentSlide3;
