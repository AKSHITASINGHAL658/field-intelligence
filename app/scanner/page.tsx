"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AROverlay } from "@/components/AROverlay";
import { Plant } from "@/types/plant";
import { plants } from "@/data/plantDatabase";
import { useExplorerStore } from "@/lib/useExplorerStore";
import {
  ArrowLeft,
  Camera,
  Leaf,
  LoaderCircle,
  RotateCcw,
  Send,
  Sparkles,
  Upload,
} from "lucide-react";

type ScanPhase = "idle" | "camera-live" | "processing" | "result";

interface IdentificationResult {
  success: boolean;
  plant?: Plant;
  confidence?: number;
  message?: string;
}

export default function ScannerPage() {
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "user" | "bot"; text: string }>
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [isAskingBot, setIsAskingBot] = useState(false);

  const { addScanXp } = useExplorerStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    try {
      setPhase("camera-live");
      setSelectedImage(null);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Failed to access camera:", err);
      setPhase("idle");
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopCamera();
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setResult(null);
    setPhase("idle");
  };

  const processScan = async () => {
    setPhase("processing");

    setTimeout(() => {
      try {
        const samplePlant: Plant = plants[0] || {
          id: "cleistanthus-collinus",
          commonName: "Garari / Oduvan",
          scientificName: "Cleistanthus collinus",
          family: "Phyllanthaceae",
          nativeRegion: "South India & Sri Lanka",
          endemic: true,
          conservationStatus: "Least Concern (IUCN)",
          ecologicalImportance:
            "Hardy native species contributing to dry deciduous canopy structure and soil retention in arid regions.",
        };

        setResult({
          success: true,
          confidence: 0.96,
          plant: samplePlant,
        });

        // Award XP using the explorer store
        addScanXp(samplePlant.endemic);
        setPhase("result");
      } catch (err) {
        console.error("Identification failed:", err);
        setResult({
          success: false,
          message: "Failed to load botanical details. Please try again.",
        });
        setPhase("result");
      }
    }, 1200);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !result?.plant || isAskingBot) return;

    const userQuery = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userQuery }]);
    setIsAskingBot(true);

    try {
      const res = await fetch("/api/botanical-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId: result.plant.id,
          question: userQuery,
        }),
      });

      if (!res.ok) {
        throw new Error("API call failed");
      }

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.answer || "No details available." },
      ]);
    } catch (err) {
      console.error("Q&A Error:", err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `This plant (${result.plant?.commonName}) is native to ${result.plant?.nativeRegion}. Ecological role: ${result.plant?.ecologicalImportance}`,
        },
      ]);
    } finally {
      setIsAskingBot(false);
    }
  };

  const resetAll = () => {
    stopCamera();
    setSelectedImage(null);
    setResult(null);
    setPhase("idle");
    setChatMessages([]);
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 min-h-screen text-zinc-100 p-4 md:p-6 font-sans">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-4xl w-full mx-auto mb-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-300 uppercase tracking-wider">
            AR Engine Active
          </span>
        </div>
      </header>

      {/* Main Scanner Area */}
      <main className="max-w-4xl w-full mx-auto flex flex-col items-center gap-6">
        {/* Camera/Upload Frame Viewport */}
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center">
          {/* Live Video Stream */}
          <video
            ref={videoRef}
            className={`h-full w-full object-cover ${
              phase === "camera-live" || (phase === "result" && result?.plant)
                ? "block"
                : "hidden"
            }`}
            playsInline
            muted
          />

          {/* Uploaded Image Preview */}
          {selectedImage && phase !== "camera-live" && (
            <Image
              src={selectedImage}
              alt="Selected plant frame"
              fill
              className="object-cover"
            />
          )}

          {/* Idle Placeholder */}
          {phase === "idle" && !selectedImage && (
            <div className="flex flex-col items-center text-center p-6 text-zinc-500 space-y-3">
              <div className="p-4 bg-zinc-800/80 rounded-2xl border border-zinc-700/50">
                <Leaf className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-zinc-300">
                Ready for Field Analysis
              </p>
              <p className="text-xs text-zinc-500 max-w-xs">
                Launch live camera mode or select an existing plant photograph to run real-time botanical classification.
              </p>
            </div>
          )}

          {/* Processing Screen Overlay */}
          {phase === "processing" && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-white gap-3 z-20">
              <LoaderCircle className="w-8 h-8 text-emerald-400 animate-spin" />
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">
                Extracting Botanical Features...
              </span>
            </div>
          )}

          {/* AR Target Overlay */}
          {phase === "result" && result?.success && result.plant && (
            <AROverlay plant={result.plant} onClose={resetAll} />
          )}
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          {phase === "idle" && (
            <>
              <button
                onClick={startCamera}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <Camera className="w-4 h-4" /> Live Camera
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold py-3.5 px-4 rounded-xl transition-all border border-zinc-800"
              >
                <Upload className="w-4 h-4" /> Upload Image
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </>
          )}

          {(phase === "camera-live" || (selectedImage && phase === "idle")) && (
            <button
              onClick={processScan}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            >
              <Sparkles className="w-4 h-4" /> Scan & Analyze Species
            </button>
          )}

          {phase === "result" && (
            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-3.5 px-4 rounded-xl transition-all border border-zinc-800"
            >
              <RotateCcw className="w-4 h-4" /> Scan Another Species
            </button>
          )}
        </div>

        {/* Botanical Assistant RAG Box */}
        {result?.success && result.plant && (
          <section className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Botanical Assistant
            </h3>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
              {chatMessages.length === 0 ? (
                <p className="text-zinc-500 italic">
                  Ask any botanical or conservation question about {result.plant.commonName}...
                </p>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 ml-6"
                        : "bg-zinc-800 border border-zinc-700 text-zinc-200 mr-6"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Is this plant toxic? Native habitat?"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isAskingBot}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black p-2 rounded-xl transition-colors font-bold"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}