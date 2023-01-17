import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-stone-100 py-10 h-min w-screen">
      <nav className="center flex text-lg font-medium uppercase text-stone-500">
        <ul className="flex justify-between gap-8 w-full px-12">
          <li className="">
            <Link href="/">Home</Link>
          </li>
          <li className="text-2xl text-stone-700">next shop</li>
          <li className="flex gap-4">
            <Link href="/cart">cart</Link>
            <Link href="/login">login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
