import { HistoryItem } from "@/client/components/shared/history-item";
import { useAppStore } from "@/client/shared/app.store";
import { Alert, Box, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMemo } from "react";

export const LinkHistory = () => {
  const { shortUrls, removeShortUrl } = useAppStore();

  const shortUrlsArr = useMemo(() => {
    if (!shortUrls) return;
    return Array.from(shortUrls);
  }, [shortUrls]);

  if (!shortUrlsArr?.length) {
    return <Alert color="blue" title="Nothing..." />;
  }

  const handleDelete = (item: string) => {
    modals.openConfirmModal({
      title: "Delete short link",
      children: <Text size="sm">Are you sure you want to delete this URL?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        removeShortUrl(item);
      },
    });
  };

  return (
    <Box className="k-history-container">
      {shortUrlsArr.map((item) => {
        if (!item) return null;
        return (
          <HistoryItem
            key={item}
            onDelete={() => handleDelete(item)}
            text={
              <Text component="a" target="_blank" href={item} truncate="end" c="blue">
                {item}
              </Text>
            }
          />
        );
      })}
    </Box>
  );
};
