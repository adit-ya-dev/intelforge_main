"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TechSignals, SCurveData, HypeCurveData } from "@/types/tech-detail";
import { TrendingUp, Activity, DollarSign, FileText, Info } from "lucide-react";

interface ChartsAreaProps {
  signals: TechSignals;
  sCurveData: SCurveData;
  hypeCurveData: HypeCurveData;
}

type ChartTab = "s-curve" | "hype-cycle" | "citations" | "funding";

export default function ChartsArea({
  signals,
  sCurveData,
  hypeCurveData,
}: ChartsAreaProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>("s-curve");
  const [showUncertainty, setShowUncertainty] = useState(true);

  const tabs = [
    { id: "s-curve" as ChartTab, label: "S-Curve Adoption", icon: TrendingUp },
    { id: "hype-cycle" as ChartTab, label: "Hype Cycle", icon: Activity },
    { id: "citations" as ChartTab, label: "Citations & Papers", icon: FileText },
    { id: "funding" as ChartTab, label: "Funding Activity", icon: DollarSign },
  ];

  // Prepare S-Curve data
  const sCurveChartData = [
    ...sCurveData.observed.map((d) => ({
      date: d.date,
      observed: d.adoption,
      type: "observed",
    })),
    ...sCurveData.fitted
      .filter((d) => !sCurveData.observed.find((o) => o.date === d.date))
      .map((d) => ({
        date: d.date,
        fitted: d.adoption,
        upperBound: d.upperBound,
        lowerBound: d.lowerBound,
        type: "forecast",
      })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  // Prepare Hype Cycle data
  const hypeCycleChartData = hypeCurveData.phases.map((phase) => ({
    date: phase.date,
    intensity: phase.intensity,
    phase: phase.phase,
  }));

  // Prepare Patents/Papers data
  const citationsChartData = signals.papers.timeseries.map((paper, idx) => ({
    date: paper.date,
    papers: paper.value,
    patents: signals.patents.timeseries[idx]?.value || 0,
  }));

  // Prepare Funding data
  const fundingChartData = signals.funding.timeseries.map((fund) => ({
    date: fund.date,
    funding: fund.value,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-muted-foreground">
              <span style={{ color: entry.color }}>{entry.name}:</span>{" "}
              <span className="font-medium text-foreground">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Analytics & Forecasting
          </h2>
          <p className="text-sm text-muted-foreground">
            Data-driven insights and predictive models
          </p>
        </div>

        {activeTab === "s-curve" && (
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={showUncertainty}
              onChange={(e) => setShowUncertainty(e.target.checked)}
              className="rounded border-border"
            />
            <span>Show uncertainty bands</span>
          </label>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart Content */}
      <div className="min-h-[400px]">
        {activeTab === "s-curve" && (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Technology Adoption S-Curve
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current phase: <span className="font-medium text-foreground capitalize">
                    {sCurveData.maturityPhase}
                  </span>
                  {sCurveData.inflectionPoint && (
                    <> • Inflection point: {sCurveData.inflectionPoint.date}</>
                  )}
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Info className="h-3 w-3" />
                Model details
              </button>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={sCurveChartData}>
                <defs>
                  <linearGradient id="observedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fittedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{
                    value: "Adoption (%)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {showUncertainty && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="none"
                      fill="#10b981"
                      fillOpacity={0.1}
                      name="Upper Bound"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="none"
                      fill="#10b981"
                      fillOpacity={0.1}
                      name="Lower Bound"
                    />
                  </>
                )}

                <Area
                  type="monotone"
                  dataKey="observed"
                  stroke="hsl(var(--primary))"
                  fill="url(#observedGradient)"
                  strokeWidth={2}
                  name="Observed Data"
                />
                <Line
                  type="monotone"
                  dataKey="fitted"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Fitted Forecast"
                />

                {sCurveData.inflectionPoint && (
                  <ReferenceLine
                    x={sCurveData.inflectionPoint.date}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{
                      value: "Inflection Point",
                      position: "top",
                      fill: "#f59e0b",
                      fontSize: 11,
                    }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Current Adoption</div>
                <div className="text-2xl font-bold text-foreground">
                  {sCurveData.observed[sCurveData.observed.length - 1].adoption}%
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Maturity Phase</div>
                <div className="text-lg font-semibold text-foreground capitalize">
                  {sCurveData.maturityPhase}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Projected 2028</div>
                <div className="text-2xl font-bold text-green-500">
                  {sCurveData.fitted[sCurveData.fitted.length - 3]?.adoption || 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "hype-cycle" && (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Technology Hype Cycle
                </h3>
                <p className="text-sm text-muted-foreground">
                  Current phase: <span className="font-medium text-foreground capitalize">
                    {hypeCurveData.currentPhase}
                  </span>
                  {hypeCurveData.plateauEstimate && (
                    <> • Expected plateau: {hypeCurveData.plateauEstimate}</>
                  )}
                </p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={hypeCycleChartData}>
                <defs>
                  <linearGradient id="hypeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{
                    value: "Signal Intensity",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="intensity"
                  stroke="#8b5cf6"
                  fill="url(#hypeGradient)"
                  strokeWidth={2}
                  name="Hype Intensity"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap gap-2">
              {hypeCurveData.phases.map((phase) => (
                <div
                  key={phase.phase}
                  className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-foreground capitalize">
                    {phase.phase.replace("-", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">({phase.date})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "citations" && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Research Activity & Patent Filings
              </h3>
              <p className="text-sm text-muted-foreground">
                Total papers: {signals.papers.total} • Total citations:{" "}
                {signals.papers.citations} • Patents: {signals.patents.total}
              </p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={citationsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{
                    value: "Count",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="papers" fill="#8b5cf6" name="Research Papers" />
                <Bar dataKey="patents" fill="#3b82f6" name="Patents" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Total Papers</div>
                <div className="text-2xl font-bold text-foreground">
                  {signals.papers.total}
                </div>
                <div className="text-xs text-green-500 mt-1">
                  {signals.papers.citations.toLocaleString()} citations
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Total Patents</div>
                <div className="text-2xl font-bold text-foreground">
                  {signals.patents.total}
                </div>
                <div className="text-xs text-green-500 mt-1">+{signals.patents.growth}% YoY</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Avg. Citations/Paper</div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(signals.papers.citations / signals.papers.total)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "funding" && (
          <div>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-foreground mb-1">
                Investment & Funding Activity
              </h3>
              <p className="text-sm text-muted-foreground">
                Total funding: ${signals.funding.totalAmount}M across{" "}
                {signals.funding.rounds} rounds
              </p>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={fundingChartData}>
                <defs>
                  <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{
                    value: "Funding (M$)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="funding"
                  stroke="#10b981"
                  fill="url(#fundingGradient)"
                  strokeWidth={2}
                  name="Cumulative Funding"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Total Investment</div>
                <div className="text-2xl font-bold text-foreground">
                  ${signals.funding.totalAmount}M
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Funding Rounds</div>
                <div className="text-2xl font-bold text-foreground">
                  {signals.funding.rounds}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Active Startups</div>
                <div className="text-2xl font-bold text-foreground">
                  {signals.startups.activeCount}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  of {signals.startups.total} total
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}