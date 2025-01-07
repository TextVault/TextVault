'use client';

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { link as linkStyles } from "@nextui-org/theme";
import { User } from "@nextui-org/user";
import NextLink from "next/link";
import clsx from "clsx";
import { Chip } from "@nextui-org/chip";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  Logo,
} from "@/components/icons";
import { isAuthenticated, getUsername, deleteAuthCookie } from "@/actions/auth.action";

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/dropdown";

export const Navbar = () => {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const router = useRouter();

  const checkAuthentication = async () => {
    const isAuth = await isAuthenticated();
    if (isAuth) {
      const usernameData = await getUsername();
      setUsername(usernameData as string);
      setAuthenticated(isAuth);
    }

    return isAuth;
  };

  useEffect(() => {
    checkAuthentication();
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    const authStatus = await checkAuthentication(); // Await the result
    setAuthenticated(authStatus); // Update state with the new authentication status
    router.replace("/login");
  }, [pathname]);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">TextVault</p>
            <Chip size="sm" color="primary" variant="flat">
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
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {authenticated ? (
          <Dropdown>
            <NavbarItem>
              <DropdownTrigger>
                <User
                  name={username}
                />
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              aria-label='User menu actions'
              onAction={(actionKey) => console.log({ actionKey })}>
              <DropdownItem
                key='profile'
                className='flex flex-col justify-start w-full items-start'>
                <p>Signed in as</p>
                <p>{username}</p>
              </DropdownItem>
              <DropdownItem key='settings' href='/my'>My pastes</DropdownItem>
              <DropdownItem
                key='logout'
                color='danger'
                className='text-danger'
                onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
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
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.githubProject}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
