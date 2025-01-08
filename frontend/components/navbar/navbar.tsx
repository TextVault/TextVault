'use client';

import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NextLink from "next/link";
import clsx from "clsx";

// NextUI Components
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
import { User } from "@nextui-org/user";
import { Chip } from "@nextui-org/chip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/dropdown";

// Local Imports
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo } from "@/components/icons";
import {
  isAuthenticated,
  getUsername,
  deleteAuthCookie
} from "@/actions/auth.action";


export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [authState, setAuthState] = useState({
    authenticated: false,
    username: null as string | null
  });

  // Memoized authentication check
  const checkAuthentication = useCallback(async () => {
    try {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const username = await getUsername();
        setAuthState({ authenticated: true, username: username as string });
      } else {
        setAuthState({ authenticated: false, username: null });
      }
      return isAuth;
    } catch (error) {
      console.error('Authentication check failed', error);
      return false;
    }
  }, []);

  // Effect for initial and path-based authentication check
  useEffect(() => {
    checkAuthentication();
  }, [pathname, checkAuthentication]);

  // Memoized logout handler
  const handleLogout = useCallback(async () => {
    await deleteAuthCookie();
    await checkAuthentication();
    router.replace("/login");
  }, [checkAuthentication, router]);

  // Render methods
  const renderAuthenticatedMenu = () => (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <User name={authState.username || ''} />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label='User menu actions'>
        <DropdownItem key='profile' className='flex flex-col justify-start w-full items-start'>
          <p>Signed in as</p>
          <p>{authState.username}</p>
        </DropdownItem>
        <DropdownItem key='settings' href='/my'>My pastes</DropdownItem>
        <DropdownItem
          key='logout'
          color='danger'
          className='text-danger'
          onPress={handleLogout}
        >
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
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>      </NavbarContent>

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
        {authState.authenticated
          ? renderAuthenticatedMenu()
          : renderUnauthenticatedMenu()}
      </NavbarContent>

      {/* Rest of the navbar remains the same */}
    </NextUINavbar>
  );
};
