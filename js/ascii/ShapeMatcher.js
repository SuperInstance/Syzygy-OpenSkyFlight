/**
 * ───────────────────────────────────────────────────────────────────────────
 *  SHAPE-VECTOR CHARACTER MATCHING — Phase A
 * ───────────────────────────────────────────────────────────────────────────
 * 
 * Based on alexharri's "ASCII characters are not pixels" (2026-01-17).
 * 
 * Instead of mapping luminance → character via a density ramp, we treat
 * characters as SHAPES:
 *   1. Precompute a 6D shape vector per character (ink overlap in 6 circles)
 *   2. Per cell, sample the same 6 circles from the image
 *   3. Apply global crunch (contrast enhancement)
 *   4. Nearest-neighbor lookup via quantized cache
 * 
 * Result: characters follow contours, not brightness. Far higher effective
 * resolution than any density ramp.
 */

// 6 sampling circles: 2×3 grid, staggered to capture shape.
// Positions in cell coordinates (0-1), radius ~0.22.
const CIRCLES = [
  { x: 0.30, y: 0.22, r: 0.22 },  // top-left
  { x: 0.70, y: 0.22, r: 0.22 },  // top-right
  { x: 0.30, y: 0.50, r: 0.22 },  // mid-left
  { x: 0.70, y: 0.50, r: 0.22 },  // mid-right
  { x: 0.30, y: 0.78, r: 0.22 },  // bot-left
  { x: 0.70, y: 0.78, r: 0.22 },  // bot-right
];

// Curated alphabet: shapes that matter for terrain/contours.
// Ordered by visual complexity, not density.
const ALPHABET = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export class ShapeMatcher {
  constructor() {
    this.vectors = null;      // Float32Array: [numChars * 6]
    this.chars = [];
    this.cache = new Map();   // quantized 18-bit key -> char index
    this.crunch = 2.0;        // global crunch power
  }
  
  /**
   * Precompute shape vectors by rendering each character to a bitmap.
   * Call once at startup. Uses an offscreen canvas.
   */
  build(font = '20px monospace') {
    const cellW = 20, cellH = 40;
    const canvas = document.createElement('canvas');
    canvas.width = cellW;
    canvas.height = cellH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const numChars = ALPHABET.length;
    const raw = new Float32Array(numChars * 6);
    
    for (let c = 0; c < numChars; c++) {
      const ch = ALPHABET[c];
      // Render character: white on black, centered.
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cellW, cellH);
      ctx.fillStyle = '#fff';
      ctx.font = font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ch, cellW / 2, cellH / 2 + 2);
      
      const img = ctx.getImageData(0, 0, cellW, cellH).data;
      
      // For each circle, compute ink overlap fraction.
      for (let s = 0; s < 6; s++) {
        const circle = CIRCLES[s];
        const cx = circle.x * cellW;
        const cy = circle.y * cellH;
        const r = circle.r * Math.min(cellW, cellH);
        
        let inside = 0, ink = 0;
        // Sample points in the circle's bounding box.
        const steps = 8;
        for (let dy = -steps; dy <= steps; dy++) {
          for (let dx = -steps; dx <= steps; dx++) {
            const px = cx + (dx / steps) * r;
            const py = cy + (dy / steps) * r;
            const dist = Math.hypot(dx / steps, dy / steps);
            if (dist > 1) continue;
            
            inside++;
            const ix = Math.max(0, Math.min(cellW - 1, Math.round(px)));
            const iy = Math.max(0, Math.min(cellH - 1, Math.round(py)));
            const o = (iy * cellW + ix) * 4;
            // Ink = bright pixel (we drew white on black).
            if (img[o] > 128) ink++;
          }
        }
        raw[c * 6 + s] = inside > 0 ? ink / inside : 0;
      }
    }
    
    // Normalize each component by max across all characters.
    // (Otherwise vectors cluster near origin and lookups collapse.)
    const maxes = new Float32Array(6);
    for (let s = 0; s < 6; s++) {
      let m = 0;
      for (let c = 0; c < numChars; c++) {
        m = Math.max(m, raw[c * 6 + s]);
      }
      maxes[s] = m > 0 ? m : 1;
    }
    
    this.vectors = new Float32Array(numChars * 6);
    for (let c = 0; c < numChars; c++) {
      for (let s = 0; s < 6; s++) {
        this.vectors[c * 6 + s] = raw[c * 6 + s] / maxes[s];
      }
    }
    
    this.chars = ALPHABET.split('');
    this.numChars = numChars;
    this.maxes = maxes;
  }
  
  /**
   * Sample the 6 circles from a HIGH-RES luminance buffer.
   * 
   * lum: Float32Array at (srcCols × srcRows) — higher res than the ASCII grid.
   * The ASCII cell (cx, cy) covers a region in the source buffer.
   * Each circle samples multiple points within its area and averages.
   * 
   * This is the key: we get SUB-CELL shape information, which is what
   * makes shape-vectors beat density ramps.
   */
  sampleCell(lum, srcCols, srcRows, cx, cy, cols, rows) {
    const vec = new Float32Array(6);
    
    // ASCII cell (cx, cy) covers this region in source coordinates:
    const x0 = (cx / cols) * srcCols;
    const x1 = ((cx + 1) / cols) * srcCols;
    const y0 = (cy / rows) * srcRows;
    const y1 = ((cy + 1) / rows) * srcRows;
    const cellSrcW = x1 - x0;
    const cellSrcH = y1 - y0;
    
    for (let s = 0; s < 6; s++) {
      const circle = CIRCLES[s];
      // Circle center in source coordinates:
      const ccx = x0 + circle.x * cellSrcW;
      const ccy = y0 + circle.y * cellSrcH;
      const r = circle.r * Math.min(cellSrcW, cellSrcH);
      
      // Sample 3×3 points in the circle, average.
      let sum = 0, count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const px = ccx + (dx / 1.5) * r * 0.5;
          const py = ccy + (dy / 1.5) * r * 0.5;
          const dist = Math.hypot(dx, dy) / 1.5;
          if (dist > 1) continue;
          
          const ix = Math.max(0, Math.min(srcCols - 1, Math.round(px)));
          const iy = Math.max(0, Math.min(srcRows - 1, Math.round(py)));
          sum += lum[iy * srcCols + ix];
          count++;
        }
      }
      vec[s] = count > 0 ? sum / count : 0;
    }
    
    return vec;
  }
  
  /**
   * Global crunch: normalize by max, raise to power, denormalize.
   * Exaggerates shape boundaries; barely affects uniform vectors.
   */
  crunch(vec) {
    let max = 0;
    for (let s = 0; s < 6; s++) max = Math.max(max, vec[s]);
    if (max < 1e-6) return vec;
    
    const out = new Float32Array(6);
    for (let s = 0; s < 6; s++) {
      const n = vec[s] / max;
      out[s] = Math.pow(n, this.crunch) * max;
    }
    return out;
  }
  
  /**
   * Quantize a 6D vector to an 18-bit cache key (3 bits per component).
   */
  quantize(vec) {
    let key = 0;
    for (let s = 0; s < 6; s++) {
      const q = Math.max(0, Math.min(7, Math.round(vec[s] * 7)));
      key = (key << 3) | q;
    }
    return key;
  }
  
  /**
   * Find the best character for a 6D sampling vector.
   * Uses quantized cache; falls back to brute-force nearest neighbor.
   */
  match(vec) {
    const crunched = this.crunch(vec);
    const key = this.quantize(crunched);
    
    if (this.cache.has(key)) {
      return this.chars[this.cache.get(key)];
    }
    
    // Brute-force: minimum squared Euclidean distance.
    let best = 0, bestDist = Infinity;
    for (let c = 0; c < this.numChars; c++) {
      let dist = 0;
      for (let s = 0; s < 6; s++) {
        const d = crunched[s] - this.vectors[c * 6 + s];
        dist += d * d;
      }
      if (dist < bestDist) {
        bestDist = dist;
        best = c;
      }
    }
    
    this.cache.set(key, best);
    // Bound cache size (LRU would be better, but this is fine for now).
    if (this.cache.size > 50000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    return this.chars[best];
  }
  
  /**
   * Clear the cache (e.g., when crunch parameter changes).
   */
  clearCache() {
    this.cache.clear();
  }
}
