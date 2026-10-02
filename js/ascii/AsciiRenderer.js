/**
 * ───────────────────────────────────────────────────────────────────────────
 *  ASCII RENDERER — the flight sim learns to dream in text
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Samples the WebGPU canvas and renders it as text. The ASCII is a lens,
 * not a limitation — the 3D world stays at full fidelity underneath.
 *
 * Three render modes:
 *   '3d'       — full WebGPU, no ASCII (default)
 *   'ascii'    — full-screen text, the sim plays in the ASCII world
 *   'split'    — side-by-side (desktop) or stacked (mobile)
 *
 * Character selection learns from the research:
 * - Glyphion's 20-step gradient for smooth depth gradation
 * - Edge-aware: characters follow the geometry (ridges get /, cliffs get |)
 * - Density follows depth: near = dense, far = sparse (ASCII city)
 *
 * The telemetry modulates the render: altitude, speed, and bank angle
 * shift the character mapping, because the eyes adapt to the flight.
 */

// Glyphion's 20-step gradient — finer than the classic 10-step.
const RAMP_20 = " .:'-~=<\\*({[%08O#@Q&";
const RAMP_10 = ' .:-=+*#%@';

// Edge-aware characters: chosen by gradient direction.
const EDGE_CHARS = {
  horizontal: '-=',
  vertical: '|!',
  diagDown: '\\',
  diagUp: '/',
};

export class AsciiRenderer {
  constructor(webgpuCanvas, preElement) {
    this.canvas = webgpuCanvas;
    this.pre = preElement;
    this.off = document.createElement('canvas');
    this.octx = this.off.getContext('2d', { willReadFrequently: true });
    
    this.mode = '3d'; // '3d' | 'ascii' | 'split'
    this.running = false;
    this.raf = 0;
    
    // Live params — the perception policy writes these.
    this.params = {
      cols: 110,        // 20–240: the resolution knob
      fps: 12,          // target frame rate
      contrast: 1.2,
      brightness: 0,
      gamma: 1.0,
      edgeAware: true,  // use directional characters for edges
      ramp: 'fine',     // 'fine' (20-step) or 'classic' (10-step)
    };
    
    // Telemetry — written by the flight loop.
    this.telemetry = {
      altitudeAgl: 0,   // above ground level (m)
      speed: 0,         // m/s
      bank: 0,          // bank angle (radians)
    };
    
    this._lastT = 0;
    this._emaFps = 12;
  }
  
  setMode(mode) {
    this.mode = mode;
    const show3d = mode === '3d' || mode === 'split';
    const showAscii = mode === 'ascii' || mode === 'split';
    
    // Toggle visibility
    this.canvas.style.display = show3d ? '' : 'none';
    this.pre.style.display = showAscii ? '' : 'none';
    
    // Layout for split mode
    if (mode === 'split') {
      const isMobile = matchMedia('(pointer:coarse)').matches;
      if (isMobile) {
        // Stacked: 3D on top, ASCII below
        this.canvas.style.width = '100%';
        this.canvas.style.height = '50%';
        this.pre.style.height = '50%';
      } else {
        // Side-by-side
        this.canvas.style.width = '50%';
        this.canvas.style.height = '100%';
        this.pre.style.width = '50%';
      }
    } else {
      this.canvas.style.width = '';
      this.canvas.style.height = '';
      this.pre.style.width = '';
      this.pre.style.height = '';
    }
    
    // Start/stop the sampler
    if (showAscii && !this.running) this.start();
    if (!showAscii && this.running) this.stop();
    
    // Notify the renderer to resize
    window.dispatchEvent(new Event('resize'));
  }
  
  start() {
    if (this.running) return;
    this.running = true;
    this._lastT = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.render(now);
    };
    this.raf = requestAnimationFrame(loop);
  }
  
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  
  render(now) {
    try {
      const fps = this.params.fps || 12;
      if (now - this._lastT < 1000 / fps - 1) return;
      const dtMs = now - this._lastT;
      this._lastT = now;
      if (dtMs > 0) this._emaFps += (1000 / dtMs - this._emaFps) * 0.08;
      
      const w = this.canvas.clientWidth || this.canvas.width || 2;
      const h = this.canvas.clientHeight || this.canvas.height || 2;
      
      // Telemetry-adaptive columns: fast = chunky, slow = fine.
      // (The perception policy can override this.)
      let cols = Math.round(this.params.cols);
      const speed = this.telemetry.speed || 0;
      if (speed > 100) cols = Math.max(20, cols - 20); // fast: drop detail for fps
      
      cols = Math.max(20, Math.min(240, cols));
      const rows = Math.max(8, Math.round((cols * h) / Math.max(1, w) * 0.5));
      
      if (this.off.width !== cols || this.off.height !== rows) {
        this.off.width = cols;
        this.off.height = rows;
      }
      this.octx.drawImage(this.canvas, 0, 0, cols, rows);
      const px = this.octx.getImageData(0, 0, cols, rows).data;
      
      const ramp = this.params.ramp === 'fine' ? RAMP_20 : RAMP_10;
      const n = ramp.length;
      const contrast = this.params.contrast;
      const bright = this.params.brightness;
      const gamma = this.params.gamma;
      
      // Telemetry modulation: altitude shifts the brightness curve.
      // Low = contrast up (ground detail matters). High = haze (soften).
      const agl = this.telemetry.altitudeAgl || 0;
      const altFactor = agl < 500 ? 1.15 : agl > 5000 ? 0.85 : 1.0;
      
      const lines = [];
      for (let y = 0; y < rows; y++) {
        let row = '';
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 4;
          const r = px[o], g = px[o+1], b = px[o+2];
          let v = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          
          // Apply contrast, brightness, gamma, altitude.
          v = (v - 0.5) * contrast * altFactor + 0.5 + bright;
          v = v < 0 ? 0 : v > 1 ? 1 : v;
          if (gamma !== 1) v = Math.pow(v, gamma);
          
          let ch;
          if (this.params.edgeAware && x > 0 && y > 0 && x < cols-1 && y < rows-1) {
            // Sobel edge detection — cheap at low res.
            // Sample neighbors for gradient.
            const xm = (y * cols + (x-1)) * 4, xp = (y * cols + (x+1)) * 4;
            const ym = ((y-1) * cols + x) * 4, yp = ((y+1) * cols + x) * 4;
            const gx = (0.299*px[xp] + 0.587*px[xp+1] + 0.114*px[xp+2] -
                        0.299*px[xm] - 0.587*px[xm+1] - 0.114*px[xm+2]) / 255;
            const gy = (0.299*px[yp] + 0.587*px[yp+1] + 0.114*px[yp+2] -
                        0.299*px[ym] - 0.587*px[ym+1] - 0.114*px[ym+2]) / 255;
            const mag = Math.hypot(gx, gy);
            
            if (mag > 0.25) {
              // Strong edge: pick a directional character.
              const ang = Math.atan2(gy, gx);
              const deg = Math.abs(ang * 180 / Math.PI);
              if (deg < 22.5 || deg > 157.5) ch = '|';
              else if (deg < 67.5) ch = '/';
              else if (deg < 112.5) ch = '-';
              else ch = '\\';
            } else {
              // No edge: use the ramp.
              const idx = Math.min(n - 1, (v * n) | 0);
              ch = ramp[idx];
            }
          } else {
            const idx = Math.min(n - 1, (v * n) | 0);
            ch = ramp[idx];
          }
          row += ch;
        }
        lines.push(row);
      }
      this.pre.textContent = lines.join('\n');
    } catch {
      // The sampler never kills the flight.
    }
  }
  
  get fps() { return this._emaFps; }
}
