/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useState } from 'react';
import { Box, Button, Divider, Flex, Input, Text } from '@mantine/core';
import { useClickOutside, useEventListener } from '@mantine/hooks';

export const Content = ({
  asin,
  title,
  url,
  basePrice,
}: {
  asin: string;
  title: string;
  url: string;
  basePrice: string;
}) => {
  const [opened, setOpened] = useState(true);
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => setOpened(false), null, [dialog]);
  const [inputBasePrice, setInputBasePrice] = useState(basePrice);
  const [result, setRsesult] = useState('none');

  const sender = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        type: 'POST_BOOK',
        data: {
          basePrice: inputBasePrice,
          title,
          asin,
          url,
        },
      },
      (res) => {
        console.log(`[content] res is ${res}`);
        setRsesult(res.ok ? 'success' : 'error');
      }
    );
  }, [inputBasePrice, title, asin, url]);
  const ref = useEventListener('click', sender);

  return opened ? (
    <Box
      sx={(theme) => ({
        backgroundColor: 'white',
        textAlign: 'left',
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        maxWidth: 1000,
        boxShadow: '0 0 10px rgba(0,0,0,.3);',
      })}
      component="div"
      ref={setDialog}
    >
      <Text size="md">設定価格: </Text>
      <Flex>
        <Input value={inputBasePrice} onChange={(e) => setInputBasePrice(e.currentTarget.value)} />
        <Button ref={ref}>送信</Button>
      </Flex>
      <ResultText result={result} />
    </Box>
  ) : (
    <></>
  );
};

const ResultText = ({ result }: { result: string }) => {
  if (result === 'success') {
    return <Text>success.</Text>;
  } else if (result === 'error') {
    return <Text>error.</Text>;
  }
  return <></>;
};
