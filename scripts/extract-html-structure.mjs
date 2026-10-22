import fs from "node:fs";

const html = fs.readFileSync("C:/Users/pablo/Downloads/portfolio-julia.html", "utf8");
console.log("len", html.length);

const stripped = html
  .replace(/data:[^"'\\\s>]+/g, "DATA")
  .replace(/src="[^"]{80,}"/g, 'src="LONG"');

fs.mkdirSync("C:/DevWebsites/PortfolioJuliaVasconcelos/docs", { recursive: true });
fs.writeFileSync("C:/DevWebsites/PortfolioJuliaVasconcelos/docs/html-structure.html", stripped);
console.log("stripped", stripped.length);

const tags = [...stripped.matchAll(/<(section|header|nav|h1|h2|h3|button|a|iframe|main|footer)([^>]*)>/gi)];
const lines = tags.map((t) => t[0].slice(0, 240));
fs.writeFileSync("C:/DevWebsites/PortfolioJuliaVasconcelos/docs/html-tags.txt", lines.join("\n"));
console.log("tags", lines.length);
console.log(lines.slice(0, 80).join("\n"));
