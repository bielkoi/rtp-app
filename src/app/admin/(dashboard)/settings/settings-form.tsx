"use client";

import { useActionState, useState } from "react";
import { updateAppSettings, type SettingsFormState } from "@/app/actions/settings";
import type { AppSettings } from "@/lib/randomData";

interface Props {
  initial: AppSettings;
}

export default function SettingsForm({ initial }: Props) {
  const [state, formAction, pending] = useActionState(
    updateAppSettings,
    undefined as SettingsFormState | undefined
  );

  const [interval, setInterval] = useState(initial.refreshIntervalMinutes);
  const [rtpMin, setRtpMin] = useState(initial.rtpMin);
  const [rtpMax, setRtpMax] = useState(initial.rtpMax);

  return (
    <form action={formAction} className="bg-zinc-900/50 border border-red-600/20 rounded-2xl p-6 max-w-xl">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-white">
          Interval Refresh RTP
        </p>
        <span className="text-sm font-black tracking-tight text-white font-mono">
          {interval} {interval === 1 ? "menit" : "menit"}
        </span>
      </div>

      <SingleRangeSlider
        min={1}
        max={60}
        value={interval}
        onChange={setInterval}
      />

      <input type="hidden" name="refresh_interval_minutes" value={interval} />

      <p className="text-[10px] text-zinc-500 mt-3">
        Semua user akan lihat RTP yang sama dalam jendela interval ini. Min 1, max 60 menit.
      </p>

      <div className="border-t border-zinc-800 my-5" />

      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-white">
          Range Nilai RTP
        </p>
        <span className="text-sm font-black tracking-tight text-white font-mono">
          {rtpMin}% – {rtpMax}%
        </span>
      </div>

      <DualRangeSlider
        min={0}
        max={100}
        valueMin={rtpMin}
        valueMax={rtpMax}
        onChange={(min, max) => {
          setRtpMin(min);
          setRtpMax(max);
        }}
      />

      <input type="hidden" name="rtp_min" value={rtpMin} />
      <input type="hidden" name="rtp_max" value={rtpMax} />

      <p className="text-[10px] text-zinc-500 mt-3">
        Geser kedua thumb pada slider. RTP yang muncul di publik akan dirandom antara batas ini.
      </p>

      {state?.error && (
        <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-lg px-3 py-2">
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono rounded-lg px-3 py-2">
          Tersimpan. Halaman publik akan pakai setting baru.
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={pending}
          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

function SingleRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  return (
    <div className="rtp-slider relative h-5 w-full">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-800" />
      <div
        className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-red-500"
        style={{ width: `${percent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Refresh interval"
      />
    </div>
  );
}

function DualRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
}) {
  const minPercent = ((valueMin - min) / (max - min)) * 100;
  const maxPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="rtp-slider relative h-5 w-full">
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-zinc-800" />
      <div
        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-red-500"
        style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valueMin}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v < valueMax) onChange(v, valueMax);
        }}
        aria-label="RTP minimum"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valueMax}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (v > valueMin) onChange(valueMin, v);
        }}
        aria-label="RTP maximum"
      />
    </div>
  );
}
