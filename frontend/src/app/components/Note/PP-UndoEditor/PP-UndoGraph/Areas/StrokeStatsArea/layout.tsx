"use client";

import { useAtom } from "jotai";
import { strokePressureInfoAtom } from "@/app/hooks";
import { strokeTimeInfoAtom } from "@/app/hooks/atoms/note";
import { useEffect, useState } from "react";
import "../area.css";

interface StrokeStats {
  totalStrokes: number;
  avgDrawTime: number;
  maxPressure: number;
  minPressure: number;
  totalDistance: number;
  pressureBuckets: number[];
}

export default function StrokeStatsArea() {
  const [strokePressureInfo] = useAtom(strokePressureInfoAtom);
  const [strokeTimeInfo] = useAtom(strokeTimeInfoAtom);
  const [stats, setStats] = useState<StrokeStats>({
    totalStrokes: 0,
    avgDrawTime: 0,
    maxPressure: 0,
    minPressure: 0,
    totalDistance: 0,
    pressureBuckets: [],
  });

  useEffect(() => {
    const ids = Object.keys(strokePressureInfo);
    const totalStrokes = ids.length;

    if (totalStrokes === 0) {
      setStats({
        totalStrokes: 0,
        avgDrawTime: 0,
        maxPressure: 0,
        minPressure: 0,
        totalDistance: 0,
        pressureBuckets: [0, 0, 0, 0, 0],
      });
      return;
    }

    let maxP = 0, minP = 1, sumP = 0;
    const buckets = [0, 0, 0, 0, 0]; // 0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0

    for (const id of ids) {
      const p = strokePressureInfo[id].avg;
      sumP += p;
      if (p > maxP) maxP = p;
      if (p < minP) minP = p;
      const bucket = Math.min(Math.floor(p * 5), 4);
      buckets[bucket]++;
    }

    let totalTime = 0;
    let totalDist = 0;
    const timeIds = Object.keys(strokeTimeInfo);
    for (const id of timeIds) {
      totalTime += strokeTimeInfo[id].drawTime || 0;
      totalDist += strokeTimeInfo[id].len || 0;
    }

    setStats({
      totalStrokes,
      avgDrawTime: timeIds.length > 0 ? totalTime / timeIds.length : 0,
      maxPressure: Math.round(maxP * 100) / 100,
      minPressure: Math.round(minP * 100) / 100,
      totalDistance: Math.round(totalDist),
      pressureBuckets: buckets,
    });
  }, [strokePressureInfo, strokeTimeInfo]);

  const maxBucket = Math.max(...stats.pressureBuckets, 1);
  const bucketColors = ["#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#f87171"];
  const bucketLabels = ["Light", "Soft", "Mid", "Firm", "Heavy"];

  return (
    <div className="area" style={{ flex: 1 }}>
      <span className="section-title">Stroke Stats</span>

      {/* Stat Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
        marginBottom: 12,
      }}>
        <StatItem label="Strokes" value={stats.totalStrokes.toString()} color="#8b5cf6" />
        <StatItem
          label="Avg Time"
          value={stats.avgDrawTime > 0 ? `${(stats.avgDrawTime / 1000).toFixed(1)}s` : "—"}
          color="#06b6d4"
        />
        <StatItem
          label="Max P"
          value={stats.maxPressure > 0 ? stats.maxPressure.toFixed(2) : "—"}
          color="#f472b6"
        />
        <StatItem
          label="Min P"
          value={stats.minPressure > 0 ? stats.minPressure.toFixed(2) : "—"}
          color="#34d399"
        />
      </div>

      {/* Pressure Distribution Mini Bars */}
      <div style={{ marginTop: 2 }}>
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase" as const,
          color: "rgba(255, 255, 255, 0.3)",
          marginBottom: 8,
        }}>
          Distribution
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {stats.pressureBuckets.map((count, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 9,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.35)",
                width: 32,
                textAlign: "right",
                flexShrink: 0,
              }}>
                {bucketLabels[i]}
              </span>
              <div style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${(count / maxBucket) * 100}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: bucketColors[i],
                  opacity: 0.7,
                  transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
              </div>
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: "rgba(255, 255, 255, 0.4)",
                width: 16,
                textAlign: "right",
                flexShrink: 0,
              }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: "6px 8px",
      borderRadius: 8,
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
    }}>
      <div style={{
        fontSize: 9,
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.35)",
        marginBottom: 2,
        textTransform: "uppercase" as const,
        letterSpacing: "0.04em",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 15,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        color,
      }}>
        {value}
      </div>
    </div>
  );
}
