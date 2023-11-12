import { ComponentProps, mergeProps, Show } from "solid-js";
import { TbPlayerPlay, TbPlayerStop } from "solid-icons/tb";

import AsyncButton from "~/components/AsyncButton";
import { twMerge } from "tailwind-merge";

export interface ToggleButtonProps
  extends Omit<ComponentProps<typeof AsyncButton>, "onClick"> {
  recording: boolean;
  onPlay?(): void;
  onStop?(): void;
}

export default function ToggleButton(rawProps: ToggleButtonProps) {
  const props = mergeProps(
    {
      type: "button" as const,
    },
    rawProps,
  );

  return (
    <AsyncButton
      {...props}
      class={twMerge(
        "bg-white rounded-full w-32 h-32 border-4 border-black flex items-center justify-center disabled:bg-gray-200 text-gray-700",
        props.class,
      )}
      onClick={() =>
        props.recording
          ? props.onStop && props.onStop()
          : props.onPlay && props.onPlay()
      }
    >
      <Show when={props.recording} fallback={<TbPlayerPlay size={64} />}>
        <TbPlayerStop size={64} />
      </Show>
    </AsyncButton>
  );
}
