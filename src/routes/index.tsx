import { createSignal, Show } from "solid-js";

import ToggleButton from "~/components/ToggleButton";
import { createNoteRecorder } from "~/utils/audio";
import Dialog from "~/components/Dialog";
import { createSummarize } from "~/utils/summaries";

type Note = { _tag: "raw"; text: string } | { _tag: "summary"; text: string };

export default function Home() {
  const [status, start, stop] = createNoteRecorder();

  const [note, setNote] = createSignal<Note>();

  const summarize = createSummarize();

  return (
    <main>
      <div class="relative h-screen flex items-center justify-center z-10">
        <ToggleButton
          recording={status() === "recording"}
          onPlay={() =>
            void start().then((text) => setNote({ _tag: "raw", text }))
          }
          onStop={stop}
        />
      </div>

      <Show when={status() === "transcribing"}>
        <Dialog>
          <p>Loading...</p>
        </Dialog>
      </Show>

      <Show when={status() === "idle" && note()}>
        {(note) => (
          <Dialog onClose={() => setNote(undefined)}>
            <p>{note().text}</p>

            <Show when={note()._tag !== "summary"}>
              <div class="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    const summary = await summarize(note().text);
                    setNote({ _tag: "summary", text: summary });
                  }}
                >
                  Summary
                </button>
              </div>
            </Show>
          </Dialog>
        )}
      </Show>
    </main>
  );
}
