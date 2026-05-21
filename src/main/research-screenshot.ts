// Takes a screenshot of an HTML page using a hidden Electron BrowserWindow.
// Returns a PNG Buffer. Runs only in the Electron main process.

import { BrowserWindow } from "electron";

export async function captureHtmlAsPng(
  htmlContent: string,
  width = 780,
): Promise<Buffer> {
  // Estimate height from content length (min 600, max 4000)
  const estimatedHeight = Math.min(
    4000,
    Math.max(600, Math.ceil(htmlContent.length / 6)),
  );

  const win = new BrowserWindow({
    width,
    height: estimatedHeight,
    show: false,
    webPreferences: {
      offscreen: true,
    },
  });

  try {
    const encoded = encodeURIComponent(htmlContent);
    await win.loadURL(`data:text/html;charset=utf-8,${encoded}`);

    // Wait for render to settle
    await new Promise<void>((resolve) => setTimeout(resolve, 800));

    // Capture the full page
    const image = await win.webContents.capturePage();
    return image.toPNG();
  } finally {
    win.close();
  }
}
