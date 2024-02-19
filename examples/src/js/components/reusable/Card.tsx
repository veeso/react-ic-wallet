import * as React from 'react';

const Card = (props: React.HTMLProps<HTMLDivElement>) => (
  <div
    itemScope={props.itemScope}
    itemType={props.itemType}
    itemProp={props.itemProp}
    className={`${props.className} p-6 bg-white/95 border border-gray-200 rounded-lg shadow`}
  >
    {props.children}
  </div>
);

export default Card;
