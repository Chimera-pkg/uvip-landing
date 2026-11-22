// Pemeriksaan file dan konfigurasi sebelum deploy. Tidak memerlukan dependency.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, extname, resolve, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = resolve(root, "public");
const errors = [];
const read = (path) => readFileSync(path, "utf8");
const fail = (message) => errors.push(message);
function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = resolve(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function checkReference(value, from, label) {
  if (!value || /^(?:https?:|data:|mailto:|tel:|javascript:|\/\/)/i.test(value)) return;
  const [pathname, fragment] = value.split("#");
  const clean = decodeURIComponent(pathname.split("?")[0]);
  let target = clean.startsWith("/") ? resolve(publicDir, "." + clean) : resolve(dirname(from), clean || ".");
  if (!clean) target = from;
  if (target !== publicDir && !target.startsWith(publicDir + sep)) {
    fail(`${label}: path keluar dari public/: ${value}`);
    return;
  }
  if (existsSync(target) && statSync(target).isDirectory()) target = resolve(target, "index.html");
  if (!existsSync(target)) {
    fail(`${label}: file tidak ditemukan: ${value}`);
    return;
  }
  if (fragment && extname(target) === ".html") {
    const ids = [...read(target).matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
    if (!ids.includes(fragment)) fail(`${label}: anchor tidak ditemukan: ${value}`);
  }
}

for (const file of walk(publicDir)) {
  const label = relative(root, file);
  if (extname(file) === ".html") {
    const content = read(file);
    const ids = [...content.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
    if (new Set(ids).size !== ids.length) fail(`${label}: ID elemen duplikat`);
    if ([...content.matchAll(/<h1\b/g)].length !== 1) fail(`${label}: harus ada satu h1`);
    for (const match of content.matchAll(/\b(?:src|href)=["']([^"']*)["']/g)) {
      checkReference(match[1], file, label);
    }
  }
  if (extname(file) === ".css") {
    for (const match of read(file).matchAll(/url\(\s*["']?([^)'"\s]+)["']?\s*\)/g)) {
      checkReference(match[1], file, label);
    }
  }
  if (extname(file) === ".js") {
    const syntax = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    if (syntax.status !== 0) fail(`${label}: ${syntax.stderr}`);
  }
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(read(resolve(publicDir, "config/site-config.js")), context);
vm.runInContext(read(resolve(publicDir, "data/dashboard-modules.js")), context);
const config = context.window.URBANLENS_CONFIG;
const modules = context.window.URBANLENS_MODULES;
const fromPublic = resolve(publicDir, "index.html");
function checkImageTree(object) {
  for (const value of Object.values(object)) {
    if (typeof value === "string") checkReference(value, fromPublic, "config gambar");
    else if (value && typeof value === "object") checkImageTree(value);
  }
}
checkImageTree(config.images);
for (const [key, url] of Object.entries({ ...config.links, ...config.dashboardMenuUrls })) {
  try {
    if (!/^https?:$/.test(new URL(url).protocol)) fail(`URL ${key}: gunakan http atau https`);
  } catch { fail(`URL ${key}: URL tidak valid`); }
}
if (!config.hero.slides.length) fail("Slider harus memiliki setidaknya satu gambar");
config.hero.slides.forEach((slide, index) => {
  checkReference(slide.src, fromPublic, `slide ${index + 1}`);
  if (!slide.title || !slide.alt) fail(`slide ${index + 1}: isi judul dan alt`);
  if (slide.values.length !== 6 || slide.values.some((n) => !Number.isFinite(n) || n < 0 || n > 100)) {
    fail(`slide ${index + 1}: isi enam persentase 0–100`);
  }
});
for (const side of ["before", "after"]) {
  checkReference(config.comparison[side].src, fromPublic, `comparison.${side}`);
}
if (!modules.length || new Set(modules.map((item) => item.slug)).size !== modules.length) {
  fail("Data menu dashboard kosong atau memiliki slug duplikat");
}
const deployment = JSON.parse(read(resolve(root, "vercel.json")));
if (deployment.outputDirectory !== "public" || !existsSync(resolve(publicDir, "index.html"))) {
  fail("Output Vercel harus menunjuk folder public/ yang berisi index.html");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`OK: 2 halaman, ${config.hero.slides.length} slide, ${modules.length} menu; konfigurasi, aset, anchor, dan sintaks JS valid.`);
