import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { createSignal } from "solid-js";

const TYPE_NOTE = 1;
const TYPE_URL = 1;

export const CreateNoteForm = () => {
  const [type, setType] = createSignal<number>(TYPE_NOTE);
  const [content, setContent] = createSignal<string>("");

  const handleSubmit = () => {
    console.log(content());
    console.log(type());
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Textarea rows={20} value={content()} onChange={(e) => setContent(e.target.value)} />
      <div class="d-flex justify-content-end mt-2 gap-2">
        <Button type="submit" variant="dark" onClick={() => setType(TYPE_URL)}>
          Create URL
        </Button>
        <Button type="submit" onClick={() => setType(TYPE_NOTE)}>
          Create note
        </Button>
      </div>
    </form>
  );
};
