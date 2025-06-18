import { Button } from "@/components/ui/button.js";
import { ComponentProps, createSignal, Match, splitProps, Switch } from "solid-js";

interface Props extends ComponentProps<typeof Button> {
  content?: string;
}

export const CopyButton = (props: Props) => {
  const [local, others] = splitProps(props, ["content"]);

  let debRef: ReturnType<typeof setTimeout> | undefined;
  const [copied, setCopied] = createSignal(false);

  const handleCopy = async () => {
    try {
      if (debRef) {
        clearTimeout(debRef);
      }
      if (!local.content) return;
      setCopied(true);
      await navigator.clipboard.writeText(local.content);
      debRef = setTimeout(() => {
        setCopied(false);
      }, 1000);
    } catch (e) {
      console.error("Failed to copy URL to clipboard", e);
    }
  };

  return (
    <Button onClick={handleCopy} disabled={copied()} {...others}>
      <Switch>
        <Match when={!copied()}>Click to copy</Match>
        <Match when={copied()}>Copied to clipboard!</Match>
      </Switch>
    </Button>
  );
};
