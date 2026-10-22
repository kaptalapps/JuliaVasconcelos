const urls = [
  "https://juliavasconcelosro.wixsite.com/projetos/colabora%C3%A7%C3%B5es-1",
  "https://juliavasconcelosro.wixsite.com/projetos/portfolio-1",
  "https://juliavasconcelosro-wixsite-com.filesusr.com/html/aefc9c_894a8ccf18627fd68c44bb61140459e6.html",
  "https://juliavasconcelosro-wixsite-com.filesusr.com/html/aefc9c_829c58b8f44be1ac155fdc295c4fada2.html",
  "https://juliavasconcelosro-wixsite-com.filesusr.com/html/aefc9c_40b71d1ee6131fe0272465eb7bc6091d.html",
  "https://juliavasconcelosro-wixsite-com.filesusr.com/html/aefc9c_108e749dacfdef0f297dd81a00b66e5e.html",
];

const outDir = "C:/DevWebsites/PortfolioJuliaVasconcelos/docs/research/julia";
import fs from "node:fs";

for (const url of urls) {
  const res = await fetch(url);
  const text = await res.text();
  const name = url.split("/").pop().slice(0, 40);
  console.log("\n===", name, res.status, text.length);
  const media = [...text.matchAll(/https?:[^"'\\\s<>]+(?:spotify|youtube|youtu\.be|vimeo|soundcloud)[^"'\\\s<>]*/gi)].map((m) => m[0]);
  const ids = [...new Set([...text.matchAll(/aefc9c_[a-z0-9]+~mv2\.[a-z0-9]+/gi)].map((m) => m[0]))];
  console.log("media", [...new Set(media)].slice(0, 20));
  console.log("ids", ids.length);
  if (name.endsWith(".html") || name.includes("html")) {
    fs.writeFileSync(`${outDir}/${name.replace(/[^a-z0-9.]+/gi, "_")}`, text.slice(0, 8000));
    console.log(text.slice(0, 1500));
  } else {
    fs.writeFileSync(`${outDir}/${name.includes("portfolio") ? "highlights-ids.txt" : "collab-ids.txt"}`, ids.join("\n"));
  }
}
