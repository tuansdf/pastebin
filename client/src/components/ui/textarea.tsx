import { cn } from "@/utils/classnames.ts";
import { ComponentProps, splitProps } from "solid-js";

export const Textarea = (props: ComponentProps<"textarea">) => {
  const [local, others] = splitProps(props, ["class"]);
  return <textarea class={cn("form-control", local.class)} {...others} />;
};
