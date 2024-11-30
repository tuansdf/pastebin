import { cn } from "@/utils/classnames.ts";
import { ComponentProps, splitProps } from "solid-js";

export const Alert = (props: ComponentProps<"div">) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div class={cn("alert alert-danger", local.class)} {...others}></div>;
};
