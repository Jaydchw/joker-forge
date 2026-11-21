export type PlaceholderType = "joker" | "consumable" | "booster" | "enhancement" | "seal" | "voucher" | "deck";

const manifests = import.meta.glob<string>("/public/images/placeholder*/credit.txt", {
  eager: true,
  query: "?raw",
  import: "default",
});

const catalogs = new Map<string, Map<number, string>>();
for (const [path, text] of Object.entries(manifests)) {
  const directory = path.slice("/public".length, -"/credit.txt".length);
  const credits = new Map<number, string>();
  for (const line of text.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d+)\s*:\s*(.+)$/);
    if (match) credits.set(Number(match[1]), match[2].trim());
  }
  catalogs.set(directory, credits);
}

export const getPlaceholderCredits = (type: PlaceholderType) =>
  catalogs.get(`/images/placeholder${type}s`)!;

export const placeholderSrc = (type: PlaceholderType, index: number) =>
  `/images/placeholder${type}s/placeholder-${type}-${index}.png`;

export function normalizePlaceholderPreview(
  type: PlaceholderType,
  item: { imagePreview?: string; placeholderCreditIndex?: number },
) {
  const imagePreview = item.imagePreview || "";
  const match = imagePreview.match(/^([/]images[/]placeholder([a-z]+)s)[/]placeholder-\2-(\d+)\.png$/);
  if (match && catalogs.get(match[1])?.has(Number(match[3])) === false) {
    return { imagePreview: placeholderSrc(type, 1), placeholderCreditIndex: 1 };
  }
  return { imagePreview, placeholderCreditIndex: item.placeholderCreditIndex };
}

const upscaleImage = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width === 71 && img.height === 95) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 142;
        canvas.height = 190;

        if (!ctx) return resolve(imageSrc);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 142, 190);
        resolve(canvas.toDataURL("image/png"));
      } else {
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
};

export async function getRandomPlaceholder(type: PlaceholderType) {
  const indices = Array.from(getPlaceholderCredits(type).keys());
  const creditIndex = indices[Math.floor(Math.random() * indices.length)];
  const src = placeholderSrc(type, creditIndex);
  return { imageData: type === "booster" ? src : await upscaleImage(src), creditIndex };
}
