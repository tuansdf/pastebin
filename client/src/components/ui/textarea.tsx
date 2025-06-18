import { cn } from "@/utils/classnames.ts";
import { ComponentProps, Show, splitProps } from "solid-js";

type Props = {
  letterCount?: number;
  errorMessage?: string;
} & ComponentProps<"textarea">;

export const Textarea = (props: Props) => {
  const [local, others] = splitProps(props, ["class", "errorMessage", "letterCount"]);

  return (
    <div>
      <textarea class={cn("form-control", !!local.errorMessage && "border-danger", local.class)} {...others} />
      <Show when={local.errorMessage || local.letterCount === 0 || local.letterCount}>
        <div class="d-flex justify-content-between">
          <Show when={local.errorMessage} fallback={<div></div>}>
            <div class="form-text text-danger fs-6 m-0">{local.errorMessage}</div>
          </Show>
          <Show when={local.letterCount === 0 || local.letterCount}>
            <span classList={{ "text-secondary fs-6": true, "text-danger": !!local.errorMessage }}>
              {local.letterCount}
              <Show when={others.maxLength}>{`/${others.maxLength}`}</Show>
            </span>
          </Show>
        </div>
      </Show>
    </div>
  );
};
