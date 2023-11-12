import { JSX } from "solid-js";
import Backdrop from "~/components/Backdrop";
import Paper from "~/components/Paper";
import { TbX } from "solid-icons/tb";

export interface DialogProps {
  children?: JSX.Element;
  onClose?(): void;
}

export default function Dialog(props: DialogProps) {
  return (
    <Backdrop>
      <Paper class="relative">
        {props.onClose && (
          <button
            type="button"
            class="absolute top-4 right-4"
            onClick={props.onClose}
          >
            <TbX />
          </button>
        )}

        {props.children}
      </Paper>
    </Backdrop>
  );
}
