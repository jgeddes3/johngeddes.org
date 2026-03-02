import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'John Geddes';
const DEFAULT_DESCRIPTION = 'The portfolio of John Geddes, Audio Visual Engineer and Developer.';
const BASE_URL = 'https://www.johngeddes.org';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

const SEO = ({ title, description, path, image }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — AV & Software Engineer`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = path ? `${BASE_URL}${path}` : BASE_URL;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
