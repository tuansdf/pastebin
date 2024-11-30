import { createVault } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DEFAULT_ERROR_MESSAGE, MAX_CONTENT_LENGTH } from "@/contants/common.constant.ts";
import { encryptText, generateEncryptionConfigs, generatePassword } from "@/utils/crypto.util.ts";
import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";

export const CreateNoteForm = () => {
  const navigate = useNavigate();
  const [content, setContent] = createSignal<string>("");
  const [errors, setErrors] = createSignal<{ content?: string; common?: string }>({});
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
      const encryptionConfigs = generateEncryptionConfigs();
      const password = generatePassword();
      const encrypted = await encryptText(content(), password, encryptionConfigs.nonce);
      const data = await createVault({
        content: encrypted,
        configs: { encryption: encryptionConfigs },
      });
      if (!data) return setErrors({ common: DEFAULT_ERROR_MESSAGE });
      const id = data.id;
      navigate(`/${id}#${password}`);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleURLSubmit = () => {
  //   console.log("url", content());
  // };

  return (
    <>
      <Show when={errors().common}>
        <Alert variant="danger">{errors().common}</Alert>
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
          placeholder="Write your notes here..."
        />
        <div class="d-flex justify-content-end mt-2 gap-2">
          {/*<Button type="button" variant="dark" onClick={handleURLSubmit}>*/}
          {/*  Create URL*/}
          {/*</Button>*/}
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
