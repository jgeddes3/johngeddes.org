import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Excel.webp';

const ExcelWorkBooks = () => {
  return (
    <>
      <SEO path="/ExcelWorkBooks" />
      <Background />
      <div id="centerpiece2" className="main-content">
        <h1>Excel Work Books</h1>
      </div>
      <div className="proj-page main-content">
        <div className="proj-hero">
          <img className="proj-stub-logo" src={Logo} alt="Excel Work Books" />
          <p className="proj-hero-tagline">
            A collection of Excel spreadsheets built and refined over the years,
            soon available for purchase.
          </p>
          <p className="proj-status">
            The workbooks exist; the shop does not yet. This page is a placeholder until
            there is something to sell.
          </p>
        </div>

        <div className="proj-about">
          <h2 className="proj-section-heading">Coming Soon</h2>
          <p>
            Over the years I have built a wide range of Excel workbooks for everything from
            data analysis and reporting to budgeting, inventory tracking, and automation. This page
            will soon be home to a shop where you can browse and purchase these spreadsheets for
            your own use.
          </p>
          <p>
            Some are plain templates, some have macros and formulas already wired up. The catalog
            goes up when the shop does.
          </p>
        </div>
      </div>

      <div className="proj-nav-buttons">
        <Link to="/RamblerRegistrar" className="proj-nav-button">
          Rambler Registrar
        </Link>
        <Link to="/projects" className="proj-nav-button proj-nav-button-blue">
          Projects Page
        </Link>
        <Link to="/SnipeIT" className="proj-nav-button">
          Snipe IT
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default ExcelWorkBooks;
