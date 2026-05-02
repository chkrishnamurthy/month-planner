import { prisma } from '../lib/prisma';

export type MonthInput = {
  monthId: string;
  salary: number;
  expenses: Record<string, number>; // categoryId → amount
};

const toMonthData = (row: {
  monthId: string;
  salary: number;
  expenses: { categoryId: string; amount: number }[];
}) => ({
  monthId: row.monthId,
  salary: row.salary,
  expenses: Object.fromEntries(row.expenses.map((e) => [e.categoryId, e.amount])),
});

export async function getMonth(uid: string, monthId: string) {
  const row = await prisma.month.findUnique({
    where: { userId_monthId: { userId: uid, monthId } },
    include: { expenses: true },
  });
  return row ? toMonthData(row) : null;
}

export async function saveMonth(uid: string, input: MonthInput) {
  const month = await prisma.month.upsert({
    where: { userId_monthId: { userId: uid, monthId: input.monthId } },
    update: { salary: input.salary },
    create: { userId: uid, monthId: input.monthId, salary: input.salary },
  });

  if (Object.keys(input.expenses).length > 0) {
    await prisma.$transaction(
      Object.entries(input.expenses).map(([categoryId, amount]) =>
        prisma.monthExpense.upsert({
          where: { monthId_categoryId: { monthId: month.id, categoryId } },
          update: { amount },
          create: { monthId: month.id, categoryId, amount },
        })
      )
    );
  }

  const updated = await prisma.month.findUnique({
    where: { id: month.id },
    include: { expenses: true },
  });
  return toMonthData(updated!);
}

export async function listMonths(uid: string) {
  const rows = await prisma.month.findMany({
    where: { userId: uid },
    include: { expenses: true },
    orderBy: { monthId: 'desc' },
  });
  return rows.map(toMonthData);
}

export async function copyMonth(uid: string, fromMonthId: string, toMonthId: string) {
  const source = await getMonth(uid, fromMonthId);
  if (!source) throw new Error(`Month ${fromMonthId} not found`);
  return saveMonth(uid, { ...source, monthId: toMonthId });
}
