'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NavAnimatedLogo() {
  return (
    <Link
      href="/"
      className="group flex size-10 shrink-0 items-center justify-center gap-2 rounded-full bg-secondary text-lg font-semibold text-primary-foreground md:h-10 md:w-10 md:text-base"
    >
      <div>
        <Image alt="LevelEDU Logo" src="/3.png" height={35} width={35} />
      </div>
      <span className="sr-only">LevelEDU</span>
    </Link>
  );
}
