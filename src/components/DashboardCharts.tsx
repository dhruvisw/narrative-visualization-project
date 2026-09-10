import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import {
  phaseOrder,
  scoreLabel,
  type DashboardCase,
  type ViewKey,
  type PhaseKey,
} from '@/data/dashboardData';

interface MetricDef {
  key: string;
  label: string;
  short: string;
  color: string;
  description: string;
}

const metricsByView: Record<ViewKey, MetricDef[]> = {
  experience: [
    { key: 'mood', label: 'Mood', short: 'Mood', color: 'hsl(var(--primary))', description: 'Self-reported mood quality. Higher = better.' },
    { key: 'sleep', label: 'Sleep', short: 'Sleep', color: 'hsl(var(--medical))', description: 'Sleep quality reported by the patient. Higher = better.' },
    { key: 'motivation', label: 'Motivation', short: 'Motiv.', color: 'hsl(var(--sage))', description: 'Motivation & energy for daily activities. Higher = better.' },
  ],
  clinical: [
    { key: 'depressiveSymptoms', label: 'Depressive symptoms', short: 'Symptoms', color: 'hsl(var(--clay))', description: 'Severity of depressive symptom cluster. Higher = more symptoms.' },
    { key: 'functionalImpairment', label: 'Functional impact', short: 'Function', color: 'hsl(var(--medical))', description: 'How much daily functioning is impaired. Higher = more impairment.' },
    { key: 'treatmentResponse', label: 'Treatment response', short: 'Response', color: 'hsl(var(--primary))', description: 'Clinician-rated response to treatment. Higher = better response.' },
  ],
  eeg: [
    { key: 'eegMarker', label: 'EEG marker', short: 'EEG', color: 'hsl(var(--primary))', description: 'A simplified neural marker linked to mood regulation. Higher = pattern more associated with improved regulation.' },
  ],
};

const takeawayByView: Record<ViewKey, string> = {
  experience: 'Patient-reported mood, sleep and motivation gradually improve across phases.',
  clinical: 'Symptom severity decreases while treatment response increases over the course.',
  eeg: 'The EEG marker shifts from baseline toward patterns linked with improved mood regulation.',
};

const yTicks = [0, 1, 2, 3];
const yTickFormat = (v: number) => scoreLabel(v as 0 | 1 | 2 | 3);

interface Props {
  activeCase: DashboardCase;
  view: ViewKey;
}

const ChartCard: React.FC<{ title: string; takeaway?: string; children: React.ReactNode }> = ({
  title,
  takeaway,
  children,
}) => (
  <div className="section-card !p-4">
    <div className="flex items-center justify-between mb-2 gap-2">
      <h3 className="text-sm font-semibold text-foreground/85">{title}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground cursor-help">
            <Info className="w-3 h-3" aria-hidden /> narrative scale
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          Scores (None / Low / Medium / High) are derived from the narrative case summary, not from clinical measurement.
        </TooltipContent>
      </Tooltip>
    </div>
    <div className="h-56 w-full">{children}</div>
    {takeaway && (
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{takeaway}</p>
    )}
  </div>
);

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 shadow-md text-xs">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-foreground/80">{p.name}:</span>
          <span className="font-medium text-foreground">{scoreLabel(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const DashboardCharts: React.FC<Props> = ({ activeCase, view }) => {
  const metrics = metricsByView[view];

  // Data for "Change Over Time" — all 4 phases
  const overTimeData = useMemo(
    () =>
      phaseOrder.map((p) => {
        const m = activeCase.metrics[p.key as PhaseKey];
        const row: Record<string, any> = { phase: p.short };
        metrics.forEach((md) => {
          row[md.key] = m[md.key as keyof typeof m];
        });
        return row;
      }),
    [activeCase, metrics]
  );

  // Data for "Before vs After" — only 2 phases
  const beforeAfterData = useMemo(
    () =>
      (['before', 'after'] as PhaseKey[]).map((k) => {
        const m = activeCase.metrics[k];
        const row: Record<string, any> = { phase: k === 'before' ? 'Before' : 'After' };
        metrics.forEach((md) => {
          row[md.key] = m[md.key as keyof typeof m];
        });
        return row;
      }),
    [activeCase, metrics]
  );

  const renderBars = () =>
    metrics.map((m) => (
      <Bar key={m.key} dataKey={m.key} name={m.label} fill={m.color} radius={[4, 4, 0, 0]} />
    ));

  // For the EEG view (single metric over time), color each bar by intensity
  const isSingleMetric = metrics.length === 1;

  return (
    <section aria-label="Dashboard charts" className="grid gap-4 md:grid-cols-2 mb-8">
      <ChartCard title="Change over time" takeaway={takeawayByView[view]}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={overTimeData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="phase" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis
              ticks={yTicks}
              domain={[0, 3]}
              tickFormatter={yTickFormat}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <RTooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
            {!isSingleMetric && (
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
            )}
            {isSingleMetric ? (
              <Bar dataKey={metrics[0].key} name={metrics[0].label} radius={[4, 4, 0, 0]}>
                {overTimeData.map((d, i) => {
                  const v = d[metrics[0].key] as number;
                  const colors = ['hsl(var(--muted-foreground))', 'hsl(var(--clay))', 'hsl(var(--medical))', 'hsl(var(--primary))'];
                  return <Cell key={i} fill={colors[v]} />;
                })}
              </Bar>
            ) : (
              renderBars()
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Before vs After" takeaway="Side-by-side comparison of the same measures at baseline and follow-up.">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={beforeAfterData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="phase" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis
              ticks={yTicks}
              domain={[0, 3]}
              tickFormatter={yTickFormat}
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <RTooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }} />
            {!isSingleMetric && (
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
            )}
            {isSingleMetric ? (
              <Bar dataKey={metrics[0].key} name={metrics[0].label} radius={[4, 4, 0, 0]}>
                {beforeAfterData.map((d, i) => {
                  const v = d[metrics[0].key] as number;
                  const colors = ['hsl(var(--muted-foreground))', 'hsl(var(--clay))', 'hsl(var(--medical))', 'hsl(var(--primary))'];
                  return <Cell key={i} fill={colors[v]} />;
                })}
              </Bar>
            ) : (
              renderBars()
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
};

export default DashboardCharts;
