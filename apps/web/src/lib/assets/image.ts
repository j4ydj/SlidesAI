// Image pipeline - fetch, compress, convert to dataURL
export async function fetchImageAsDataURL(url: string, maxSizeMB: number = 2): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    const blob = await response.blob();
    const sizeMB = blob.size / (1024 * 1024);

    // If image is too large, compress it
    if (sizeMB > maxSizeMB) {
      return await compressImage(blob, maxSizeMB);
    }

    return await blobToDataURL(blob);
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error;
  }
}

export async function compressImage(blob: Blob, maxSizeMB: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions (maintain aspect ratio)
      let width = img.width;
      let height = img.height;
      const maxDimension = 1920; // Max width/height for slides

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (compressedBlob) => {
          if (!compressedBlob) {
            reject(new Error("Compression failed"));
            return;
          }
          blobToDataURL(compressedBlob).then(resolve).catch(reject);
        },
        "image/jpeg",
        0.85 // Quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(blob);
  });
}

export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function uploadImageToSupabase(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { supabase } = await import("@/integrations/supabase/client");
  
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

