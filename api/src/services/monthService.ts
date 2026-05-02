import { prisma } from '../lib/prisma';

export type MonthInput = {
  monthId: string;
  salary: number;
  expenses: {
    rent: number;
    food: number;
    travel: number;
    bills: number;
    misc: number;
  };
};

const toMonthData = (row: {
  monthId: string; salary: number;
  rent: number; food: number; travel: number; bills: number; misc: number;
}) => ({
  monthId: row.monthId,
  salary: row.salary,
  expenses: {
    rent: row.rent,
    food: row.food,
    travel: row.travel,
    bills: row.bills,
    misc: row.misc,
  },
});

export async function getMonth(uid: string, monthId: string) {
  const row = await prisma.month.findUnique({
    where: { userId_monthId: { userId: uid, monthId } },
  });
  return row ? toMonthData(row) : null;
}

export async function saveMonth(uid: string, input: MonthInput) {
  const data = {
    salary: input.salary,
    rent:   input.expenses.rent,
    food:   input.expenses.food,
    travel: input.expenses.travel,
    bills:  input.expenses.bills,
    misc:   input.expenses.misc,
  };
  const row = await prisma.month.upsert({
    where: { userId_monthId: { userId: uid, monthId: input.monthId } },
    update: data,
    create: { userId: uid, monthId: input.monthId, ...data },
  });
  return toMonthData(row);
}

export async function listMonths(uid: string) {
  const rows = await prisma.month.findMany({
    where: { userId: uid },
    orderBy: { monthId: 'desc' },
  });
  return rows.map(toMonthData);
}

export async function copyMonth(uid: string, fromMonthId: string, toMonthId: string) {
  const source = await getMonth(uid, fromMonthId);
  if (!source) throw new Error(`Month ${fromMonthId} not found`);
  return saveMonth(uid, { ...source, monthId: toMonthId });
}
