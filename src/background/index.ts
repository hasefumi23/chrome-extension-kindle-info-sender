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

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('context menu is clicked');
  if (tab !== undefined) {
    console.log('in if 1');
    switch (info.menuItemId) {
      case 'watch-kindle': {
        console.log('in watch-kindle');
        chrome.tabs.sendMessage(tab.id as number, {
          type: 'SHOW',
        });
        break;
      }
    }
  }
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
  if (message.type === 'TRANSLATE') {
    const selectedText = message.data.selectedText ?? '';
    const value = await bucket.get();
    const userTargetLang = value.targetLang ?? 'EN';
    const translatedText = await translate(selectedText, userTargetLang);
    chrome.tabs.sendMessage(sender.tab?.id as number, {
      type: 'SHOW',
      data: {
        lang: userTargetLang,
        translatedText,
        originalText: selectedText,
      },
    });
  }
});

export {};
