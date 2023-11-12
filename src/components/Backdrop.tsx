import { ComponentProps } from "solid-js";
import { twMerge } from "tailwind-merge";

export type BackdropProps = ComponentProps<"div">;

export default function Backdrop(props: BackdropProps) {
  return (
    <div
      {...props}
      class={twMerge(
        "fixed top-0 left-0 z-20 w-full h-full bg-black bg-opacity-60 flex items-center justify-center p-24",
        props.class,
      )}
    />
  );
}
