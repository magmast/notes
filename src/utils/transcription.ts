import { nanoid } from "nanoid";
import { FileLike } from "openai/uploads";
import { createServerAction$ } from "solid-start/server";

import { openai } from "~/utils/openai";

async function transcribeAction(formData: FormData): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: formData.get("file") as FileLike,
  });

  return transcription.text;
}

export function createTranscribe() {
  const [, action] = createServerAction$(transcribeAction);

  return async (audio: Blob) => {
    const id = nanoid();

    const formData = new FormData();
    formData.set("file", new File([audio], `${id}.webm`));

    return (await action(formData)) as string;
  };
}
