import { createVault } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { createSignal, Show } from "solid-js";

const MAX_CONTENT_LENGTH = 50000;
const DEFAULT_ERROR_MESSAGE = "Something Went Wrong";

export const CreateNoteForm = () => {
  const [content, setContent] = createSignal<string>("");
  const [errors, setErrors] = createSignal<{ content?: string; request?: string }>({});
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const validateForm = (): boolean => {
    if (!content()) {
      setErrors({ content: "Required" });
      return false;
    }
    if (content().length > MAX_CONTENT_LENGTH) {
      setErrors({ content: `Content must be less than ${MAX_CONTENT_LENGTH} characters` });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleNoteSubmit = async () => {
    if (!validateForm()) return;
    try {
      setErrors({});
      setIsLoading(true);
      const data = await createVault({ content: content() });
      if (!data) setErrors({ request: DEFAULT_ERROR_MESSAGE });
    } finally {
      setIsLoading(false);
    }
  };

  const handleURLSubmit = () => {
    console.log("url", content());
  };

  return (
    <>
      <Show when={errors().request}>
        <Alert>{errors().request}</Alert>
      </Show>

      <form>
        <Textarea
          class="font-monospace"
          rows={20}
          value={content()}
          onInput={(e) => {
            setContent(e.currentTarget.value);
          }}
          minLength={1}
          maxLength={MAX_CONTENT_LENGTH}
          required
          errorMessage={errors().content}
          letterCount={content().length}
          maxLetterCount={MAX_CONTENT_LENGTH}
        />
        <div class="d-flex justify-content-end mt-2 gap-2">
          <Button type="button" variant="dark" onClick={handleURLSubmit}>
            Create URL
          </Button>
          <Button
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await handleNoteSubmit();
            }}
          >
            Create note
          </Button>
        </div>
      </form>

      <Show when={isLoading()}>
        <ScreenLoading />
      </Show>
    </>
  );
};
