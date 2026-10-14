"use strict";
// Reads image dimensions from file headers (PNG, JPEG, WebP, GIF, SVG) with no
// dependencies, so the build can emit width/height and avoid layout shift.
const fs = require("fs");

function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const length = buf.readUInt16BE(i + 2);
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isSof) return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    i += 2 + length;
  }
  return null;
}

function webpSize(buf) {
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8 ") {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (chunk === "VP8X") {
    return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  }
  return null;
}

function svgSize(text) {
  const tag = (text.match(/<svg\b[^>]*>/i) || [""])[0];
  const num = (name) => {
    const m = tag.match(new RegExp(`\\b${name}="([\\d.]+)(px)?"`, "i"));
    return m ? Math.round(parseFloat(m[1])) : null;
  };
  const width = num("width");
  const height = num("height");
  if (width && height) return { width, height };
  const viewBox = tag.match(/viewBox="[\d.\-]+[\s,]+[\d.\-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/i);
  return viewBox ? { width: Math.round(+viewBox[1]), height: Math.round(+viewBox[2]) } : null;
}

/** Returns { width, height } or null when the format is unknown. */
function imageSize(file) {
  const buf = fs.readFileSync(file);
  if (buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) return jpegSize(buf);
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return webpSize(buf);
  if (buf.toString("ascii", 0, 3) === "GIF") return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  if (/\.svg$/i.test(file)) return svgSize(buf.toString("utf8", 0, Math.min(buf.length, 4096)));
  return null;
}

module.exports = { imageSize };
