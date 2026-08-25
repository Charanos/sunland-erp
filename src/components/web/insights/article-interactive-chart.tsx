"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Legend,
} from "recharts";

interface ChartProps {
  slug: string;
}

export function ArticleInteractiveChart({ slug }: ChartProps) {
  if (slug === "what-a-management-agreement-should-say") {
    const data = [
      {
        scenario: "Low Collection (60%)",
        collectedBasis: 48000,
        invoicedBasis: 80000,
        lossToOwner: 32000,
      },
      {
        scenario: "Average Collection (80%)",
        collectedBasis: 64000,
        invoicedBasis: 80000,
        lossToOwner: 16000,
      },
      {
        scenario: "Full Collection (100%)",
        collectedBasis: 80000,
        invoicedBasis: 80000,
        lossToOwner: 0,
      },
    ];

    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-line bg-surface-1 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-brand-yellow" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                Advisory Financial Modeling
              </p>
            </div>
            <h3 className="font-editorial text-lg sm:text-xl font-medium text-[#151936]">
              Management Fee Impact: Rent Collected vs. Invoiced Basis
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Simulation on KES 1,000,000 gross monthly rent roll at 8% standard management fee.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[11px] font-medium text-emerald-800">
            Realized Data Matrix
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="scenario" tick={{ fontSize: 12, fill: "#64748b" }} stroke="#cbd5e1" />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#cbd5e1"
                tickFormatter={(v) => `KES ${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151936",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                }}
                formatter={(value: any, name: any) => [
                  `KES ${Number(value).toLocaleString()}`,
                  name === "collectedBasis"
                    ? "Fee on Collected Rent"
                    : name === "invoicedBasis"
                    ? "Fee on Invoiced Rent (Adverse)"
                    : "Owner Value Leakage",
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                formatter={(value) => (
                  <span className="text-slate-600 font-medium">
                    {value === "collectedBasis"
                      ? "Fee on Collected (Aligned)"
                      : "Fee on Invoiced (Adverse)"}
                  </span>
                )}
              />
              <Bar dataKey="collectedBasis" name="collectedBasis" fill="#151936" radius={[6, 6, 0, 0]} />
              <Bar dataKey="invoicedBasis" name="invoicedBasis" fill="#64748b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-xl bg-surface-0 border border-line p-3.5 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>💡 Key Takeaway:</span>
          <span className="text-[#151936] font-medium">
            Invoiced basis transfers KES 32,000+ uncollected arrears burden directly to the landlord.
          </span>
        </div>
      </div>
    );
  }

  if (slug === "office-rents-outside-the-cbd") {
    const officeData = [
      { node: "Westlands", base: 115, service: 35, parking: 25, total: 175 },
      { node: "Upper Hill", base: 125, service: 38, parking: 22, total: 185 },
      { node: "Tatu City SEZ", base: 95, service: 22, parking: 12, total: 129 },
      { node: "Kilimani", base: 90, service: 28, parking: 18, total: 136 },
    ];

    return (
      <div className="my-10 overflow-hidden rounded-2xl border border-line bg-surface-1 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="size-2 rounded-full bg-brand-yellow" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                Nairobi Commercial Benchmarks
              </p>
            </div>
            <h3 className="font-editorial text-lg sm:text-xl font-medium text-[#151936]">
              Total Occupancy Cost per Sq. Ft. (KES / Month)
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Factoring in base rent, service charge, and parking ratio overheads.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-[11px] font-medium text-emerald-800">
            Q2 2026 Verified Rates
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={officeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="node" tick={{ fontSize: 12, fill: "#64748b" }} stroke="#cbd5e1" />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#cbd5e1"
                tickFormatter={(v) => `KES ${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#151936",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: any) => [`KES ${value} / sqft`, "Total Occupancy Cost"]}
              />
              <Bar dataKey="total" fill="#151936" radius={[6, 6, 0, 0]}>
                {officeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.node === "Tatu City SEZ" ? "#059669" : "#151936"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-xl bg-surface-0 border border-line p-3.5 flex items-center justify-between text-xs font-mono text-slate-600">
          <span>💡 SEZ Cost Efficiency:</span>
          <span className="text-[#151936] font-medium">
            Tatu City SEZ provides a 30.2% net operational cost saving versus Upper Hill Grade-A space.
          </span>
        </div>
      </div>
    );
  }

  return null;
}
