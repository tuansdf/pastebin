import { createVault } from "@/api/vault.api.ts";
import { Header } from "@/components/layout/header.tsx";
import { Alert } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DEFAULT_ERROR_MESSAGE, MAX_CONTENT_LENGTH } from "@/contants/common.constant.ts";
import { validateUrl } from "@/utils/common.util.ts";
import { encryptText, generateEncryptionConfigs, generatePassword } from "@/utils/crypto.util.ts";
import { A } from "@solidjs/router";
import { createSignal, Match, Show, Switch } from "solid-js";

export function CreateNotePage() {
  const [content, setContent] = createSignal<string>("");
  const [errors, setErrors] = createSignal<{ content?: string; common?: string }>({});
  const [isLoading, setIsLoading] = createSignal<boolean>(false);
  const [resultUrl, setResultUrl] = createSignal<string>("");

  const resetForm = () => {
    setContent("");
    setErrors({});
    setIsLoading(false);
    setResultUrl("");
  };

  const handleNoteSubmit = async () => {
    if (!content()) {
      return setErrors({ content: "Required" });
    }
    if (content().length > MAX_CONTENT_LENGTH) {
      return setErrors({ content: `Content must be less than ${MAX_CONTENT_LENGTH} characters` });
    }
    setErrors({});

    try {
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
      setResultUrl(`${location.origin}/${id}#${password}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!validateUrl(content().trim())) {
      return setErrors({ content: "URL is invalid" });
    }
    setErrors({});

    try {
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
      setResultUrl(`${location.origin}/s/${id}#${password}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header onNewNote={resetForm} />

      <div class="container-xxl p-3">
        <Show when={errors().common}>
          <Alert variant="danger">{errors().common}</Alert>
        </Show>

        <Switch>
          <Match when={resultUrl()}>
            <div class="">
              <Alert>
                Your note:{" "}
                <A class="text-info" href={resultUrl()}>
                  {resultUrl()}
                </A>
              </Alert>
            </div>
          </Match>
          <Match when={true}>
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
                <Button type="button" variant="dark" onClick={handleUrlSubmit}>
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
          </Match>
        </Switch>

        <Show when={isLoading()}>
          <ScreenLoading />
        </Show>
      </div>
    </>
  );
}
