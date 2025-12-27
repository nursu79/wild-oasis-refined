import Navigation from '@/app/_components/Navigation';
import Logo from '@/app/_components/Logo';
import StickyHeader from './StickyHeader';
import MobileNavigation from './MobileNavigation';
import { auth } from '../_lib/auth';

async function Header() {
  const session = await auth();

  return (
    <StickyHeader>
      <div className='flex justify-between items-center max-w-7xl mx-auto'>
        <Logo />
        <Navigation session={session} />
        <MobileNavigation session={session} />
      </div>
    </StickyHeader>
  );
}

export default Header;
