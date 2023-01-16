import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-stone-100 py-12">
      <nav className="center flex items-center text-sm font-medium uppercase text-stone-500">
        <ul className="flex justify-center gap-8 m-auto">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/users">Users</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
