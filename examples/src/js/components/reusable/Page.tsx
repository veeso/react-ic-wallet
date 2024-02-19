import * as React from 'react';
import Container from './Container';

const BlankPage = (props: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      style={props.style}
      className={`${props.className} w-screen min-h-screen`}
    >
      {props.children}
    </div>
  );
};

const BrandPage = (props: React.HTMLProps<HTMLDivElement>) => {
  const pageStyle = {
    backgroundImage: `url(/images/products-bg.webp)`,
  };
  return (
    <BlankPage
      className={`${props.className} relative bg-brand bg-fixed bg-center bg-no-repeat bg-cover py-32`}
      style={pageStyle}
    >
      <Container.Container className="z-1 relative">
        {props.children}
      </Container.Container>
    </BlankPage>
  );
};

export default {
  BlankPage,
  BrandPage,
};
