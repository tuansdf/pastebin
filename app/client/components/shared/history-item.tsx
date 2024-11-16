import { ActionIcon, Button, Card, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { ReactNode } from "react";

type Props = {
  text?: ReactNode;
  onDelete?: () => void;
};

export const HistoryItem = ({ text, onDelete }: Props) => {
  return (
    <Card className="k-history-item">
      {typeof text === "string" ? <Text>{text}</Text> : text}

      <Button.Group>
        <ActionIcon color="red" onClick={onDelete} size="md">
          <IconTrash size={20} />
        </ActionIcon>
      </Button.Group>
    </Card>
  );
};
