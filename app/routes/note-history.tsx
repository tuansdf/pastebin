import { NoteHistory } from "@/client/components/notes/note-history";
import { Title } from "@mantine/core";

export default function Page() {
  return (
    <>
      <Title mb="md" size="h3">
        Note history
      </Title>

      <NoteHistory />
    </>
  );
}
