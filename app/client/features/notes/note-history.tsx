import { HistoryItem } from "@/client/features/vaults/history-item";
import { useAppStore } from "@/client/stores/app.store";
import { Alert, Box, Text } from "@mantine/core";
import { useMemo } from "react";

export const NoteHistory = () => {
  const { noteUrls } = useAppStore();

  const noteUrlsArr = useMemo(() => {
    if (!noteUrls) return;
    return Array.from(noteUrls);
  }, [noteUrls]);

  if (!noteUrlsArr?.length) {
    return <Alert color="blue" title="Nothing..." />;
  }

  return (
    <Box className="k-history-container">
      {noteUrlsArr.map((item) => {
        if (!item) return null;
        return (
          <HistoryItem
            key={item}
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
