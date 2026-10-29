import React, { useRef, useState, useEffect } from 'react';
import { PenTool, RotateCcw, Check, Type, Edit3 } from 'lucide-react';

interface SignaturePadProps {
  onSaveSignature: (signatureDataUrl: string) => void;
  initialSignature?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSaveSignature,
  initialSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(initialSignature));
  const [signMode, setSignMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState<'cursive' | 'serif'>('cursive');

  // Canvas drawing handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set line attributes
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialSignature && initialSignature.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature, signMode]);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveDrawnSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSaveSignature('');
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
  };

  const generateTypedSignature = (name: string, font: 'cursive' | 'serif') => {
    if (!name.trim()) {
      onSaveSignature('');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f172a';
    ctx.font = font === 'cursive' ? 'italic 34px "Brush Script MT", "Segoe Script", cursive' : '30px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL('image/png');
    onSaveSignature(dataUrl);
    setHasDrawn(true);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
      {/* Top Controls: Draw or Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setSignMode('draw')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 font-semibold transition-all ${
              signMode === 'draw' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Draw Signature</span>
          </button>
          <button
            type="button"
            onClick={() => setSignMode('type')}
            className={`px-3 py-1 rounded-lg flex items-center space-x-1 font-semibold transition-all ${
              signMode === 'type' ? 'bg-orange-500 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Type Signature</span>
          </button>
        </div>

        {signMode === 'draw' && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Signature Canvas Area */}
      {signMode === 'draw' ? (
        <div className="relative bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={450}
            height={130}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-32 touch-none block"
          />

          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-300 text-xs font-medium">
              <Edit3 className="w-4 h-4 mr-1.5 opacity-50" />
              <span>Sign your name here with finger or mouse</span>
            </div>
          )}

          <div className="absolute bottom-1 right-2 pointer-events-none text-[9px] text-slate-400 font-mono">
            Digital Signature Pad
          </div>
        </div>
      ) : (
        /* Type Signature Mode */
        <div className="space-y-2">
          <input
            type="text"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
              generateTypedSignature(e.target.value, selectedFont);
            }}
            placeholder="Type your full legal name to create digital signature..."
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {typedName && (
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 block mb-1">Generated Signature Preview:</span>
              <div
                className={`text-2xl text-slate-900 ${
                  selectedFont === 'cursive' ? 'font-serif italic tracking-wider' : 'font-serif'
                }`}
                style={{ fontFamily: selectedFont === 'cursive' ? 'cursive, "Brush Script MT"' : 'Georgia, serif' }}
              >
                {typedName}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center text-emerald-600 font-medium">
          <Check className="w-3.5 h-3.5 mr-1" />
          Legally binding digital acknowledgment for vehicle handover & insurance
        </span>
      </div>
    </div>
  );
};
