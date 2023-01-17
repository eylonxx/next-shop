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
  try {
    const user = await prisma.user.findFirst({ where: { email: credentials.email } });
    if (user?.password === credentials.password) return user;
  } catch (error: any) {
    return { error };
  }
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
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return { user };
  } catch (error: any) {
    return { error };
  }
}
