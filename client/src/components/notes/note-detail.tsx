import { getVault } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DEFAULT_ERROR_MESSAGE } from "@/contants/common.constant.ts";
import { decryptText } from "@/utils/crypto.util.ts";
import { useLocation, useParams } from "@solidjs/router";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";

export const NoteDetail = () => {
  const location = useLocation();
  const params = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [errorMessage, setErrorMessage] = createSignal<string>("");
  const [content, setContent] = createSignal<string>("");

  const handleError = () => {
    setErrorMessage(DEFAULT_ERROR_MESSAGE);
  };

  onMount(async () => {
    try {
      setIsLoading(true);
      const data = await getVault(params.id || "");
      if (!data) {
        return handleError();
      }
      const nonce = data.configs?.encryption?.nonce;
      const password = location.hash.startsWith("#") ? location.hash.substring(1) : location.hash;
      if (!data.content || !nonce || !password) {
        return handleError();
      }
      const decrypted = await decryptText(data.content, password, nonce);
      if (!decrypted) {
        return handleError();
      }
      setContent(decrypted);
    } finally {
      setIsLoading(false);
    }
  });

  const targetURL = () => window.location.origin + location.pathname + location.hash;

  return (
    <>
      <Switch>
        <Match when={errorMessage()}>
          <Alert variant="danger">{errorMessage()}</Alert>
        </Match>
        <Match when={!errorMessage()}>
          <Alert>
            Share this note:{" "}
            <a class="text-info text-break" href={targetURL()}>
              {targetURL()}
            </a>
          </Alert>
          <Textarea readOnly={true} value={content()} rows={20} />
        </Match>
      </Switch>

      <Show when={isLoading()}>
        <ScreenLoading />
      </Show>
    </>
  );
};
