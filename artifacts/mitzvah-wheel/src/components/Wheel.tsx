import React, { useEffect, useRef, useState } from 'react';

interface WheelProps {
  items: string[];
  onSpinComplete: (item: string) => void;
  spinning: boolean;
  setSpinning: (spinning: boolean) => void;
}

// Rich, curated palette for the wheel segments
const SEGMENT_COLORS = [
  "#1a237e", // Deep Royal Blue
  "#b71c1c", // Deep Red
  "#f9a825", // Gold/Amber
  "#004d40", // Emerald Green
  "#4a148c", // Purple
  "#006064", // Teal
  "#e65100", // Burnt Orange
  "#311b92", // Deep Purple
  "#880e4f", // Magenta
  "#01579b", // Cyan
];

export function Wheel({ items, onSpinComplete, spinning, setSpinning }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  
  // Animation refs
  const requestRef = useRef<number>();
  const velocityRef = useRef(0);
  const isSpinningRef = useRef(false);
  const itemsRef = useRef(items);

  // Keep items ref synced
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const drawWheel = (ctx: CanvasRenderingContext2D, rot: number) => {
    const canvas = ctx.canvas;
    const cw = canvas.width;
    const ch = canvas.height;
    const cx = cw / 2;
    const cy = ch / 2;
    const radius = Math.min(cw, ch) / 2 - 10;

    ctx.clearRect(0, 0, cw, ch);

    const numSegments = itemsRef.current.length;
    const arc = (Math.PI * 2) / numSegments;

    // Draw shadow
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    ctx.fill();
    ctx.restore();

    for (let i = 0; i < numSegments; i++) {
      const angle = rot + i * arc;
      
      // Draw segment
      ctx.beginPath();
      ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + arc);
      ctx.lineTo(cx, cy);
      ctx.fill();

      // Draw border between segments
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#f9a825'; // Gold borders
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      
      // Dynamic font size based on number of items and text length
      const text = itemsRef.current[i];
      let fontSize = Math.max(12, Math.min(22, (radius * Math.PI) / numSegments - 4));
      if (text.length > 20) fontSize -= 4;
      
      ctx.font = `600 ${fontSize}px 'Inter', sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      
      // Truncate text if too long
      let displayText = text;
      if (ctx.measureText(displayText).width > radius - 40) {
        let maxChars = Math.floor((radius - 40) / (fontSize * 0.6));
        displayText = text.substring(0, maxChars) + '...';
      }
      
      ctx.fillText(displayText, radius - 20, 5);
      ctx.restore();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#f9a825'; // Gold center
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#1a237e';
    ctx.stroke();
    
    // Draw inner Star of David in center (simplified as two triangles)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#1a237e';
    
    // Triangle 1
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(10.4, 6);
    ctx.lineTo(-10.4, 6);
    ctx.closePath();
    ctx.fill();
    
    // Triangle 2
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(10.4, -6);
    ctx.lineTo(-10.4, -6);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
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
    
    // Random velocity between 0.3 and 0.5 (radians per frame)
    velocityRef.current = 0.3 + Math.random() * 0.2;
    
    const animate = () => {
      setRotation((prev) => {
        let next = prev + velocityRef.current;
        // Keep it nicely bounded
        return next % (Math.PI * 2);
      });
      
      // Decelerate
      velocityRef.current *= 0.985;
      
      if (velocityRef.current > 0.002) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished
        isSpinningRef.current = false;
        setSpinning(false);
        
        // Calculate result
        // The pointer is at the top (which is -PI/2 in canvas coordinates, but our drawing logic
        // might mean angle 0 is at the right. Actually, pointer is drawn in HTML above the canvas).
        // Let's say pointer is at the top (12 o'clock).
        
        const currentRotation = (rotation + velocityRef.current) % (Math.PI * 2);
        
        // Due to rotation direction and starting point, calculate winning index
        const numSegments = itemsRef.current.length;
        const arc = (Math.PI * 2) / numSegments;
        
        // The pointer is at 270 degrees (3PI/2) standard coordinate, or -PI/2.
        // We need to find which segment spans over that angle.
        // Angle of segment i is currentRotation + i * arc to currentRotation + (i+1) * arc
        
        // Normalizing the top pointer angle to our rotation space
        // The top of the wheel corresponds to an angle of 3PI/2 (270 degrees)
        const pointerAngle = (Math.PI * 1.5);
        
        let normalizedRotation = (Math.PI * 2 - (currentRotation % (Math.PI * 2))) % (Math.PI * 2);
        
        // Calculate index
        // This math aligns the pointer at top with the drawn segments
        let winningAngle = (pointerAngle + normalizedRotation) % (Math.PI * 2);
        let winIndex = Math.floor(winningAngle / arc);
        
        // Edge cases with modulo arithmetic
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
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [spinning]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square flex items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-4 z-10 w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary filter drop-shadow-md"></div>
      <div className="absolute -top-4 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[25px] border-l-transparent border-r-transparent border-t-amber-300"></div>
      
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}
