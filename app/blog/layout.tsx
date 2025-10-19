import React from 'react';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Include the original site's CSS */}
      <link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,300;0,600;0,800;1,800&family=Open+Sans:ital,wght@0,300;0,400;1,400&display=swap"
      />
      <link rel="stylesheet" href="/css/bootstrap.css" />
      <link rel="stylesheet" href="/css/style.css" />
      <link rel="stylesheet" href="/css/fonts.css" />
      
      {children}
    </>
  );
}