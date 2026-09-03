"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CircleAlert,
  Leaf,
  LoaderCircle,
  RotateCcw,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";
import { classifyAndIdentify } from "@/lib/plantClassifier";
import { ClassifyResponse } from "@/types/api";
type Phase =
  | "choose"
  | "camera-starting"
  | "camera-live"
  | "camera-error"
  | "scanning"
  | "result";
export default function ScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("choose");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifyResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Stop the camera whenever we're not actively using it (unmount, or
  // leaving camera mode) so it isn't left running in the background.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setPhase("camera-starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setPhase("camera-live");
    } catch (error) {
      console.error("Camera access failed:", error);
      setErrorMessage(
        "Couldn't access the camera. Check your browser's camera permission, or upload a photo instead."
      );
      setPhase("camera-error");
    }
  }, []);

  const runClassification = useCallback(
    async (source: CanvasImageSource, previewUrl: string) => {
      setCapturedPhoto(previewUrl);
      setResult(null);
      setErrorMessage(null);
      setPhase("scanning");

      try {
        const response: ClassifyResponse = await classifyAndIdentify(source);
        setResult(response);
        setPhase("result");
      } catch (error) {
        console.error("Scan failed:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
        setPhase("result");
      }
    },
    []
  );

  const handleCapture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    stopCamera();
    await runClassification(canvas, canvas.toDataURL("image/jpeg", 0.9));
  }, [runClassification, stopCamera]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      image.onload = () => runClassification(image, url);
      image.onerror = () => {
        setErrorMessage("Could not read that image file.");
        setPhase("result");
      };
    },
    [runClassification]
  );

  const reset = useCallback(() => {
    stopCamera();
    setCapturedPhoto(null);
    setResult(null);
    setErrorMessage(null);
    setPhase("choose");
  }, [stopCamera]);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="flex items-center gap-3 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {phase === "choose" && (
          <div className="flex w-full max-w-sm flex-col gap-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Identify a plant
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Take a photo now, or upload one you already have.
            </p>

            <button
              onClick={startCamera}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Camera className="h-4 w-4" />
              Use camera
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-4 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <Upload className="h-4 w-4" />
              Upload photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        {phase === "camera-error" && (
          <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
            <CircleAlert className="h-8 w-8 text-amber-500" />
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {errorMessage}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            >
              <Upload className="h-4 w-4" />
              Upload photo instead
            </button>
            <button onClick={reset} className="text-xs text-zinc-500 underline">
              Back
            </button>
          </div>
        )}

        {(phase === "camera-starting" || phase === "camera-live") && (
          <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
            />
            {phase === "camera-starting" && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                <LoaderCircle className="h-6 w-6 animate-spin" />
              </div>
            )}
            {phase === "camera-live" && <Viewfinder scanning={false} />}
            {phase === "camera-live" && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <button
                  onClick={handleCapture}
                  aria-label="Capture photo"
                  className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/90 bg-white/20 backdrop-blur transition-transform active:scale-90"
                >
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <Camera className="h-5 w-5 text-zinc-900" />
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        <canvas ref={captureCanvasRef} className="hidden" />

        {(phase === "scanning" || phase === "result") && capturedPhoto && (
          <div className="flex w-full max-w-sm flex-col items-center">
            <div className="flip-scene w-full">
              <div
                className={`flip-card ${phase === "result" ? "is-flipped" : ""}`}
              >
                <div className="flip-face flip-front overflow-hidden rounded-2xl border border-zinc-200 shadow-lg dark:border-zinc-800">
                  <img
                    src={capturedPhoto}
                    alt="Captured plant"
                    className="h-72 w-full object-cover"
                  />
                  {phase === "scanning" && <Viewfinder scanning compact />}
                </div>

                <div className="flip-face flip-back overflow-y-auto rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg dark:border-emerald-900 dark:bg-zinc-950">
                  {result?.success && result.plant ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          {result.confidence !== undefined
                            ? `${Math.round(result.confidence * 100)}% match`
                            : "Match found"}
                        </span>
                        <Leaf className="h-5 w-5 text-emerald-600" />
                      </div>

                      <h2 className="mt-4 text-2xl font-semibold leading-tight text-zinc-950 dark:text-zinc-50">
                        {result.plant.commonName}
                      </h2>
                      <p className="mt-1 text-sm italic text-zinc-500">
                        {result.plant.scientificName}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {result.plant.ecologicalImportance}
                      </p>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <CircleAlert className="h-7 w-7 text-amber-500" />
                      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {errorMessage ??
                          result?.reason ??
                          "Couldn't identify this plant."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {phase === "scanning" && (
              <p className="mt-6 flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Identifying…
              </p>
            )}

            {phase === "result" && (
              <>
                <button
                  onClick={reset}
                  className="mt-6 flex items-center gap-2 rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  <RotateCcw className="h-4 w-4" />
                  Scan again
                </button>

                {result?.success && result.plant && (
                  <ChatPanel plantId={result.plant.id} />
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .flip-scene {
          perspective: 1400px;
        }
        .flip-card {
          position: relative;
          width: 100%;
          height: 18rem;
          transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-card.is-flipped {
          transform: rotateY(180deg);
        }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
        }
        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

// After a plant is identified, a small chat box lets the user ask about it —
// wired straight to the existing POST /api/guide route (plantId + question).
function ChatPanel({ plantId }: { plantId: string }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);

  const send = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setQuestion("");
    setSending(true);

    try {
      const response = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plantId, question: trimmed }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.ok
            ? data.answer
            : (data.error ?? "Sorry, something went wrong."),
        },
      ]);
    } catch (error) {
      console.error("Guide request failed:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setSending(false);
    }
  }, [question, sending, plantId]);

  return (
    <div className="mt-6 w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
        AI Botanical Guide
      </div>

      {messages.length > 0 && (
        <div className="flex max-h-64 flex-col gap-3 overflow-y-auto px-4 py-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                message.role === "user"
                  ? "ml-auto bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              }`}
            >
              {message.text}
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              Thinking…
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800"
      >
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="e.g. Is this plant edible?"
          className="flex-1 rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={sending || !question.trim()}
          aria-label="Send"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function Viewfinder({
  scanning,
  compact = false,
}: {
  scanning: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute z-10 ${
        compact
          ? "inset-6"
          : "left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2"
      }`}
    >
      <Corner className="left-0 top-0 border-l-2 border-t-2" />
      <Corner className="right-0 top-0 border-r-2 border-t-2" />
      <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
      <Corner className="bottom-0 right-0 border-b-2 border-r-2" />

      {scanning && (
        <div className="absolute inset-x-2 top-0 h-0.5 animate-scan-line bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.8)]" />
      )}

      <style jsx>{`
        @keyframes scan-line {
          0% {
            top: 4%;
          }
          50% {
            top: 96%;
          }
          100% {
            top: 4%;
          }
        }
        .animate-scan-line {
          animation: scan-line 1.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute h-7 w-7 rounded-sm border-emerald-400/90 ${className}`}
    />
  );
}