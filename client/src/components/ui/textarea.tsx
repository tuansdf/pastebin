import { cn } from "@/utils/classnames.ts";
import { ComponentProps, Show, splitProps } from "solid-js";

type Props = {
  letterCount?: number;
  maxLetterCount?: number;
  errorMessage?: string;
} & ComponentProps<"textarea">;

export const Textarea = (props: Props) => {
  const [local, others] = splitProps(props, ["class", "errorMessage", "letterCount", "maxLetterCount"]);

  return (
    <div>
      <textarea class={cn("form-control", local.class)} {...others} />
      <Show when={local.errorMessage || local.letterCount === 0 || local.letterCount}>
        <div class="d-flex justify-content-between">
          <Show when={local.errorMessage} fallback={<div></div>}>
            <div class="form-text text-danger fs-6">{local.errorMessage}</div>
          </Show>
          <Show when={local.letterCount === 0 || local.letterCount}>
            <span class="text-secondary">
              {local.letterCount}
              <Show when={local.maxLetterCount}>{`/${local.maxLetterCount}`}</Show>
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
