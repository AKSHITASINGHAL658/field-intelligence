"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Zap, ZapOff, LoaderCircle, AlertCircle, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PixelMascot } from "@/components/pixel/PixelMascot";
import { PixelReticle } from "@/components/pixel/PixelReticle";
import { PixelLoader } from "@/components/pixel/PixelLoader";
import { PixelForestBackground } from "@/components/PixelForestBackground";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [torchActive, setTorchActive] = useState(false);
  const [isNewDiscovery, setIsNewDiscovery] = useState(false);

  const { ref: shutterRef, onMouseMove: onShutterMove, onMouseLeave: onShutterLeave } =
    useMagnetic<HTMLButtonElement>(8);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { recordObservation } = useExplorerStore();

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

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
          setErrorMessage("Camera unavailable. Upload a photo to scan!");
          setPhase("error");
        }
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [stopCamera]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const capabilities = (track.getCapabilities?.() as { torch?: boolean }) ?? {};
      if (capabilities.torch) {
        const nextState = !torchActive;
        // @ts-expect-error torch is valid in mobile browsers
        await track.applyConstraints({ advanced: [{ torch: nextState }] });
        setTorchActive(nextState);
      } else {
        setTorchActive(!torchActive);
      }
    } catch {
      setTorchActive(!torchActive);
    }
  };

  const executeClassification = async (imageSource: CanvasImageSource, photoDataUrl?: string) => {
    setPhase("analyzing");
    setErrorMessage(null);

    try {
      const result = await classifyImage(imageSource);

      if (!result.success || !result.speciesId) {
        setErrorMessage(
          result.reason ?? "Target unclear! Move camera closer to foliage."
        );
        setPhase("error");
        return;
      }

      const response = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = (await response.json()) as ClassifyResponse;

      if (!response.ok || !data.success || !data.plant) {
        setErrorMessage(data.reason ?? "No matching botanical record found in database.");
        setPhase("error");
        return;
      }

      const conf = data.confidence ?? result.confidence ?? 0.85;
      const { isNew } = recordObservation(data.plant.id, conf, photoDataUrl);

      setIdentifiedPlant(data.plant);
      setIsNewDiscovery(isNew);
      setPhase("revealed");
    } catch (err) {
      console.error("Classification pipeline failed:", err);
      setErrorMessage("Classification error. Check image or neural net state.");
      setPhase("error");
    }
  };

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
      {/* Dynamic Animated Pixel Forest Background */}
      <PixelForestBackground />

      <div className="relative z-10 max-w-md mx-auto px-4 py-4 space-y-4 font-mono md:max-w-xl lg:max-w-5xl lg:px-8 lg:py-8">
        
        {/* Retro Header Bar */}
        <div className="flex items-center justify-between text-xs bg-black/80 border-2 border-emerald-500 p-2.5 shadow-[4px_4px_0px_#000]">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-200 transition-colors font-black uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" />
            <span>◄ ARCADE SCANNER</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500 px-2 py-0.5">
              <span className="h-2 w-2 rounded-none bg-emerald-400 animate-ping" />
              {phase === "revealed" ? "HUD: ACTIVE" : "STATION READY"}
            </span>
          </div>
        </div>

        {/* ARCADE CABINET SCREEN CONTAINER */}
        <div className="relative space-y-4 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-6">
          
          {/* Main Viewfinder Frame */}
          <div className="relative aspect-[3/4] lg:aspect-[4/3] w-full bg-black border-4 border-emerald-500 shadow-[8px_8px_0px_#000000] overflow-hidden flex items-center justify-center lg:col-start-1 lg:col-span-3 lg:row-start-1">
            
            {/* Live Camera Stream */}
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

            {/* Static Snapshot Preview (If video unavailable) */}
            {selectedImage && phase !== "camera-live" && phase !== "revealed" && (
              <Image
                src={selectedImage}
                alt="Captured Specimen"
                fill
                unoptimized
                className="object-cover"
              />
            )}

            {/* Target Reticle */}
            {phase !== "revealed" && <PixelReticle scanning={phase === "analyzing"} />}

            {/* Live AR Overlay Flashcard */}
            {phase === "revealed" && identifiedPlant && (
              <AROverlay
                plant={identifiedPlant}
                onClose={handleReset}
                xpEarned={isNewDiscovery ? 100 : 25}
              />
            )}

            {/* Initializing Loader */}
            {phase === "idle" && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-20">
                <PixelLoader />
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
                  CONNECTING SENSORS...
                </p>
              </div>
            )}

            {/* Error Stage Overlay */}
            {phase === "error" && (
              <div className="absolute inset-0 bg-black/90 p-6 flex flex-col items-center justify-center text-center space-y-3 z-30">
                <PixelMascot size={48} expression="confused" />
                <p className="text-xs text-red-400 font-bold leading-relaxed max-w-xs">{errorMessage}</p>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={startCamera}
                    className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 border-2 border-black text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
                  >
                    RETRY CAMERA
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border-2 border-black text-white text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
                  >
                    SELECT PHOTO
                  </button>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* Interactive Mascot Arcade Dialogue Card */}
          <div className="relative bg-black/85 border-4 border-emerald-500 p-3 shadow-[6px_6px_0px_#000000] flex items-center justify-between lg:col-start-4 lg:col-span-2 lg:row-start-1">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-emerald-950 border-2 border-emerald-500">
                <PixelMascot
                  size={36}
                  expression={
                    phase === "analyzing"
                      ? "analyzing"
                      : phase === "revealed"
                        ? "happy"
                        : "scanning"
                  }
                />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                  {phase === "analyzing"
                    ? "NEURAL SCAN RUNNING..."
                    : phase === "revealed"
                      ? "SPECIES IDENTIFIED!"
                      : "FLORA BOT ASSISTANT"}
                </h4>
                <p className="text-[10px] text-zinc-400">
                  {phase === "analyzing"
                    ? "MATCHING LEAF PATTERNS"
                    : phase === "revealed"
                      ? "AR HUD SYNCHRONIZED"
                      : "AIM AT LEAF AND PRESS SCAN"}
                </p>
              </div>
            </div>

            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>

          {/* Side Mascot & Arcade Instructions Panel (Desktop) */}
          <div className="hidden lg:flex lg:flex-col lg:col-start-4 lg:col-span-2 lg:row-start-2 bg-black/85 border-4 border-emerald-500 p-4 shadow-[6px_6px_0px_#000000] space-y-3 relative">
            <div className="flex items-center justify-between border-b-2 border-emerald-900 pb-2">
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">
                MISSION GUIDE
              </span>
              <PixelMascot size={28} expression="happy" />
            </div>
            
            <ul className="space-y-2 text-xs text-emerald-200">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">1.</span>
                <span>Center the plant foliage inside the scanner crosshair.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">2.</span>
                <span>Press <strong>SCAN SPECIMEN</strong> to execute ONNX neural classification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 font-bold">3.</span>
                <span>View the 8-bit AR flashcard overlay in real time!</span>
              </li>
            </ul>
          </div>

          {/* Arcade Cabinet Bottom Buttons Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 lg:col-start-1 lg:col-span-3 lg:row-start-2">
            
            {/* Gallery Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 bg-zinc-900 hover:bg-zinc-800 border-4 border-black text-emerald-300 shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-[10px] font-black uppercase tracking-wider"
            >
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              GALLERY
            </button>

            {/* Shutter / Scan Button */}
            <button
              ref={shutterRef}
              onMouseMove={onShutterMove}
              onMouseLeave={onShutterLeave}
              onClick={phase === "revealed" ? handleReset : handleCapture}
              disabled={phase === "analyzing"}
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 border-4 border-black text-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
            >
              {phase === "analyzing" ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  ANALYZING...
                </>
              ) : phase === "revealed" ? (
                <>
                  <span className="text-base leading-none">↻</span>
                  SCAN ANOTHER
                </>
              ) : (
                <>
                  <span className="text-base leading-none">⚔</span>
                  SCAN SPECIMEN
                </>
              )}
            </button>

            {/* Torch Toggle */}
            <button
              onClick={toggleTorch}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 bg-zinc-900 hover:bg-zinc-800 border-4 border-black text-emerald-300 shadow-[4px_4px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 text-[10px] font-black uppercase tracking-wider"
            >
              {torchActive ? (
                <Zap className="w-5 h-5 text-yellow-400" />
              ) : (
                <ZapOff className="w-5 h-5 text-zinc-500" />
              )}
              LIGHT
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}