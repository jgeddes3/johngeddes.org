import { Helmet } from 'react-helmet-async';
import { SITE } from '../../seo/site';
import { metaForPath } from '../../seo/meta';
import { serialize } from '../../seo/jsonld';

/* Head tags for a page. Everything comes from src/seo/meta.js, keyed by the
   route path, so the prerendered HTML and the running app always agree.
   `title` and `description` can still be overridden for one-off pages. */
const SEO = ({ path = '/', title, description }) => {
  const m = metaForPath(path);
  const fullTitle = title ? `${title} | ${SITE.name}` : m.fullTitle;
  const desc = description || m.description;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {m.noindex ? <meta name="robots" content="noindex" /> : null}
      {m.canonical ? <link rel="canonical" href={m.canonical} /> : null}
      <meta property="og:type" content={m.type} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {m.canonical ? <meta property="og:url" content={m.canonical} /> : null}
      <meta property="og:image" content={m.image.url} />
      <meta property="og:image:width" content={String(m.image.width)} />
      <meta property="og:image:height" content={String(m.image.height)} />
      <meta property="og:image:alt" content={m.image.alt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={m.image.url} />
      <meta name="twitter:image:alt" content={m.image.alt} />
      {m.jsonLd.map((data, i) => (
        <script key={i} type="application/ld+json">{serialize(data)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
