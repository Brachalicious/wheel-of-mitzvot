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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  const requestRef = useRef<number>();
  const velocityRef = useRef(0);
  const isSpinningRef = useRef(false);
  const itemsRef = useRef(items);
  const rotationRef = useRef(rotation);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const drawWheel = (ctx: CanvasRenderingContext2D, rot: number) => {
    const canvas = ctx.canvas;
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = Math.min(cw, ch) / 2 - 6;

    ctx.clearRect(0, 0, cw, ch);

    const numSegments = itemsRef.current.length;
    if (numSegments === 0) return;
    const arc = (Math.PI * 2) / numSegments;

    // Outer glow / shadow ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fill();
    ctx.restore();

    // Draw rainbow segments
    for (let i = 0; i < numSegments; i++) {
      const angle = rot + i * arc;
      const color = getRainbowColor(i, numSegments);

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // White segment dividers
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.stroke();
    }

    // Outer ring border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.stroke();

    // Text labels
    for (let i = 0; i < numSegments; i++) {
      const angle = rot + i * arc;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';

      const text = itemsRef.current[i];
      const segArcLength = (radius * Math.PI * 2) / numSegments;
      let fontSize = Math.max(10, Math.min(18, segArcLength / 3.2));
      if (text.length > 22) fontSize = Math.max(10, fontSize - 3);

      ctx.font = `700 ${fontSize}px 'Inter', sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 5;

      const maxWidth = radius * 0.72;
      let displayText = text;
      while (ctx.measureText(displayText).width > maxWidth && displayText.length > 4) {
        displayText = displayText.slice(0, -4) + '...';
      }

      ctx.fillText(displayText, radius - 14, fontSize * 0.35);
      ctx.restore();
    }

    // Center hub — white circle with rainbow gradient ring
    const hubRadius = 34;
    const hubGrad = ctx.createRadialGradient(cx, cy, hubRadius * 0.2, cx, cy, hubRadius);
    hubGrad.addColorStop(0, '#ffffff');
    hubGrad.addColorStop(1, '#f0f0f0');

    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = hubGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Thin rainbow ring around hub
    const ringSteps = 360;
    for (let s = 0; s < ringSteps; s++) {
      const a1 = (s / ringSteps) * Math.PI * 2;
      const a2 = ((s + 1) / ringSteps) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, hubRadius + 1, a1, a2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = `hsl(${(s / ringSteps) * 360}, 90%, 55%)`;
      ctx.stroke();
    }

    // Star of David in hub
    ctx.save();
    ctx.translate(cx, cy);

    const starColor = '#1a237e';
    const starSize = 11;

    ctx.fillStyle = starColor;

    // Triangle pointing up
    ctx.beginPath();
    ctx.moveTo(0, -starSize);
    ctx.lineTo(starSize * 0.87, starSize * 0.5);
    ctx.lineTo(-starSize * 0.87, starSize * 0.5);
    ctx.closePath();
    ctx.fill();

    // Triangle pointing down
    ctx.beginPath();
    ctx.moveTo(0, starSize);
    ctx.lineTo(starSize * 0.87, -starSize * 0.5);
    ctx.lineTo(-starSize * 0.87, -starSize * 0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    drawWheel(ctx, rotation);
  }, [items, rotation]);

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
        const numSegments = itemsRef.current.length;
        const arc = (Math.PI * 2) / numSegments;
        const pointerAngle = Math.PI * 1.5;
        const normalizedRotation = (Math.PI * 2 - (currentRotation % (Math.PI * 2))) % (Math.PI * 2);
        let winningAngle = (pointerAngle + normalizedRotation) % (Math.PI * 2);
        let winIndex = Math.floor(winningAngle / arc);
        if (winIndex >= numSegments) winIndex = 0;

        onSpinComplete(itemsRef.current[winIndex]);
      }
    };

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (spinning && !isSpinningRef.current) {
      spin();
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [spinning]);

  return (
    <div className="relative w-full mx-auto aspect-square flex items-center justify-center">
      {/* Pointer arrow */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center drop-shadow-lg">
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '18px solid transparent',
            borderRight: '18px solid transparent',
            borderTop: '36px solid #1a237e',
          }}
        />
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '28px solid #fbbf24',
            marginTop: '-34px',
          }}
        />
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
