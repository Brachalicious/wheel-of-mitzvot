import { useEffect, useRef, useState } from 'react';

interface WheelProps {
  items: string[];
  onSpinComplete: (item: string) => void;
  spinning: boolean;
  setSpinning: (spinning: boolean) => void;
}

function getRainbowColor(index: number, total: number): string {
  const hue = (index / total) * 360;
  return `hsl(${hue}, 90%, 52%)`;
}

export function Wheel({ items, onSpinComplete, spinning, setSpinning }: WheelProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);

  const requestRef      = useRef<number>();
  const velocityRef     = useRef(0);
  const isSpinningRef   = useRef(false);
  const itemsRef        = useRef(items);
  const rotationRef     = useRef(rotation);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // ── Resize canvas to match wrapper, then redraw ──────────────────────────
  const sizeAndDraw = (rot: number) => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = wrapper.clientWidth;
    if (size === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawWheel(ctx, size, rot);
  };

  const drawWheel = (ctx: CanvasRenderingContext2D, size: number, rot: number) => {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 6;

    ctx.clearRect(0, 0, size, size);

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
      const fontSize = Math.max(8, Math.min(13, size / 55));

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

    // Hub
    const hubR = Math.max(18, size * 0.065);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
    ctx.fillStyle = '#1a237e';
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur  = 8;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth   = 2;
    ctx.stroke();
    ctx.restore();

    // Star of David in hub
    const starSize = hubR * 0.55;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#fbbf24';
    const tri = (flip: boolean) => {
      ctx.beginPath();
      ctx.moveTo(0, flip ? starSize : -starSize);
      ctx.lineTo( starSize * 0.87, flip ? -starSize * 0.5 :  starSize * 0.5);
      ctx.lineTo(-starSize * 0.87, flip ? -starSize * 0.5 :  starSize * 0.5);
      ctx.closePath();
      ctx.fill();
    };
    tri(false);
    tri(true);
    ctx.restore();
  };

  // ── ResizeObserver keeps canvas sharp on any resize ──────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ro = new ResizeObserver(() => sizeAndDraw(rotationRef.current));
    ro.observe(wrapper);
    sizeAndDraw(rotationRef.current);

    return () => ro.disconnect();
  }, []);

  // ── Redraw whenever items or rotation changes ────────────────────────────
  useEffect(() => {
    sizeAndDraw(rotation);
  }, [items, rotation]);

  // ── Spin logic ────────────────────────────────────────────────────────────
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
    </div>
  );
}
