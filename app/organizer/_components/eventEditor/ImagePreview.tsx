import { useState, useEffect } from "react";
import { Image as ImageIcon, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils/common";

interface ImagePreviewProps {
  imageUrl: string;
  title?: string;
  className?: string;
}

const ImagePreview = ({ imageUrl, title, className }: ImagePreviewProps) => {

  const [imageStatus, setImageStatus] = useState<"idle" | "loading" | "loaded" | "error">("idle");

  const trimmedUrl = imageUrl?.trim() || "";

  useEffect(() => {

    if (!trimmedUrl) {
      setImageStatus("idle");
      return;
    }

    setImageStatus("loading");

  }, [trimmedUrl]);

  const containerAttributes = {
    className: cn(
      "w-full rounded-2xl overflow-hidden border border-border-dark bg-dark-200/40 backdrop-blur-xl card-shadow flex flex-col p-4 gap-3",
      className
    ),
  };

  const previewBoxAttributes = {
    className:
      "relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-dark-100/80 border border-white/5 flex items-center justify-center group",
  };

  const imgAttributes = {
    src: trimmedUrl,
    alt: title || "Event poster preview",
    className: cn(
      "w-full h-full object-cover transition-opacity duration-300",
      imageStatus === "loaded" ? "opacity-100" : "opacity-0 absolute inset-0"
    ),
    onLoad: () => setImageStatus("loaded"),
    onError: () => setImageStatus("error"),
  };

  function renderHeader() {

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-primary" />

          <span className="text-xs font-mono uppercase tracking-wider text-light-200 font-medium">
            Poster Preview
          </span>
        </div>

        {imageStatus === "loaded" && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />

            <span>Active</span>
          </div>
        )}
      </div>
    );

  }

  function renderPlaceholder() {

    return (
      <div className="flex flex-col items-center justify-center text-center p-6 gap-2.5">
        <div className="w-12 h-12 rounded-xl bg-dark-200/80 border border-white/10 flex items-center justify-center text-light-200/50">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold text-white">No poster image yet</p>

          <p className="text-[11px] text-light-200/70 max-w-[200px]">
            Enter a valid image URL below to see a live visual preview
          </p>
        </div>
      </div>
    );

  }

  function renderLoadingState() {

    return (
      <div className="flex flex-col items-center justify-center gap-2 text-light-200/70">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />

        <span className="text-xs font-mono">Loading image...</span>
      </div>
    );

  }

  function renderErrorState() {

    return (
      <div className="flex flex-col items-center justify-center text-center p-6 gap-2 text-rose-400">
        <AlertTriangle className="w-7 h-7" />

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-semibold">Unable to load image</p>

          <p className="text-[11px] text-light-200/70 max-w-[220px]">
            Please verify the URL is public, accessible, and starts with https://
          </p>
        </div>
      </div>
    );

  }

  function renderImageContent() {

    if (!trimmedUrl) {
      return renderPlaceholder();
    }

    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...imgAttributes} />

        {imageStatus === "loading" && renderLoadingState()}

        {imageStatus === "error" && renderErrorState()}

        {imageStatus === "loaded" && title && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 pointer-events-none">
            <p className="text-xs font-semibold text-white line-clamp-1">
              {title}
            </p>
          </div>
        )}
      </>
    );

  }

  return (
    <div {...containerAttributes}>

      {renderHeader()}

      <div {...previewBoxAttributes}>

        {renderImageContent()}

      </div>

    </div>
  );

};

export default ImagePreview;
