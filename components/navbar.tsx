import Link from "next/link";

import MainNav from "@/components/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import getCategories from "@/actions/get-categories";
import { UserNav } from "./user-nav";
import { getDataFromToken } from "@/actions/get-data-from-token";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const categories = await getCategories();
  const { userId, userName, userEmail } = getDataFromToken();
  // if (!userId) {
  //   redirect('/sign-in');
  // }

  return ( 
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">STORE</p>
          </Link>
          <MainNav data={categories} />
          <div className="ml-auto flex items-center gap-x-4">
            <NavbarActions />
            {userId && <UserNav {...{ userName, userEmail }} />}
          </div>
        </div>
      </Container>
    </div>
  );
};
 
export default Navbar;
