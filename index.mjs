import os from "os";
import fs from "fs";
import { exec } from "child_process";
import https from "https";

const homedir = os.homedir();
const instapaperToken = JSON.parse(
  fs.readFileSync(`${os.homedir()}/.instapaper-token.json`, "utf-8")
);

const postUrlToInstapaper = url => {
  const apiUrl = `https://www.instapaper.com/api/add?url=${url}&username=${instapaperToken.username}&password={instapaperToken.password}`;
  https.get(apiUrl);
};

exec("/usr/local/bin/pbpaste-html", (err, stdout, stderr) => {
  const links = new RegExp(/href\s*=\s*(['"])(https?:\/\/.+?)\1/, "gi");
  const urls = Array.from(stdout.matchAll(links)).map(x => x[2]);
  Array.from(new Set(urls)).forEach(x => postUrlToInstapaper(x));
  console.log(`${urls.length} sent to Instapaper`);
});
