import { getBucket } from '@extend-chrome/storage';

import { translate } from '../app/translate';

interface MyBucket {
  targetLang: string;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

/**
 * ブラウザ起動時に実行される
 * コンテキストメニューに「」メニューを追加する
 * @see https://developer.chrome.com/docs/extensions/reference/contextMenus/#type-ContextType
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'watch-kindle',
    title: 'Kindle価格をウォッチする',
    contexts: ['all'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('context menu is clicked');
  if (tab !== undefined) {
    switch (info.menuItemId) {
      case 'watch-kindle': {
        console.log('in watch-kindle');
        chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
        });
        console.log('[background] after sendMessage');
        break;
      }
    }
  }
});

// FIXME: 定義箇所を移動する
const API_URL = 'https://sandbox-cloudflare.hasefumi232694.workers.dev/books';
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(`[background] message is ${JSON.stringify(message)}`);
  if (message.type === 'POST_BOOK') {
    (async () => {
      console.log('[background] request POST_BOOK');
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + 'hasefumi23',
        },
        mode: 'cors',
        body: JSON.stringify({
          isbn: message.data.asin,
          basePrice: message.data.basePrice,
          title: message.data.title,
          url: message.data.url,
        }),
      });
      console.log('[background] recieve POST_BOOK');
      sendResponse({
        ok: res.ok,
        status: res.status,
        data: res.ok ? await res.json() : null,
      });
    })();
  }

  return true;
});

export {};
