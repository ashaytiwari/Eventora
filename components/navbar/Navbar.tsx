import Image from "next/image";
import Link from "next/link";

const Navbar = () => {

  return (
    <header>
      <nav>
        <Link href='/' className='logo'>
          <Image src='/images/app_logo.png' alt='logo' width={30} height={30} />
          <p>Eventora</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </ul>
      </nav>
    </header>
  );

};

export default Navbar;