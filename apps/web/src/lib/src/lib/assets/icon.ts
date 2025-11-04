// Icon pipeline - fetch from Iconify and convert to dataURL
export async function fetchIconAsDataURL(
  icon: string,
  size: number = 64,
  color: string = "#000000"
): Promise<string> {
  try {
    // Iconify API format: https://api.iconify.design/{collection}/{icon}.svg?color={color}&width={size}&height={size}
    const [collection, iconName] = icon.split(":");
    if (!collection || !iconName) {
      throw new Error(`Invalid icon format: ${icon}. Expected format: "collection:icon"`);
    }

    const url = `https://api.iconify.design/${collection}/${iconName}.svg?color=${encodeURIComponent(color)}&width=${size}&height=${size}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch icon: ${response.statusText}`);

    const svgText = await response.text();
    
    // Convert SVG to data URL
    const svgBlob = new Blob([svgText], { type: "image/svg+xml" });
    return await blobToDataURL(svgBlob);
  } catch (error) {
    console.error("Error fetching icon:", error);
    throw error;
  }
}

export async function svgToPngDataURL(svgDataURL: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to convert SVG to PNG"));
            return;
          }
          blobToDataURL(blob).then(resolve).catch(reject);
        },
        "image/png"
      );
    };

    img.onerror = () => reject(new Error("Failed to load SVG"));
    img.src = svgDataURL;
  });
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const COMMON_ICONS = {
  "check": "material-symbols:check-circle",
  "arrow-right": "material-symbols:arrow-forward",
  "trending-up": "material-symbols:trending-up",
  "trending-down": "material-symbols:trending-down",
  "chart": "material-symbols:bar-chart",
  "table": "material-symbols:table-chart",
  "image": "material-symbols:image",
  "star": "material-symbols:star",
  "heart": "material-symbols:favorite",
  "like": "material-symbols:thumb-up",
};

