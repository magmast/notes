import { ComponentProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export type PaperProps = ComponentProps<"div">;

export default function Paper(props: PaperProps) {
  return (
    <div
      {...props}
      class={twMerge(
        "w-96 max-w-full overflow-y-auto bg-white p-8",
        props.class,
      )}
    />
  );
}
