// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// import { User } from '../../node_modules/.prisma/client/index';
import { User } from '@prisma/client/index';
import { getUsers } from '@/lib/prisma/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    let users: unknown = await getUsers();
    console.log(users, 'from api');
    if (users instanceof Array<User>) res.status(200).json(users);
    else {
      res.status(404).json({ message: 'no users found' });
    }
  }
}
