import React from 'react';
import { createRoot } from 'react-dom/client';

import { Content } from './Content';

const Main = ({
  asin,
  url,
  basePrice,
  title,
}: {
  asin: string;
  url: string;
  basePrice: string;
  title: string;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        left: '0px',
        top: '0px',
        zIndex: 2147483550,
      }}
    >
      <div
        style={{
          position: 'absolute',
          // いくつかの数字を試していい感じだったので、1/3にしている
          left: window.screen.width / 3,
          top: window.screen.height / 3,
          zIndex: 2147483550,
        }}
      >
        <Content basePrice={basePrice} asin={asin} url={url} title={title} />
      </div>
    </div>
  );
};

chrome.runtime.onMessage.addListener(function (message, _sender, _sendResponse) {
  console.log('add listener is called');
  if (message.type === 'SHOW') {
    const book = buildBook();
    const container = document.createElement('my-extension-root');
    document.body.after(container);
    console.log('before render');
    createRoot(container).render(
      <Main basePrice={book.basePrice} url={book.url} asin={book.asin} title={book.title} />
    );
  }
});

function buildBook(): { asin: string; url: string; basePrice: string; title: string } {
  const kindlePrice =
    document.getElementById('kindle-price')?.textContent?.replace(/[^0-9]/g, '') || '';
  console.log(`kindle price: ${kindlePrice}`);
  const asinElement = document.querySelector(
    '#ASIN, input[name="idx.asin"], input[name="ASIN.0"], input[name="titleID"]'
  );
  const asinVal = asinElement?.getAttribute('value') || '';
  const title = document.getElementById('productTitle')?.textContent?.trim() || '';
  const url = `https://www.amazon.co.jp/dp/${asinVal}`;
  return { asin: asinVal, title: title, url, basePrice: kindlePrice };
}
