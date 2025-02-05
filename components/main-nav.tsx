"use client";

import * as React from "react";
import Link from "next/link";
// import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Film, Search, Bell, User } from "lucide-react";
import { Button } from "./ui/button";

export function MainNav() {
  return (
    <div className="fixed top-0 w-full z-50 bg-gradient-to-b from-background to-background/0 backdrop-blur-sm border-b border-border/50">
      <div className="container flex h-16 items-center justify-center px-4">
        <Link href="/" className="flex items-center mr-6 gap-1">
          <Film className="h-6 w-6" />
          <span className="font-bold text-xl">MovieFlix</span>
        </Link>
        <div className=" flex items-center justify-between w-full">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/tv-shows">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    TV Shows
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/movies">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Movies
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/new">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    New & Popular
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className=" flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
