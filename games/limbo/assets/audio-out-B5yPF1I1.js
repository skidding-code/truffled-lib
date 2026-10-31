var e=32768;function t(e=48e3){let t=new SharedArrayBuffer(1048832);return new Int32Array(t,0,64)[60]=e,t}var n=`
const SLOTS = 4, CAP = ${e}, HEADER = 64;
const PRIME = 2048, TARGET = 4096, MAX = 12288;
class GexAudioRing extends AudioWorkletProcessor {
  constructor(o) {
    super();
    const ring = o.processorOptions.ring;
    this.h = new Int32Array(ring, 0, HEADER);
    this.d = new Float32Array(ring, HEADER * 4);
    this.primed = new Array(SLOTS).fill(false);
  }
  process(_inputs, outputs) {
    const out = outputs[0];
    const L = out[0], R = out[1] || out[0];
    const n = L.length;
    L.fill(0);
    if (R !== L) R.fill(0);
    for (let s = 0; s < SLOTS; s++) {
      const w = Atomics.load(this.h, s * 4);
      let r = Atomics.load(this.h, s * 4 + 1);
      let avail = w - r;
      if (!this.primed[s]) {
        if (avail < PRIME) continue;
        this.primed[s] = true;
      }
      if (avail > MAX) { r = w - TARGET; avail = TARGET; }
      const m = Math.min(n, avail);
      const base = s * CAP * 2;
      for (let i = 0; i < m; i++) {
        const at = base + (((r + i) & (CAP - 1)) << 1);
        L[i] += this.d[at];
        if (R !== L) R[i] += this.d[at + 1];
      }
      if (m < n) this.primed[s] = false;
      Atomics.store(this.h, s * 4 + 1, r + m);
    }
    return true;
  }
}
registerProcessor('gex-audio-ring', GexAudioRing);
`;function r(){let e;try{e=new AudioContext({latencyHint:`interactive`})}catch{return t()}let r=t(e.sampleRate);new Int32Array(r,0,64)[60]=e.sampleRate;let i=URL.createObjectURL(new Blob([n],{type:`text/javascript`}));e.audioWorklet.addModule(i).then(()=>{new AudioWorkletNode(e,`gex-audio-ring`,{numberOfInputs:0,outputChannelCount:[2],processorOptions:{ring:r}}).connect(e.destination)}).catch(e=>console.warn(`[gex] audio: ${e?.message??e}`));let a=()=>{e.state!==`running`&&e.resume()};return addEventListener(`pointerdown`,a,!0),addEventListener(`keydown`,a,!0),globalThis.__gexAudio=e,r}export{r as startAudio};