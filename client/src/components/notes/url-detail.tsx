import { getVaultAndDecryptContent } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { CopyButton } from "@/components/ui/copy-button.js";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/common.constant.ts";
import { validateUrl } from "@/utils/common.util.ts";
import { useParams } from "@solidjs/router";
import { createResource, Match, Show, Switch } from "solid-js";

export const UrlDetail = () => {
  const params = useParams<{ id?: string }>();
  const [content] = createResource(() => getVaultAndDecryptContent(params.id));

  const targetUrlDomain = () => {
    try {
      if (!content() || content.loading || content.error) return;
      const url = new URL(content()!);
      return url.host;
    } catch {}
  };

  const errorMessage = () => {
    if (content.loading) return;
    if (content.error || !content() || !validateUrl(content()!)) {
      return DEFAULT_ERROR_MESSAGE;
    }
  };

  return (
    <>
      <Switch>
        <Match when={errorMessage()}>
          <Alert variant="danger">{errorMessage()}</Alert>
        </Match>
        <Match when={true}>
          <div class="d-flex flex-column align-items-center text-center">
            <div>You are about to visit the following URL:</div>
            <a class="d-block mt-2 text-break" href={content()} style={{ "max-width": "40rem" }}>
              {content()}
            </a>
            <a class="btn btn-primary mt-3" href={content()}>
              Visit {targetUrlDomain()}
            </a>
            <CopyButton variant="dark" class="mt-1" content={content()} />
          </div>
        </Match>
      </Switch>

      <Show when={content.loading}>
        <ScreenLoading />
      </Show>
    </>
  );
};
