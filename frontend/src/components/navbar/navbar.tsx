"use client";

import React from "react";
import NextLink from "next/link";
import clsx from "clsx";

// NextUI Components
import { Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

// Local Imports
import { link as linkStyles } from "@nextui-org/theme";
import { signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/src/config/site";
import { ThemeSwitch } from "@/src/components/theme-switch";
import { GithubIcon, Logo } from "@/src/components/icons";

export default function Navbar() {
  const { data: session } = useSession({
    required: false,
  });

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  // Render methods
  const renderAuthenticatedMenu = () => (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User name={session?.user?.name || ""} />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        <DropdownItem key="profile" className="flex flex-col justify-start w-full items-start">
          <p>Signed in as</p>
          <p>{session?.user?.name}</p>
        </DropdownItem>
        <DropdownItem key="my_pastes">
          <Link href="/profile">My pastes</Link>
        </DropdownItem>
        <DropdownItem key="logout" className="text-danger" color="danger" onPress={handleLogout}>
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

  const renderUnauthenticatedMenu = () => (
    <>
      <NavbarItem className="hidden md:flex">
        <Button
          as={Link}
          className="text-sm font-normal text-default-600"
          href={siteConfig.links.signup}
          variant="light"
        >
          Sign up
        </Button>
      </NavbarItem>
      <NavbarItem className="hidden md:flex">
        <Button
          as={Link}
          className="text-sm font-normal text-default-600"
          href={siteConfig.links.login}
          variant="flat"
        >
          Log in
        </Button>
      </NavbarItem>
    </>
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      {/* Navbar content remains mostly the same */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href={"/"}>
            <Logo />
            <p className="font-bold text-inherit">TextVault</p>
            <Chip color="primary" size="sm" variant="flat">
              Beta
            </Chip>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>{" "}
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {session == null ? renderAuthenticatedMenu() : renderUnauthenticatedMenu()}
      </NavbarContent>
    </NextUINavbar>
  );
}
