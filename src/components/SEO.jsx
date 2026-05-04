import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, ogImage, ogUrl, twitterCard }) => {
  const siteTitle = "Vorcas Tech Lab - Innovative & Timeless Design";
  const fullTitle = title ? `${title} | Vorcas Tech Lab` : siteTitle;
  const defaultDescription = "Engineering the future of digital innovation with powerful web solutions, mobile apps, and custom software designed for high-performance scale and impact.";
  const defaultKeywords = "web development, mobile apps, custom software, digital innovation, Vorcas Tech Lab, software engineering, Bangalore IT company";

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={ogUrl || "https://vorcastechlab.com"} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl || "https://vorcastechlab.com"} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || "/Vorcaslogo.png"} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard || "summary_large_image"} />
      <meta name="twitter:url" content={ogUrl || "https://vorcastechlab.com"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || "/Vorcaslogo.png"} />

      {/* Additional Performance/SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Vorcas Tech Lab" />
    </Helmet>
  );
};

export default SEO;
