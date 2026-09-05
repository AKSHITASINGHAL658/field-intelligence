"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Zap, ZapOff, LoaderCircle, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { PixelReticle } from "@/components/pixel/PixelReticle";
import { PixelLoader } from "@/components/pixel/PixelLoader";
import { AROverlay } from "@/components/AROverlay";
import { classifyImage } from "@/lib/plantClassifier";
import { useMagnetic } from "@/components/motion/useMagnetic";
import { useExplorerStore } from "@/lib/useExplorerStore";
import { ClassifyResponse } from "@/types/api";
import { Plant } from "@/types/plant";

type ScanPhase = "idle" | "camera-live" | "analyzing" | "revealed" | "error";

export default function ScannerPage() {
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [identifiedPlant, setIdentifiedPlant] = useState<Plant | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isNewDiscovery, setIsNewDiscovery] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchActive, setTorchActive] = useState(false);
  const { ref: shutterRef, onMouseMove: onShutterMove, onMouseLeave: onShutterLeave } =
    useMagnetic<HTMLButtonElement>(8);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { recordObservation } = useExplorerStore();

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start real camera stream
  const startCamera = useCallback(async () => {
    try {
      setErrorMessage(null);
      stopCamera();

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
    } catch (err) {
      console.warn("Direct camera access unavailable:", err);
      setErrorMessage("Camera access unavailable. You can upload an image instead.");
      setPhase("error");
    }
  }, [stopCamera]);

  // Auto-start camera when landing on /scanner
  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      ?.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
      .then(async (stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setPhase("camera-live");
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn("Direct camera access unavailable:", err);
          setErrorMessage("Camera access unavailable. You can upload an image instead.");
          setPhase("error");
        }
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  // Toggle hardware torch / flashlight if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = (track.getCapabilities?.() as { torch?: boolean }) ?? {};
      if (capabilities.torch) {
        const nextState = !torchActive;
        // @ts-expect-error torch is valid in mobile browser ImageCapture API
        await track.applyConstraints({ advanced: [{ torch: nextState }] });
        setTorchActive(nextState);
      } else {
        setTorchActive(!torchActive);
      }
    } catch {
      setTorchActive(!torchActive);
    }
  };

  // Run real in-browser ONNX inference and API enrichment
  const executeClassification = async (imageSource: CanvasImageSource, photoDataUrl?: string) => {
    setPhase("analyzing");
    setErrorMessage(null);

    try {
      // 1. Run real client-side ONNX vision model
      const result = await classifyImage(imageSource);

      if (!result.success || !result.speciesId) {
        setErrorMessage(
          result.reason ?? "Low confidence match. Please capture the foliage more closely."
        );
        setPhase("error");
        return;
      }

      // 2. Call /api/classify for real database enrichment
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = (await response.json()) as ClassifyResponse;

      if (!response.ok || !data.success || !data.plant) {
        setErrorMessage(data.reason ?? "No matching botanical record found in catalog.");
        setPhase("error");
        return;
      }

      // 3. Keep live camera feed running behind the AR Overlay flashcard
      const conf = data.confidence ?? result.confidence ?? 0.85;
      const { isNew } = recordObservation(data.plant.id, conf, photoDataUrl);

      setIdentifiedPlant(data.plant);
      setConfidence(conf);
      setIsNewDiscovery(isNew);
      setPhase("revealed");
    } catch (err) {
      console.error("Classification pipeline failed:", err);
      setErrorMessage("Classification error. Check image resolution or model state.");
      setPhase("error");
    }
  };

  // Capture frame from active live video
  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) {
      if (selectedImage) {
        const img = new window.Image();
        img.src = selectedImage;
        img.onload = () => executeClassification(img, selectedImage);
      }
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setSelectedImage(dataUrl);

    await executeClassification(canvas, dataUrl);
  };

  // Upload image from file picker
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setSelectedImage(url);

    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      executeClassification(img, url);
    };
    img.onerror = () => {
      setErrorMessage("Could not parse image file.");
      setPhase("error");
    };
  };

  const handleReset = () => {
    setIdentifiedPlant(null);
    setSelectedImage(null);
    setErrorMessage(null);
    if (streamRef.current && streamRef.current.active) {
      setPhase("camera-live");
    } else {
      setPhase("idle");
      startCamera();
    }
  };

  return (
    <AppShell>
      <div className="max-w-md mx-auto px-4 py-4 space-y-4 md:max-w-xl lg:max-w-5xl lg:px-8 lg:py-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between text-xs font-mono">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>FLORA LENS</span>
          </Link>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {phase === "revealed" ? "AR ACTIVE" : "READY"}
          </span>
        </div>

        {/* VIEWPORT & SCANNER UI */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Viewfinder Frame Container */}
          <div className="relative aspect-[3/4] lg:aspect-[4/3] w-full rounded-3xl overflow-hidden bg-black border border-[#1E2732] shadow-2xl flex items-center justify-center lg:col-start-1 lg:col-span-3 lg:row-start-1">
            {/* Live Video Stream */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`h-full w-full object-cover ${
                phase === "camera-live" || phase === "analyzing" || phase === "revealed"
                  ? "block"
                  : "hidden"
              }`}
            />

            {/* Uploaded / Captured Image Preview (only if video isn't live) */}
            {selectedImage && phase !== "camera-live" && phase !== "revealed" && (
              <Image
                src={selectedImage}
                alt="Captured specimen"
                fill
                unoptimized
                className="object-cover"
              />
            )}

            {/* Faint targeting grid behind reticle during scanning */}
            {(phase === "camera-live" || phase === "analyzing") && (
              <div className="absolute inset-0 scanner-grid pointer-events-none" aria-hidden="true" />
            )}

            {/* "SPECIMEN IN VIEW" Top Indicator */}
            {phase !== "revealed" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#06080A]/85 backdrop-blur-md border border-emerald-500/40 rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 tracking-wider uppercase z-20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SPECIMEN IN VIEW
              </div>
            )}

            {/* Optical Targeting Reticle during camera scan */}
            {phase !== "revealed" && <PixelReticle scanning={phase === "analyzing"} />}

            {/* AR Overlay (Transparent Liquid Glass Flash Card) when identified */}
            {phase === "revealed" && identifiedPlant && (
              <AROverlay
                plant={identifiedPlant}
                onClose={handleReset}
                xpEarned={isNewDiscovery ? 100 : 25}
              />
            )}

            {/* Camera Initializing Overlay */}
            {phase === "idle" && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20">
                <PixelLoader />
                <p className="text-xs font-mono text-zinc-400">
                  Requesting camera access...
                </p>
              </div>
            )}

            {/* Error Message Overlay */}
            {phase === "error" && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center text-zinc-300 space-y-3 z-30 animate-stage-in">
                {errorMessage?.toLowerCase().includes("confidence") ? (
                  <PixelMascot size={40} expression="confused" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                )}
                <p className="text-xs leading-relaxed max-w-xs">{errorMessage}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-bold font-mono transition-transform active:scale-95"
                  >
                    RETRY CAMERA
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#141B22] border border-[#1E2732] text-white text-xs font-mono transition-transform active:scale-95"
                  >
                    UPLOAD PHOTO
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden capture canvas & file input */}
          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Botanical Feature Analysis Card */}
          <div className="p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] flex items-center justify-between lg:col-start-4 lg:col-span-2 lg:row-start-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#141B22] border border-emerald-500/30 flex items-center justify-center">
                <PixelMascot
                  size={28}
                  expression={
                    phase === "analyzing"
                      ? "analyzing"
                      : phase === "revealed"
                        ? "happy"
                        : phase === "camera-live"
                          ? "scanning"
                          : "happy"
                  }
                />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-bold text-white">
                  {phase === "analyzing"
                    ? "Analyzing botanical features..."
                    : phase === "revealed"
                      ? "AR Specimen Target Identified"
                      : "Ready to classify specimen"}
                </h4>
                <p className="text-[10px] font-mono text-emerald-400">
                  {phase === "analyzing"
                    ? "ONNX NEURAL INFERENCE RUNNING"
                    : phase === "revealed"
                      ? "LIVE AR HUD ACTIVE"
                      : "CLIENT ML CLASSIFIER READY"}
                </p>
              </div>
            </div>

            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border transition-colors ${
                phase === "analyzing" || phase === "revealed"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse-gentle"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700"
              }`}
            >
              {phase === "analyzing"
                ? "INFERRING"
                : phase === "revealed"
                  ? "AR ACTIVE"
                  : "STANDBY"}
            </span>
          </div>

          {/* Scanning Tips — desktop-only supporting panel */}
          <div className="hidden lg:block lg:col-start-4 lg:col-span-2 lg:row-start-2 p-4 rounded-2xl bg-[#0C1015] border border-[#1E2732] space-y-3">
            <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              AR Scanning Instructions
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">▸</span>
                <span>Click "Identify Plant" to capture a snapshot and generate a live AR flashcard.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">▸</span>
                <span>The camera feed remains live behind the liquid glass overlay.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold font-mono">▸</span>
                <span>Click the close button on the flashcard or tap "Scan Another" to rescan.</span>
              </li>
            </ul>
          </div>

          {/* Bottom Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-1 lg:col-start-1 lg:col-span-3 lg:row-start-2">
            {/* Gallery upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl bg-[#0C1015] hover:bg-[#141B22] border border-[#1E2732] text-zinc-300 transition-all active:scale-95 text-[10px] font-mono font-bold"
            >
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              GALLERY
            </button>

            {/* Shutter Identify Button / Rescan Button */}
            <button
              ref={shutterRef}
              onMouseMove={onShutterMove}
              onMouseLeave={onShutterLeave}
              onClick={phase === "revealed" ? handleReset : handleCapture}
              disabled={phase === "analyzing"}
              className="flex-[2] flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all active:scale-[0.97] shadow-[0_0_25px_rgba(16,185,129,0.4)] disabled:opacity-60 disabled:active:scale-100"
            >
              {phase === "analyzing" ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  ANALYZING...
                </>
              ) : phase === "revealed" ? (
                <>
                  <span className="text-base font-mono leading-none">↺</span>
                  Scan Another Plant
                </>
              ) : (
                <>
                  <span className="text-base font-mono leading-none">⛶</span>
                  Identify Plant
                </>
              )}
            </button>

            {/* Torch toggle */}
            <button
              onClick={toggleTorch}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl bg-[#0C1015] hover:bg-[#141B22] border border-[#1E2732] text-zinc-300 transition-all active:scale-95 text-[10px] font-mono font-bold"
            >
              {torchActive ? (
                <Zap className="w-5 h-5 text-amber-400" />
              ) : (
                <ZapOff className="w-5 h-5 text-zinc-500" />
              )}
              TORCH
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}