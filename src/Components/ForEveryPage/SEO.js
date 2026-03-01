import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'John Geddes';
const DEFAULT_DESCRIPTION = 'The portfolio of John Geddes — AV and Software Engineer, project showcase, reviews, and more.';
const BASE_URL = 'https://www.johngeddes.org';

const SEO = ({ title, description, path }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — AV & Software Engineer`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
};

export default SEO;
