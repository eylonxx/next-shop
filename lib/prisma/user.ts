import prisma from '../../lib/prisma/index';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error: any) {
    return { error };
  }
}

export async function login(credentials: any) {
  const user = await prisma.user.findFirst({ where: { email: credentials.email } });
  if (!user || user.password !== credentials.password) return null;
  return user;
}

export async function createUser(user: any) {
  try {
    const userFromDB = await prisma.user.create({ data: user });
    return { user: userFromDB };
  } catch (error: any) {
    return { error };
  }
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
}
