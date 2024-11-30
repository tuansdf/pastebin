import { getVault } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { DEFAULT_ERROR_MESSAGE } from "@/contants/common.constant.ts";
import { validateUrl } from "@/utils/common.util.ts";
import { decryptText } from "@/utils/crypto.util.ts";
import { useLocation, useParams } from "@solidjs/router";
import { createSignal, Match, onMount, Show, Switch } from "solid-js";

export const UrlDetail = () => {
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
      if (!decrypted || !validateUrl(decrypted)) {
        return handleError();
      }
      setContent(decrypted);
    } finally {
      setIsLoading(false);
    }
  });

  const targetUrlDomain = () => {
    if (!content()) return;
    const url = new URL(content());
    return url.host;
  };

  return (
    <>
      <Switch>
        <Match when={errorMessage()}>
          <Alert variant="danger">{errorMessage()}</Alert>
        </Match>
        <Match when={targetUrlDomain()}>
          <div class="text-center">
            <div>You are about to visit the following URL:</div>
            <a class="d-block mt-2 text-break" href={content()} style={{ "max-width": "40rem" }}>
              {content()}
            </a>
            <a class="btn btn-primary mt-3" href={content()}>
              Visit {targetUrlDomain()}
            </a>
          </div>
        </Match>
      </Switch>

      <Show when={isLoading()}>
        <ScreenLoading />
      </Show>
    </>
  );
};
