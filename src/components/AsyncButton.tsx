import { ComponentProps, createSignal, JSX, Show } from "solid-js";
import { map } from "~/utils/undefined";

interface AsyncButtonOwnProps {
  loading?: JSX.Element;
  children?: JSX.Element;
  disabled?: boolean;
  onClick?(event: MouseEvent): unknown | Promise<unknown>;
}

export type AsyncButtonProps = AsyncButtonOwnProps &
  Omit<ComponentProps<"button">, keyof AsyncButtonOwnProps>;

export default function AsyncButton(props: AsyncButtonProps) {
  const [loading, setLoading] = createSignal(false);

  const createClickHandler =
    (onClick: (event: MouseEvent) => unknown | Promise<unknown>) =>
    async (event: MouseEvent) => {
      setLoading(true);
      try {
        await onClick(event);
      } finally {
        setLoading(false);
      }
    };

  const handleClick = map(props.onClick, createClickHandler);

  return (
    <button
      {...props}
      disabled={props.disabled ?? loading()}
      onClick={handleClick}
    >
      <Show when={loading() && props.loading} fallback={props.children}>
        {(loading) => loading()}
      </Show>
    </button>
  );
}
