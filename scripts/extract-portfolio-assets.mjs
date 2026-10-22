import fs from "node:fs";
import path from "node:path";

const html = fs.readFileSync("C:/Users/pablo/Downloads/portfolio-julia.html", "utf8");
const outDir = "C:/DevWebsites/PortfolioJuliaVasconcelos/public/sites/julia";
fs.mkdirSync(outDir, { recursive: true });

const extFor = (mime) => {
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("svg")) return "svg";
  return "bin";
};

const records = [];
const re = /<(img|source|iframe)\b([^>]*)>/gi;
let match;
let index = 0;
while ((match = re.exec(html))) {
  const tag = match[1].toLowerCase();
  const attrs = match[2];
  const attr = (name) => {
    const m = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
    return m ? m[1] : "";
  };
  const src = attr("src");
  const alt = attr("alt");
  const dataSrc = "";
  if (tag === "iframe") {
    records.push({ index, tag, alt, src: src.slice(0, 400), file: null });
    index += 1;
    continue;
  }
  if (!src.startsWith("data:")) {
    records.push({ index, tag, alt, src: src.slice(0, 200), file: null });
    index += 1;
    continue;
  }
  const mime = src.slice(5, src.indexOf(";"));
  const b64 = src.slice(src.indexOf(",") + 1);
  const ext = extFor(mime);
  const slug = (alt || tag).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || tag;
  const file = `${String(index).padStart(2, "0")}-${slug}.${ext}`;
  fs.writeFileSync(path.join(outDir, file), Buffer.from(b64, "base64"));
  records.push({ index, tag, alt, mime, bytes: Buffer.from(b64, "base64").length, file });
  index += 1;
}

const triggers = [...html.matchAll(/class="pair-email lightbox-trigger" data-src="(data:[^"]+)"/g)];
triggers.forEach((t, i) => {
  const src = t[1];
  const mime = src.slice(5, src.indexOf(";"));
  const b64 = src.slice(src.indexOf(",") + 1);
  const ext = extFor(mime);
  const file = `lightbox-${String(i).padStart(2, "0")}.${ext}`;
  const buf = Buffer.from(b64, "base64");
  fs.writeFileSync(path.join(outDir, file), buf);
  records.push({ index: `lb-${i}`, tag: "data-src", mime, bytes: buf.length, file });
});

fs.writeFileSync(
  "C:/DevWebsites/PortfolioJuliaVasconcelos/docs/research/julia/assets.json",
  JSON.stringify(records, null, 2),
);
console.log(records.map((r) => `${r.file || "-"} ${r.alt || ""} ${r.bytes || ""} ${r.src || ""}`).join("\n"));
