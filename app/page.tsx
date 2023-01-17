import Image from 'next/image';
import { Inter } from '@next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default async function Home() {
  let response = await fetch('http://localhost:3000/api/user', { method: 'GET' });
  let users = await response.json();

  return (
    <div>
      <h1>home</h1>
      <ul className="flex flex-col text-sm list-none gap-1 list-inside bg-slate-300">
        {users?.map((user: any) => (
          <li key={user.id} className="text-base">
            <Link href={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
