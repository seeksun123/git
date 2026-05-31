import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const assets = [
  ["logo.png", "https://www.hy-machinery.com/wp-content/uploads/2022/04/%E8%8B%B1%E6%96%87-logo-2.png"],
  ["printing-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E9%AB%98%E9%80%9F%E6%9C%89%E8%BD%B4-%E6%97%A0%E8%BD%B4%E5%87%B9%E7%89%88%E5%8D%B0%E5%88%B7%E6%9C%BA-01-1.jpg"],
  ["tarpaulin-laminating-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%AE%BD%E5%B9%85%E7%83%AD%E7%86%94%E8%B4%B4%E5%90%88%E6%9C%BA-02-1.jpg"],
  ["furniture-film-laminating-machine.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%A4%9A%E5%B1%82%E8%B4%B4%E5%90%88%E6%9C%BA-03.jpg"],
  ["calender-winder.jpg", "https://www.hy-machinery.com/wp-content/uploads/2020/07/%E5%85%A8%E8%87%AA%E5%8A%A8%E4%B8%AD%E5%BF%83%E5%8D%B7%E5%8F%96%E6%9C%BA-04-%E9%B8%BF%E6%BA%A2%E6%9C%BA%E6%A2%B0.jpg"]
];

await mkdir("assets/img", { recursive: true });

for (const [filename, url] of assets) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join("assets/img", filename), buffer);
}

console.log(`Downloaded ${assets.length} assets`);
