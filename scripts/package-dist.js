import { execFile } from "node:child_process";
import { mkdir, rm, stat } from "node:fs/promises";
import { promisify } from "node:util";

const exec = promisify(execFile);
const zipPath = "artifacts/hy-machinery-cloudflare-pages-dist.zip";

await mkdir("artifacts", { recursive: true });
await rm(zipPath, { force: true });
await exec("zip", ["-qr", `../${zipPath}`, "."], { cwd: "dist" });

const info = await stat(zipPath);
console.log(`Created ${zipPath} (${Math.round(info.size / 1024)} KB)`);
