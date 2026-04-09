import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContractSlide2.css';

const EMAIL = 'johngeddes@pm.me';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.25 + i * 0.15, ease: 'easeOut' },
  }),
};

const ContractSlide2 = ({ active }) => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard API unavailable — fail silently */
    }
  };

  return (
    <div className="cs2">
      <motion.section
        className="cs2-card"
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
      >
        <h2 className="cs2-heading">RATES</h2>
        <p className="cs2-body">
          My rates for building websites are flexible, depending on the project
          scope and complexity. Contact me to discuss your specific needs, and
          I'll provide a custom quote.
        </p>
      </motion.section>

      <motion.section
        className="cs2-card"
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate={active ? 'visible' : 'hidden'}
      >
        <h2 className="cs2-heading">CONTACT</h2>
        <p className="cs2-body">
          To get a custom quote, email me with your project details — features,
          design preferences, and timeline.
        </p>
        <button
          type="button"
          className="cs2-email"
          onClick={copyEmail}
          aria-label={`Copy email address ${EMAIL}`}
        >
          <span>{EMAIL}</span>
          <AnimatePresence>
            {copied && (
              <motion.span
                className="cs2-copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                Copied!
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.section>
    </div>
  );
};

export default ContractSlide2;
