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

export default function Navbar() {
  return (
    <NavigationMenu className="flex items-center">
      <NavigationMenuList className="flex space-x-4">
        {/* Home Link */}
        <NavigationMenuItem>
          <Link href="/home" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Shop Link */}
        <NavigationMenuItem>
          <Link href="/shop" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shop
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
              Orders
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {/* Contact Us Link */}
        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact Us
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
