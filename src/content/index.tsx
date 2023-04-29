import React from 'react';
import { createRoot } from 'react-dom/client';

import { Content } from './Content';

const Main = ({
  translatedText,
  originalText,
  targetLang,
}: {
  translatedText: string;
  originalText: string;
  targetLang: string;
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
        <Content kindlePrice={translatedText} originalText={originalText} targetLang={targetLang} />
      </div>
    </div>
  );
};

chrome.runtime.onMessage.addListener(async function (message, _sender, _sendResponse) {
  console.log('add listener is called');
  if (message.type === 'SHOW') {
    const kindlePrice = document
      .getElementById('kindle-price')
      ?.textContent?.replace(/[^0-9]/g, '');
    console.log(`kindle price: ${kindlePrice}`);

    const selection = window.getSelection();
    if (selection !== undefined && selection !== null && selection.toString() !== undefined) {
      const container = document.createElement('my-extension-root');
      document.body.after(container);
      console.log('before render');
      createRoot(container).render(
        <Main
          translatedText={kindlePrice?.toString() || 'null string'}
          originalText={kindlePrice?.toString() || 'null string'}
          targetLang={kindlePrice?.toString() || 'null string'}
        />
      );
    }
  }
});
