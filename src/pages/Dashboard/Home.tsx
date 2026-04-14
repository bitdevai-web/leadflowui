import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BrevoEvent } from "../../types/types";
import { getLeadStats, getTags } from "../../service/lead.service";
import { MOCK_STATS, MOCK_TAGS } from "../../data/mockData";
import PageMeta from "../../components/common/PageMeta";
import auth from "../../guards/auth.guard";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  [BrevoEvent.DELIVERED]: "#16a34a",
  [BrevoEvent.UNIQUE_OPENED]: "#3b82f6",
  [BrevoEvent.CLICKED]: "#8b5cf6",
  [BrevoEvent.SENT]: "#f59e0b",
  [BrevoEvent.SENT_TO_BREVO]: "#f59e0b",
  [BrevoEvent.SOFT_BOUNCE]: "#f97316",
  [BrevoEvent.HARD_BOUNCE]: "#ef4444",
  [BrevoEvent.SPAM]: "#ec4899",
  [BrevoEvent.UNSUBSCRIBED]: "#94a3b8",
  [BrevoEvent.BLOCKED]: "#64748b",
  [BrevoEvent.FAILED]: "#dc2626",
  [BrevoEvent.DEFERRED]: "#a78bfa",
};

const STATUS_LABELS: Record<string, string> = {
  [BrevoEvent.DELIVERED]: "Delivered",
  [BrevoEvent.UNIQUE_OPENED]: "Opened",
  [BrevoEvent.CLICKED]: "Clicked",
  [BrevoEvent.SENT]: "Sent",
  [BrevoEvent.SENT_TO_BREVO]: "Queued",
  [BrevoEvent.SOFT_BOUNCE]: "Soft Bounce",
  [BrevoEvent.HARD_BOUNCE]: "Hard Bounce",
  [BrevoEvent.SPAM]: "Spam",
  [BrevoEvent.UNSUBSCRIBED]: "Unsubscribed",
  [BrevoEvent.BLOCKED]: "Blocked",
  [BrevoEvent.FAILED]: "Failed",
  [BrevoEvent.DEFERRED]: "Deferred",
};

const INDUSTRY_COLORS = ["#16a34a", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

function KPICard({ icon, label, value, sub, iconBg, iconColor, badge, badgeColor }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg}`}>
          <i className={`${icon} text-base ${iconColor}`}></i>
        </span>
        {badge && <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeColor ?? "bg-gray-100 text-gray-500"}`}>{badge}</span>}
      </div>
      <div>
        <p className="text-[28px] font-bold text-gray-800 tracking-tight leading-none">{value}</p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-2">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function PipelineStep({ icon, label, value, sub, color, rate, isLast }: any) {
  return (
    <div className="flex items-center min-w-0 flex-1">
      <div className="flex-1 min-w-0 flex flex-col items-center text-center p-4">
        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${color}`}>
          <i className={`${icon} text-lg`}></i>
        </span>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-1.5">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
      {!isLast && (
        <div className="flex flex-col items-center shrink-0 px-1">
          {rate && <span className="text-[10px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full whitespace-nowrap mb-1">{rate}</span>}
          <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
        </div>
      )}
    </div>
  );
}

function SectionCard({ title, sub, badge, children }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {badge && <span className="text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1 rounded-full">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

function Home() {
  const { data: apiData } = useQuery({ queryKey: ["stat"], queryFn: getLeadStats });
  const { data: apiTags } = useQuery({ queryKey: ["tags"], queryFn: getTags });

  const data: any = apiData ?? MOCK_STATS;
  const tags = apiTags ?? MOCK_TAGS;

  const emailDonutData = useMemo(() => {
    return Object.entries(data?.status_wise_emails ?? {})
      .filter(([, count]) => (count as number) > 0)
      .map(([status, count]) => ({
        name: STATUS_LABELS[status] ?? status,
        value: count as number,
        color: STATUS_COLORS[status] ?? "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value);
  }, [data?.status_wise_emails]);

  const totalEmailsTracked = useMemo(() => emailDonutData.reduce((s, d) => s + d.value, 0), [emailDonutData]);

  const countryBarData = useMemo(() => {
    return Object.entries(data?.country_wise_leads ?? {})
      .map(([country, count]) => ({ country, count: count as number }))
      .sort((a, b) => b.count - a.count);
  }, [data?.country_wise_leads]);

  const { qualityChartData, industryCountries } = useMemo(() => {
    const pivot: Record<string, Record<string, number>> = {};
    const allCountries = new Set<string>();
    (data?.quality_leads ?? []).forEach(async ({ category, country, leads }: any) => {
      const label = tags?.[category]?.cleaned_name ?? category;
      if (!pivot[label]) pivot[label] = {};
      pivot[label][country] = leads;
      allCountries.add(country);
    });
    const qualityChartData = Object.entries(pivot).map(([category, countryMap]) => ({ category, ...countryMap }));
    return { qualityChartData, industryCountries: Array.from(allCountries) };
  }, [data?.quality_leads, tags]);

  const totalQualityLeads = useMemo(
    () => (data?.quality_leads ?? []).reduce((s: number, q: any) => s + q.leads, 0),
    [data?.quality_leads]
  );

  const deliveredCount = (data?.status_wise_emails?.[BrevoEvent.DELIVERED] ?? 0) as number;
  const openedCount = (data?.status_wise_emails?.[BrevoEvent.UNIQUE_OPENED] ?? 0) as number;
  const clickedCount = (data?.status_wise_emails?.[BrevoEvent.CLICKED] ?? 0) as number;

  const deliveryRate = totalEmailsTracked > 0 ? Math.round((deliveredCount / totalEmailsTracked) * 100) : 0;
  const openRate = deliveredCount > 0 ? Math.round((openedCount / deliveredCount) * 100) : 0;
  const clickRate = openedCount > 0 ? Math.round((clickedCount / openedCount) * 100) : 0;
  const responseRate = (data?.total_emails ?? 0) > 0 ? (((data?.total_responses ?? 0) / (data?.total_emails ?? 1)) * 100).toFixed(1) : "0";
  const qualityRate = (data?.total_leads ?? 0) > 0 ? Math.round((totalQualityLeads / (data?.total_leads ?? 1)) * 100) : 0;
  const contactRate = totalQualityLeads > 0 ? Math.round(((data?.total_emails ?? 0) / totalQualityLeads) * 100) : 0;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <PageMeta title="Leadflow - Dashboard" description="Leadflow pipeline overview" />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pipeline Overview</h1>
            <p className="text-sm text-gray-400 mt-0.5">{today}</p>
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse inline-block"></span>
            Live Data
          </span>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard icon="fa-solid fa-users" label="Total Leads" value={(data?.total_leads ?? 0).toLocaleString()} sub={`${totalQualityLeads.toLocaleString()} quality leads (${qualityRate}%)`} iconBg="bg-blue-50" iconColor="text-blue-600" badge="↑ Active" badgeColor="bg-blue-50 text-blue-600" />
          <KPICard icon="fa-solid fa-paper-plane" label="Emails Dispatched" value={(data?.total_emails ?? 0).toLocaleString()} sub={`${data?.total_senders ?? 0} active senders`} iconBg="bg-brand-50" iconColor="text-brand-600" badge={`${deliveryRate}% delivery`} badgeColor="bg-brand-50 text-brand-600" />
          <KPICard icon="fa-regular fa-envelope-open" label="Open Rate" value={`${openRate}%`} sub={`${openedCount.toLocaleString()} opens · ${clickRate}% CTR`} iconBg="bg-violet-50" iconColor="text-violet-600" badge={openRate > 50 ? "✓ Strong" : "Medium"} badgeColor={openRate > 50 ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"} />
          <KPICard icon="fa-solid fa-reply-all" label="Responses" value={(data?.total_responses ?? 0).toLocaleString()} sub={`${responseRate}% response rate`} iconBg="bg-amber-50" iconColor="text-amber-600" badge={parseFloat(responseRate as string) > 3 ? "↑ Good" : "Low"} badgeColor={parseFloat(responseRate as string) > 3 ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100"><h3 className="font-semibold text-gray-800 text-sm">Email Status Breakdown</h3><p className="text-xs text-gray-400 mt-0.5">{totalEmailsTracked.toLocaleString()} emails tracked</p></div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={emailDonutData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {emailDonutData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v.toLocaleString()} (${Math.round((v / totalEmailsTracked) * 100)}%)`} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 px-1">
                {emailDonutData.map((item: any) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600 truncate">{item.name}</span>
                    <span className="text-xs font-bold text-gray-700 ml-auto">{Math.round((item.value / totalEmailsTracked) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><div><h3 className="font-semibold text-gray-800 text-sm">Leads by Country</h3><p className="text-xs text-gray-400 mt-0.5">{countryBarData.length} countries targeted</p></div><span className="text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-100 px-3 py-1 rounded-full">{(data?.total_leads ?? 0).toLocaleString()} total</span></div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={countryBarData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }} barSize={14}>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="country" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: "12px" }} cursor={{ fill: "rgba(22,163,74,0.04)" }} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {countryBarData.map((_, i: number) => <Cell key={i} fill={`rgba(22,163,74,${1 - (i / countryBarData.length) * 0.55})`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <SectionCard title="Quality Lead Distribution by Industry" sub="Leads per industry across all countries" badge={`${totalQualityLeads.toLocaleString()} quality leads`}>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={qualityChartData} barCategoryGap="28%" barGap={4} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", fontSize: "12px" }} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                {industryCountries.map((c, i) => <Bar key={c} dataKey={c} fill={INDUSTRY_COLORS[i % 6]} radius={[4, 4, 0, 0]} maxBarSize={28} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Outreach Pipeline" sub="End-to-end lead conversion journey">
          <div className="p-5">
            <div className="flex items-stretch flex-wrap md:flex-nowrap gap-0 divide-x divide-gray-100">
              <PipelineStep icon="fa-solid fa-database" label="Total Leads" value={(data?.total_leads ?? 0).toLocaleString()} sub="Uploaded to CRM" color="bg-blue-50 text-blue-600" rate={`${qualityRate}% qualified`} />
              <PipelineStep icon="fa-solid fa-star" label="Quality Leads" value={totalQualityLeads.toLocaleString()} sub="Filtered & scored" color="bg-amber-50 text-amber-600" rate={`${contactRate}% contacted`} />
              <PipelineStep icon="fa-solid fa-paper-plane" label="Emails Sent" value={(data?.total_emails ?? 0).toLocaleString()} sub="Dispatched via senders" color="bg-brand-50 text-brand-600" rate={`${openRate}% opened`} />
              <PipelineStep icon="fa-regular fa-envelope-open" label="Opened" value={openedCount.toLocaleString()} sub="Unique opens" color="bg-violet-50 text-violet-600" rate={`${responseRate}% replied`} />
              <PipelineStep icon="fa-solid fa-handshake" label="Responses" value={(data?.total_responses ?? 0).toLocaleString()} sub="Engaged prospects" color="bg-green-50 text-green-700" isLast />
            </div>
            <div className="mt-6 px-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2"><span>Pipeline conversion</span><span className="font-semibold text-gray-600">{responseRate}% end-to-end rate</span></div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, Math.max(2, parseFloat(responseRate as string) * 8))}%`, background: "linear-gradient(90deg, #4ade80, #16a34a)" }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Email Campaign Status Details" sub="Full breakdown of all tracked email events">
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {emailDonutData.map((item: any) => {
                const pct = Math.round((item.value / totalEmailsTracked) * 100);
                return (
                  <div key={item.name} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between"><span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{item.name}</span><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /></div>
                    <p className="text-xl font-bold" style={{ color: item.color }}>{item.value.toLocaleString()}</p>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-xs text-gray-400">{pct}% of tracked</p>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

      </div>
    </>
  );
}

export default auth(Home);