"use client"; 
import Link from "next/link";
import { 
  NavigationMenu, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { TiShoppingCart } from "react-icons/ti";
import { TfiVideoClapper } from "react-icons/tfi";

export default function Navbar() {
  return (
    <NavigationMenu className="items-center flex w-full">
      <NavigationMenuList className="w-full flex items-center justify-between p-4">
        {/* Home Link */}
        <NavigationMenuItem>
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* videos Link */}
        <NavigationMenuItem>
          <Link href="/videos" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <TfiVideoClapper size={30} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Profile Link */}
        <NavigationMenuItem>
          <Link href="/profile" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Profile
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Orders Link */}
        <NavigationMenuItem>
          <Link href="/orders" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <TiShoppingCart size={30} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Contact Us Link */}
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <IoMdHelpCircleOutline size={30} />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Sign Out Button */}
        <NavigationMenuItem>
          <Button onClick={() => signOut({ callbackUrl: '/' })}>
            Sign Out
          </Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
