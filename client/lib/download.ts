import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { PredictResult } from "@/types/api";

async function fetchBlob(url: string) {
  const res = await fetch(url);
  return await res.blob();
}

export async function downloadImage(url: string, filename: string) {
  const blob = await fetchBlob(url);
  saveAs(blob, filename);
}

export async function downloadAllZip(result: PredictResult) {
  const zip = new JSZip();
  const ts = new Date(result.createdAt).toISOString().replace(/[:.]/g, "-");
  const base = `aw-safeseg-${result.id}-${ts}`;
  const files = [
    { url: result.originalUrl, name: `${base}-original` },
    { url: result.maskUrl, name: `${base}-mask` },
    { url: result.heatmapUrl, name: `${base}-heatmap` },
    { url: result.overlayUrl, name: `${base}-overlay` },
  ];
  for (const f of files) {
    const blob = await fetchBlob(f.url);
    const ext = blob.type.split("/")[1] || "png";
    zip.file(`${f.name}.${ext}`, blob);
  }
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${base}.zip`);
}
