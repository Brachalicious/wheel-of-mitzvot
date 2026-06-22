import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/logo.png';

interface WheelProps {
  items: string[];
  onSpinComplete: (item: string) => void;
  spinning: boolean;
  setSpinning: (spinning: boolean) => void;
  onLogoClick?: () => void;
}

function getRainbowColor(index: number, total: number): string {
  const hue = (index / total) * 360;
  return `hsl(${hue}, 90%, 52%)`;
}

export function Wheel({ items, onSpinComplete, spinning, setSpinning, onLogoClick }: WheelProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(0);

  const requestRef      = useRef<number>();
  const velocityRef     = useRef(0);
  const isSpinningRef   = useRef(false);
  const itemsRef        = useRef(items);
  const rotationRef     = useRef(rotation);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // ── Draw ──────────────────────────────────────────────────────────────────
  const sizeAndDraw = (rot: number) => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = wrapper.clientWidth;
    if (s === 0) return;
    setSize(s);

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = s * dpr;
    canvas.height = s * dpr;
    canvas.style.width  = `${s}px`;
    canvas.style.height = `${s}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawWheel(ctx, s, rot);
  };

  const drawWheel = (ctx: CanvasRenderingContext2D, s: number, rot: number) => {
    const cx = s / 2;
    const cy = s / 2;
    const radius = s / 2 - 6;

    ctx.clearRect(0, 0, s, s);

    const numSegments = itemsRef.current.length;
    if (numSegments === 0) return;
    const arc = (Math.PI * 2) / numSegments;

    // Outer shadow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur  = 16;
    ctx.fillStyle   = 'rgba(0,0,0,0.08)';
    ctx.fill();
    ctx.restore();

    // Segments
    for (let i = 0; i < numSegments; i++) {
      const startAngle = rot + i * arc;
      const endAngle   = startAngle + arc;
      const color      = getRainbowColor(i, numSegments);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();
      ctx.restore();

      // Label
      const midAngle = startAngle + arc / 2;
      const label    = itemsRef.current[i];
      const fontSize = Math.max(8, Math.min(13, s / 55));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(midAngle);
      ctx.textAlign    = 'right';
      ctx.fillStyle    = 'rgba(255,255,255,0.92)';
      ctx.font         = `600 ${fontSize}px system-ui, sans-serif`;
      ctx.shadowColor  = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur   = 3;

      const textR  = radius - 10;
      const maxW   = textR * 0.82;
      const text   = label.length > 32 ? label.slice(0, 30) + '…' : label;
      ctx.fillText(text, textR, fontSize / 3, maxW);
      ctx.restore();
    }

    // Hub ring only (no star — logo overlaid in HTML)
    const hubR = Math.max(55, s * 0.22);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(26, 35, 126, 0.85)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur  = 12;
    ctx.fill();
    ctx.restore();
  };

  // ── ResizeObserver ─────────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const ro = new ResizeObserver(() => sizeAndDraw(rotationRef.current));
    ro.observe(wrapper);
    sizeAndDraw(rotationRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { sizeAndDraw(rotation); }, [items, rotation]);

  // ── Spin ───────────────────────────────────────────────────────────────────
  const spin = () => {
    if (isSpinningRef.current) return;
    setSpinning(true);
    isSpinningRef.current = true;
    velocityRef.current = 0.32 + Math.random() * 0.22;

    const animate = () => {
      setRotation((prev) => {
        const next = (prev + velocityRef.current) % (Math.PI * 2);
        rotationRef.current = next;
        return next;
      });

      velocityRef.current *= 0.984;

      if (velocityRef.current > 0.002) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        isSpinningRef.current = false;
        setSpinning(false);

        const currentRotation = rotationRef.current;
        const numSegments     = itemsRef.current.length;
        const arc             = (Math.PI * 2) / numSegments;
        const pointerAngle    = Math.PI * 1.5;
        const normalizedRot   = (Math.PI * 2 - (currentRotation % (Math.PI * 2))) % (Math.PI * 2);
        const winningAngle    = (pointerAngle + normalizedRot) % (Math.PI * 2);
        let   winIndex        = Math.floor(winningAngle / arc);
        if (winIndex >= numSegments) winIndex = 0;
        onSpinComplete(itemsRef.current[winIndex]);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (spinning && !isSpinningRef.current) spin();
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [spinning]);

  // Hub logo size: 22% of wheel diameter
  const hubDiameter = size * 0.44;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* Pointer */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center drop-shadow-lg pointer-events-none">
        <div style={{
          width: 0, height: 0,
          borderLeft:  '18px solid transparent',
          borderRight: '18px solid transparent',
          borderTop:   '36px solid #1a237e',
        }} />
        <div style={{
          width: 0, height: 0,
          borderLeft:  '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop:   '28px solid #fbbf24',
          marginTop: '-34px',
        }} />
      </div>

      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', touchAction: 'none' }}
      />

      {/* Logo overlay — centred on hub, clickable */}
      {size > 0 && (
        <button
          onClick={onLogoClick}
          title="Chat with your Mitzvah Guide"
          className="absolute z-20 rounded-full overflow-hidden focus:outline-none"
          style={{
            width:  hubDiameter,
            height: hubDiameter,
            top:    (size - hubDiameter) / 2,
            left:   (size - hubDiameter) / 2 - size * 0.025,
          }}
        >
          <img
            src={logo}
            alt="MysticMinded33 — open Mitzvah Guide chat"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </button>
      )}
    </div>
  );
}
