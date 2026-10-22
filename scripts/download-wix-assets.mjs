import fs from "node:fs";
import path from "node:path";

const out = "C:/DevWebsites/PortfolioJuliaVasconcelos/public/sites/julia/wix";
fs.mkdirSync(out, { recursive: true });

const files = {
  "futura.png": "https://static.wixstatic.com/media/aefc9c_eb3008513f5d48788e899f7bba0df66d~mv2.png",
  "short-film.jpg": "https://static.wixstatic.com/media/aefc9c_f1e634214567467a896ae0d157f46c28~mv2.jpg",
  "distintas.png": "https://static.wixstatic.com/media/aefc9c_b63428c689434c62ae9ac20cc7b38adb~mv2.png",
  "photo-essay.jpg": "https://static.wixstatic.com/media/aefc9c_4ced3d81da434d078eb262341ea3d134~mv2.jpg",
  "publica.png": "https://static.wixstatic.com/media/aefc9c_eaafc08d8add4ceaa0638b8f77df2275~mv2.png",
  "sesc.png": "https://static.wixstatic.com/media/aefc9c_29402e72da984e71a5544122b120f8d0~mv2.png",
  "network.png": "https://static.wixstatic.com/media/aefc9c_eaebe1076cf248bc80e669e152f86bb1~mv2.png",
  "cajueira.webp": "https://static.wixstatic.com/media/aefc9c_009dcb7df4c24dd19449ecddd33e2e49~mv2.webp",
  "correspondent.jpg": "https://static.wixstatic.com/media/aefc9c_14d3d8e71a314925b78c26238542fe6e~mv2.jpeg",
  "gallery-01.jpg": "https://static.wixstatic.com/media/aefc9c_e450cfad86944149a3e90745f2ffdacd~mv2.jpeg",
  "gallery-02.jpg": "https://static.wixstatic.com/media/aefc9c_fb62df00f7d84c528e09c73c16eb5a17~mv2.jpeg",
  "gallery-03.jpg": "https://static.wixstatic.com/media/aefc9c_ca135abcebdb46e293a8801f0f0039e3~mv2.jpeg",
  "gallery-04.jpg": "https://static.wixstatic.com/media/aefc9c_3c0c7071d990427ab85f9d5c20e7a00e~mv2.jpg",
  "gallery-05.jpg": "https://static.wixstatic.com/media/aefc9c_f690b219bc9146479fd66ea37fa45c4d~mv2.jpeg",
  "gallery-06.jpg": "https://static.wixstatic.com/media/aefc9c_3c19aa8c2fa74ffab9484a7b604d5d2b~mv2.jpeg",
  "gallery-07.jpg": "https://static.wixstatic.com/media/aefc9c_1d3ab4bb306843bdb46a5f3b78ed176b~mv2.jpeg",
  "gallery-08.jpg": "https://static.wixstatic.com/media/aefc9c_479c14d55e2349c68d34a90d5374a90a~mv2.jpeg",
  "gallery-09.jpg": "https://static.wixstatic.com/media/aefc9c_38fd1eb08f694b888b9210b0996d35ee~mv2.jpeg",
};

for (const [name, url] of Object.entries(files)) {
  const res = await fetch(url);
  if (!res.ok) {
    console.log("FAIL", name, res.status);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(out, name), buf);
  console.log(name, buf.length, res.headers.get("content-type"));
}

for (const id of ["j7o4rtaa7fM", "FBJ-7sgtZTc"]) {
  const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
  console.log("yt", id, res.status, await res.text());
}
