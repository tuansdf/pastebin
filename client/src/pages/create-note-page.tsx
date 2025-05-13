import { createVault } from "@/api/vault.api.ts";
import { Header } from "@/components/layout/header.tsx";
import { Alert } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  DEFAULT_ERROR_MESSAGE,
  DEFAULT_LINK_ID_SIZE,
  DEFAULT_NOTE_ID_SIZE,
  EXPIRES_TIME_10_MINUTES,
  EXPIRES_TIME_1_DAY,
  EXPIRES_TIME_1_HOUR,
  EXPIRES_TIME_1_MONTH,
  EXPIRES_TIME_1_WEEK,
  MAX_CONTENT_LENGTH,
} from "@/constants/common.constant.ts";
import { validateUrl } from "@/utils/common.util.ts";
import { encryptText, generatePassword } from "@/utils/crypto.util.ts";
import { A } from "@solidjs/router";
import { createSignal, Match, Show, Switch } from "solid-js";

export function CreateNotePage() {
  const [content, setContent] = createSignal<string>("");
  const [expiresTime, setExpiresTime] = createSignal<number>(EXPIRES_TIME_1_HOUR);
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
      const password = generatePassword();
      const encrypted = await encryptText(content(), password);
      const data = await createVault(
        {
          content: encrypted,
        },
        { size: DEFAULT_NOTE_ID_SIZE, time: expiresTime() },
      );
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
      const password = generatePassword();
      const encrypted = await encryptText(content(), password);
      const data = await createVault(
        {
          content: encrypted,
        },
        { size: DEFAULT_LINK_ID_SIZE, time: expiresTime() },
      );
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
            <Alert>
              Your note:{" "}
              <A class="text-info text-break" href={resultUrl()}>
                {resultUrl()}
              </A>
            </Alert>
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
              <div class="d-flex justify-content-between mt-2 gap-2">
                <select
                  class="form-select w-auto"
                  aria-label="Default select example"
                  onInput={(e) => setExpiresTime(Number(e.target.value))}
                >
                  <option value={EXPIRES_TIME_10_MINUTES}>Expires: 10 minutes</option>
                  <option value={EXPIRES_TIME_1_HOUR}>Expires: 1 hour</option>
                  <option value={EXPIRES_TIME_1_DAY}>Expires: 1 day</option>
                  <option value={EXPIRES_TIME_1_WEEK}>Expires: 1 week</option>
                  <option value={EXPIRES_TIME_1_MONTH}>Expires: 1 month</option>
                </select>
                <div class="d-flex justify-content-end gap-2">
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
