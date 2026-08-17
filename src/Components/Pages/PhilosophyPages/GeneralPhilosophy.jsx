import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './PhilosophyTemplate.css';

const GeneralPhilosophy = () => {
  return (
    <>
      <SEO
        title="General Philosophy"
        description="John Geddes' general philosophy section: what's coming, why it's taking a while, and where to start in the meantime."
        path="/phil1"
      />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>General Philosophy</h1>
      </div>
      <div className="phil-page main-content">
        <p className="phil-subtitle">The essays are in progress. Here's what this section is going to be.</p>

        <div className="phil-epigraph">
          If this myth is tragic, it is because the hero is conscious.
          <span className="phil-epigraph-attribution">— Albert Camus, The Myth of Sisyphus</span>
        </div>

        <div className="phil-body">
          <h2 className="phil-heading">Why the wait</h2>
          <p className="phil-text">
            Philosophy is one of my greatest passions, and it's the part of this site I've been
            slowest to publish — on purpose. An opinion about a burger or a bar can go up the week
            I form it. An opinion about how to live deserves more drafts, so I'm giving these
            pieces the time they need instead of posting filler.
          </p>
          <p className="phil-text">
            My way into the subject was the brain: I studied computer science at Loyola with a
            focus on neuroethics and AI, and the questions that stuck with me live where those
            fields overlap. Outside the classroom it's been the classics — Camus most of all —
            read slowly, when I have the mental capacity for them.
          </p>

          <hr className="phil-divider" />

          <h2 className="phil-heading">What's coming</h2>
          <p className="phil-text">
            The philosophy section is organized into five shelves, and each will fill in as the
            writing gets finished: general philosophy (this page), neuro-ethical philosophy,
            modern philosophy and technology, political philosophy, and world events. The last
            two will stay thin — I write about politics rarely, and I'd like to keep it that way.
          </p>

          <p className="phil-pullquote">
            It feels better knowing there are others — others laboring with no end in sight.
          </p>

          <h2 className="phil-heading">In the meantime</h2>
          <p className="phil-text">
            The closest thing to a philosophy essay I've published so far is my review of{' '}
            <Link to="/MythOfSisyphusReview">The Myth of Sisyphus</Link> — the pull quote above is
            where that one ends up. If you read it and want to argue, my inbox is open:
            app@johngeddes.org.
          </p>
        </div>
      </div>

      <div className="phil-nav-buttons">
        <Link to="/philosophy" className="phil-nav-button">
          Philosophy Page
        </Link>
      </div>

      <PageFooter />
    </>
  );
};

export default GeneralPhilosophy;
