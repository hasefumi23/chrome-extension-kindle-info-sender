/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';
import { MdDone, MdOutlineContentCopy, MdVolumeUp } from 'react-icons/md';
import { getBucket } from '@extend-chrome/storage';
import {
  ActionIcon,
  Avatar,
  Box,
  CopyButton,
  Divider,
  Flex,
  Group,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';

import { translate } from '../app/translate';

interface MyBucket {
  targetLang: string;
}

const bucket = getBucket<MyBucket>('my_bucket', 'sync');

export const Content = ({
  translatedText,
  originalText,
  targetLang,
}: {
  translatedText: string;
  originalText: string;
  targetLang: string;
}) => {
  const [opened, setOpened] = useState(true);
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
  const [text, setText] = useState(translatedText);
  const [lang, setLang] = useState(targetLang);
  useClickOutside(() => setOpened(false), null, [dialog]);
  const iconUrl = chrome.runtime.getURL('images/extension_128.png');

  const handleChange = async (value: string) => {
    bucket.set({ targetLang: value });
    const newText = await translate(originalText, value);
    console.log(`original: ${originalText}`);
    console.log(`newText: ${newText}`);
    setText(newText);
    setLang(value);
  };

  return opened ? (
    <Box
      sx={(theme) => ({
        backgroundColor: 'white',
        textAlign: 'left',
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        maxWidth: 400,
        boxShadow: '0 0 10px rgba(0,0,0,.3);',
      })}
      component="div"
      ref={setDialog}
    >
      <Flex pb="xs" gap="xs" justify="flex-start" align="center">
        <Avatar src={iconUrl} />
        <Text size="md">訳文:</Text>
        <Select
          value={lang}
          onChange={(value: string) => handleChange(value)}
          size="xs"
          data={[
            { value: 'EN', label: '英語' },
            { value: 'KO', label: '韓国語' },
            { value: 'ZH', label: '中国語' },
            { value: 'JA', label: '日本語' },
          ]}
        />
      </Flex>
      <Divider />
      <Stack pt="sm" spacing="xs" style={{ textAlign: 'left' }}>
        <Text size="sm">{text}</Text>
        <Group position="right" spacing="xs">
          <Tooltip label="音声読み上げ" withArrow>
            <ActionIcon>
              <MdVolumeUp />
            </ActionIcon>
          </Tooltip>
          <CopyButton value={text}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? '訳文をコピーしました' : 'クリップボードにコピー'} withArrow>
                <ActionIcon onClick={copy}>
                  {copied ? <MdDone /> : <MdOutlineContentCopy />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Box>
  ) : (
    <></>
  );
};
