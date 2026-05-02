import { prisma } from '../lib/prisma';

const DEFAULT_CATEGORIES = [
  { name: 'Rent',   emoji: '🏠', color: '#8AB4F8', isDefault: true },
  { name: 'Food',   emoji: '🍽️', color: '#FF9A6B', isDefault: true },
  { name: 'Travel', emoji: '✈️', color: '#F4D03F', isDefault: true },
  { name: 'Bills',  emoji: '⚡', color: '#A8E063', isDefault: true },
  { name: 'Misc',   emoji: '✨', color: '#C9A8FF', isDefault: true },
];

export async function seedDefaultCategories(uid: string) {
  const count = await prisma.category.count({ where: { userId: uid } });
  if (count > 0) return;
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: uid })),
    skipDuplicates: true,
  });
}

export async function getCategories(uid: string) {
  return prisma.category.findMany({
    where: { userId: uid },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
}

export async function createCategory(
  uid: string,
  data: { name: string; emoji: string; color: string }
) {
  const name = data.name.trim();
  const exists = await prisma.category.findUnique({
    where: { userId_name: { userId: uid, name } },
  });
  if (exists) throw new Error(`Category "${name}" already exists`);
  return prisma.category.create({ data: { ...data, name, userId: uid } });
}

export async function deleteCategory(uid: string, id: string) {
  const owned = await prisma.category.findFirst({ where: { id, userId: uid } });
  if (!owned) return null;
  return prisma.category.delete({ where: { id } });
}
