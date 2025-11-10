export async function imageToCanvas(url: string): Promise<HTMLCanvasElement> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await new Promise((res, rej) => {
    img.onload = () => res(null);
    img.onerror = rej;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.drawImage(img, 0, 0);
  return canvas;
}
