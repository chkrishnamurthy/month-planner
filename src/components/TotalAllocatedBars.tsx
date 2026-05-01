import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface BarDatum {
  id: string;
  label: string;
  total: number;
  salary: number;
}

interface Props {
  data: BarDatum[];
  currentId?: string;
}

const formatTopLabel = (v: number): string => {
  if (!v) return '';
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}k`;
  return `₹${v}`;
};

export default function TotalAllocatedBars({ data, currentId }: Props) {
  const { resolved } = useTheme();
  const accentDark = resolved === 'dark' ? '#FFFFFF' : '#0A0A0A';
  const muted = resolved === 'dark' ? '#2A2A2A' : '#E8E6DD';
  const tickColor = resolved === 'dark' ? '#8A8A85' : '#6B6B66';

  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 28, right: 4, left: 4, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: tickColor }}
          />
          <YAxis hide />
          <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={26} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.id} fill={d.id === currentId ? accentDark : muted} />
            ))}
            <LabelList
              dataKey="total"
              position="top"
              formatter={formatTopLabel}
              style={{ fill: tickColor, fontSize: 10, fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
