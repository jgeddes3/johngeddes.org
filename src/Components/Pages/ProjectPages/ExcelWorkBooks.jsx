import React from 'react';
import Background from '../../ForEveryPage/Background';
import PageFooter from '../../ForEveryPage/PageFooter';
import SEO from '../../ForEveryPage/SEO';
import { Link } from 'react-router-dom';
import './ProjectTemplate.css';
import Logo from '../ProjectButtons/ProjectButtonImages/Excel.png';

const ExcelWorkBooks = () => {
  return (
    <>
      <SEO
        title="Excel Workbooks"
        description="Excel Workbooks by John Geddes — custom Excel spreadsheets and automation tools available for purchase."
        path="/ExcelWorkBooks"
      />
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
            Whether you need a ready-made template to streamline your workflow or a more advanced
            workbook with macros and formulas already wired up, there will be something here for you.
            Check back soon for the full catalog.
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
        <Link to="/SnipeITTag" className="proj-nav-button">
          Snipe IT
        </Link>
      </div>
      <PageFooter />
    </>
  );
};

export default ExcelWorkBooks;
