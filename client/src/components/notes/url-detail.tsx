import { getVaultAndDecryptContent } from "@/api/vault.api.ts";
import { Alert } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.js";
import { ScreenLoading } from "@/components/ui/screen-loading.tsx";
import { DEFAULT_ERROR_MESSAGE } from "@/constants/common.constant.ts";
import { validateUrl } from "@/utils/common.util.ts";
import { useParams } from "@solidjs/router";
import { createResource, createSignal, Match, Show, Switch } from "solid-js";

export const UrlDetail = () => {
  let debRef: ReturnType<typeof setTimeout> | undefined;
  const [copied, setCopied] = createSignal(false);
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

  const handleCopy = async () => {
    try {
      if (debRef) {
        clearTimeout(debRef);
      }
      if (!content()) return;
      setCopied(true);
      await navigator.clipboard.writeText(content()!);
      debRef = setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (e) {
      console.error("Failed to copy URL to clipboard", e);
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
            <Button variant="dark" class="mt-1" onClick={handleCopy} disabled={copied()}>
              <Switch>
                <Match when={!copied()}>Click to copy</Match>
                <Match when={copied()}>Copied to clipboard!</Match>
              </Switch>
            </Button>
          </div>
        </Match>
      </Switch>

      <Show when={content.loading}>
        <ScreenLoading />
      </Show>
    </>
  );
};
