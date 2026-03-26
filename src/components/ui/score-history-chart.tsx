"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface ScoreHistoryChartProps {
    data: { date: string; score: number; label: string; type: string }[];
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: { label: string }; color: string; value: number }>;
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 shadow-2xl">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xs text-zinc-400 mb-2 truncate max-w-xs">{payload[0].payload.label}</p>
                <p className="text-2xl font-black" style={{ color: payload[0].color }}>
                    {payload[0].value}
                    <span className="text-zinc-600 text-base">/10</span>
                </p>
            </div>
        );
    }
    return null;
};

export function ScoreHistoryChart({ data }: ScoreHistoryChartProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);
    if (!mounted) return <div className="h-80 flex items-center justify-center text-zinc-600">Loading chart...</div>;

    return (
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#52525b", fontSize: 10, fontWeight: 700 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 10]}
                        tick={{ fill: "#52525b", fontSize: 10, fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={7} stroke="rgba(16,185,129,0.2)" strokeDasharray="4 4" />
                    <ReferenceLine y={4} stroke="rgba(239,68,68,0.2)" strokeDasharray="4 4" />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary-hsl, 270 80% 60%))"
                        strokeWidth={2.5}
                        dot={{ fill: "#fff", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: "#fff" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
