import { getVaultAndDecryptContent } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { CopyButton } from "@/components/ui/copy-button.js";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/common.constant.ts";
import { useParams } from "@solidjs/router";
import { createResource, Match, Show, Switch } from "solid-js";

export const NoteDetail = () => {
  const params = useParams<{ id?: string }>();
  const [content] = createResource(() => getVaultAndDecryptContent(params.id));

  const errorMessage = () => {
    if (content.loading) return;
    if (content.error || !content()) {
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
          <CopyButton content={content()} class="mb-3" />
          <Textarea class="font-monospace" readOnly={true} value={content()} rows={20} />
        </Match>
      </Switch>

      <Show when={content.loading}>
        <ScreenLoading />
      </Show>
    </>
  );
};
