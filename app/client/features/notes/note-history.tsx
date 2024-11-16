import { HistoryItem } from "@/client/features/vaults/history-item";
import { useAppStore } from "@/client/stores/app.store";
import { Alert, Box, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMemo } from "react";

export const NoteHistory = () => {
  const { noteUrls, removeNoteUrl } = useAppStore();

  const noteUrlsArr = useMemo(() => {
    if (!noteUrls) return;
    return Array.from(noteUrls);
  }, [noteUrls]);

  if (!noteUrlsArr?.length) {
    return <Alert color="blue" title="Nothing..." />;
  }

  const handleDelete = (item: string) => {
    modals.openConfirmModal({
      title: "Delete note",
      children: <Text size="sm">Are you sure you want to delete this note?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        removeNoteUrl(item);
      },
    });
  };

  return (
    <Box className="k-history-container">
      {noteUrlsArr.map((item) => {
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
