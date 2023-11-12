import { createSignal, Accessor, Setter } from "solid-js";
import { createTranscribe } from "~/utils/transcription";

export const AUDIO_MIME_TYPE = "audio/webm; codecs=opus";

type NoteRecorderStatus = "idle" | "recording" | "transcribing";

type StartRecordingNote = () => Promise<string>;

type StopRecordingNote = () => void;

export function createNoteRecorder(): [
  Accessor<NoteRecorderStatus>,
  StartRecordingNote,
  StopRecordingNote,
] {
  const [status, setStatus] = createSignal<NoteRecorderStatus>("idle");

  const transcribe = createTranscribe();

  const [, start, stop] = createMicrophoneRecorder();

  return [
    status,
    async () => {
      try {
        setStatus("recording");
        const audio = await start();

        setStatus("transcribing");
        return await transcribe(audio);
      } finally {
        setStatus("idle");
      }
    },
    stop,
  ];
}

type Recording = boolean;

type StartRecordingMicrophone = () => Promise<Blob>;

type StopRecordingMicrophone = () => void;

function createMicrophoneRecorder(): [
  Accessor<Recording>,
  StartRecordingMicrophone,
  StopRecordingMicrophone,
] {
  const [mediaRecorder, setMediaRecorder] = createSignal<MediaRecorder>();

  const createMediaRecorder = async () => {
    let recorder = mediaRecorder();
    if (!recorder) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      recorder = new MediaRecorder(stream, { mimeType: AUDIO_MIME_TYPE });
      setMediaRecorder(recorder);
    }
    return recorder;
  };

  const [recording, setRecording] = createSignal(false);

  return [
    recording,
    async () => {
      const recorder = await createMediaRecorder();

      const chunks: Blob[] = [];

      recorder.onstart = () => setRecording(true);
      recorder.ondataavailable = (event) => chunks.push(event.data);

      return await new Promise(async (resolve, reject) => {
        recorder.onerror = reject;
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: AUDIO_MIME_TYPE }));
          setRecording(false);
        };

        recorder.start();
      });
    },
    () => mediaRecorder()?.stop(),
  ];
}
