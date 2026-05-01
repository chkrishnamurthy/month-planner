import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CATEGORIES, totalExpenses } from '../lib/categories';
import { formatCompactINR } from '../lib/format';

export default function AllocationDonut({ month }) {
  const salary = Number(month?.salary) || 0;
  const total = totalExpenses(month?.expenses);
  const left = Math.max(0, salary - total);

  const data = useMemo(() => {
    const cats = CATEGORIES.map((c) => ({
      name: c.label,
      value: Number(month?.expenses?.[c.key]) || 0,
      color: c.color,
    })).filter((d) => d.value > 0);
    if (left > 0 || cats.length === 0) {
      cats.push({ name: 'Left', value: Math.max(left, 1), color: '#2A2A2A' });
    }
    return cats;
  }, [month, left]);

  return (
    <div className="relative w-full aspect-square max-w-[260px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius="68%"
            outerRadius="100%"
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
            paddingAngle={1.5}
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="label-eyebrow">Left</div>
        <div className="text-2xl font-semibold num">{formatCompactINR(left)}</div>
        <div className="text-xs text-muted-light dark:text-muted-dark num">
          of {formatCompactINR(salary)}
        </div>
      </div>
    </div>
  );
}
