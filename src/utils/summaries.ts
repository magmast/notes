import { createServerAction$ } from "solid-start/server";
import { openai } from "~/utils/openai";

type Summarize = (text: string) => Promise<string>;

export function createSummarize(): Summarize {
  const [, action] = createServerAction$(async (text: string) => {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content:
            "User messages are his speech to text converted notes. Please make them more compact and to the point.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return chatCompletion.choices[0].message.content;
  });

  return async (text) => (await action(text)) as string;
}
