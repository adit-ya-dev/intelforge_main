// app/dashboard/components/DashboardHeader.tsx
"use client"
import React, { useState } from "react"
import { RefreshCw, Plus, BarChart3, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Lightweight Modal component (no external dependencies)
 * - smaller width, improved backdrop, dark-mode friendly
 */
function Modal({ open, onClose, title, children, footer }: any) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onClose(false)}
      />
      <div
        className="
          relative z-10
          w-[90%] max-w-sm     /* smaller modal width */
          rounded-lg
          bg-card
          p-5
          shadow-xl
          border border-border
        "
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={() => onClose(false)}
            className="rounded p-1 text-sm hover:bg-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

/** Tiny spinner using Tailwind */
function Spinner() {
  return <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
}

/**
 * SimpleSelect (native) with dark-mode-friendly styles and option styling.
 * Use when you want a small, accessible select without extra library dependencies.
 */
function SimpleSelect({ value, onChange, options }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full rounded-md border px-3 py-2 text-sm
        bg-background text-foreground
        focus:outline-none focus:ring focus:ring-primary/40
        dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700
      "
    >
      {options.map((opt: any) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-background text-foreground dark:bg-neutral-900 dark:text-white"
        >
          {opt.label}
        </option>
      ))}
    </select>
  )
}

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export default function DashboardHeader({ isRefreshing, onRefresh }: DashboardHeaderProps) {
  // Add Watch modal state
  const [addOpen, setAddOpen] = useState(false)
  const [watchName, setWatchName] = useState("")
  const [watchTech, setWatchTech] = useState("")
  const [addLoading, setAddLoading] = useState(false)
  const [addMessage, setAddMessage] = useState<string | null>(null)

  // Forecast modal state
  const [forecastOpen, setForecastOpen] = useState(false)
  const [forecastModel, setForecastModel] = useState("s-curve")
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastMessage, setForecastMessage] = useState<string | null>(null)

  // Report modal state
  const [reportOpen, setReportOpen] = useState(false)
  const [reportFormat, setReportFormat] = useState("pdf")
  const [reportLoading, setReportLoading] = useState(false)
  const [reportMessage, setReportMessage] = useState<string | null>(null)

  async function handleAddWatch() {
    if (!watchName.trim()) {
      setAddMessage("Please provide a name for the watch.")
      return
    }
    setAddLoading(true)
    setAddMessage(null)
    try {
      const res = await fetch("/api/dashboard/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: watchName, tech: watchTech }),
      })
      if (!res.ok) throw new Error("Failed to add watch")
      setAddMessage("Watch added successfully")
      setWatchName("")
      setWatchTech("")
      setTimeout(() => setAddOpen(false), 700)
    } catch (err) {
      console.error(err)
      setAddMessage("Error adding watch")
    } finally {
      setAddLoading(false)
    }
  }

  async function handleRunForecast() {
    setForecastLoading(true)
    setForecastMessage(null)
    try {
      const res = await fetch("/api/dashboard/forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: forecastModel }),
      })
      if (!res.ok) throw new Error("Forecast failed")
      const body = await res.json().catch(() => ({}))
      setForecastMessage(body.message || "Forecast started")
      setTimeout(() => setForecastOpen(false), 900)
    } catch (err) {
      console.error(err)
      setForecastMessage("Error running forecast")
    } finally {
      setForecastLoading(false)
    }
  }

  async function handleCreateReport() {
    setReportLoading(true)
    setReportMessage(null)
    try {
      const res = await fetch(`/api/dashboard/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: reportFormat }),
      })
      if (!res.ok) throw new Error("Report creation failed")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const ext = reportFormat === "pdf" ? "pdf" : "zip"
      a.download = `dashboard-report.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setReportMessage("Report ready — downloading...")
      setTimeout(() => setReportOpen(false), 700)
    } catch (err) {
      console.error(err)
      setReportMessage("Error creating report")
    } finally {
      setReportLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Strategic technology intelligence overview</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Watch
        </Button>

        <Button size="sm" onClick={() => setForecastOpen(true)}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Run Forecast
        </Button>

        <Button size="sm" variant="secondary" onClick={() => setReportOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Add Watch Modal */}
      <Modal
        open={addOpen}
        onClose={setAddOpen}
        title="Add Watch"
        footer={
          <>
            <button className="rounded px-3 py-1 text-sm hover:bg-muted" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button
              className="ml-2 rounded bg-primary px-3 py-1 text-sm text-white disabled:opacity-60"
              onClick={handleAddWatch}
              disabled={addLoading}
            >
              {addLoading ? (
                <span className="inline-flex items-center gap-2">
                  Saving <Spinner />
                </span>
              ) : (
                "Save"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <Input placeholder="Watch name" value={watchName} onChange={(e: any) => setWatchName(e.target.value)} />
          <Input
            placeholder="Technology or organization (optional)"
            value={watchTech}
            onChange={(e: any) => setWatchTech(e.target.value)}
          />
          {addMessage && <div className="text-sm text-muted-foreground">{addMessage}</div>}
        </div>
      </Modal>

      {/* Forecast Modal */}
      <Modal
        open={forecastOpen}
        onClose={setForecastOpen}
        title="Run Forecast"
        footer={
          <>
            <button className="rounded px-3 py-1 text-sm hover:bg-muted" onClick={() => setForecastOpen(false)}>
              Cancel
            </button>
            <button
              className="ml-2 rounded bg-primary px-3 py-1 text-sm text-white disabled:opacity-60"
              onClick={handleRunForecast}
              disabled={forecastLoading}
            >
              {forecastLoading ? (
                <span className="inline-flex items-center gap-2">
                  Running <Spinner />
                </span>
              ) : (
                "Start"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <SimpleSelect
            value={forecastModel}
            onChange={setForecastModel}
            options={[
              { value: "s-curve", label: "S-curve" },
              { value: "time-series", label: "Time Series (ARIMA)" },
              { value: "ml", label: "ML (XGBoost)" },
            ]}
          />
          {forecastMessage && <div className="text-sm text-muted-foreground">{forecastMessage}</div>}
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        open={reportOpen}
        onClose={setReportOpen}
        title="Create Report"
        footer={
          <>
            <button className="rounded px-3 py-1 text-sm hover:bg-muted" onClick={() => setReportOpen(false)}>
              Cancel
            </button>
            <button
              className="ml-2 rounded bg-primary px-3 py-1 text-sm text-white disabled:opacity-60"
              onClick={handleCreateReport}
              disabled={reportLoading}
            >
              {reportLoading ? (
                <span className="inline-flex items-center gap-2">
                  Preparing <Spinner />
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <SimpleSelect
            value={reportFormat}
            onChange={setReportFormat}
            options={[
              { value: "pdf", label: "PDF" },
              { value: "zip", label: "ZIP (assets)" },
            ]}
          />
          {reportMessage && <div className="text-sm text-muted-foreground">{reportMessage}</div>}
        </div>
      </Modal>
    </div>
  )
}
