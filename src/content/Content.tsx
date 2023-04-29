/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useState } from 'react';
import { Box, Button, Flex, Group, Input, Text } from '@mantine/core';
import { useClickOutside, useEventListener } from '@mantine/hooks';

export const Content = ({ kindlePrice }: { kindlePrice: string }) => {
  const [opened, setOpened] = useState(true);
  const [dialog, setDialog] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => setOpened(false), null, [dialog]);
  const [basePrice, setBasePrice] = useState(kindlePrice);

  const sender = useCallback(() => console.log(`basePrice is ${basePrice}`), [basePrice]);
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
        <Input value={basePrice} onChange={(e) => setBasePrice(e.currentTarget.value)} />
        <Button ref={ref}>送信</Button>
      </Flex>
    </Box>
  ) : (
    <></>
  );
};
