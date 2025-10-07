"use client";
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    NavbarProps,
    cn,
} from "@heroui/react";
import { HomeOutline, LogoAgenda, PartsOutline, ShieldKey, VideoLibraryOutline } from "@/components/icons/iconify";
import { useNavbarBasic } from "./useNavbarBasic";
import { UserNavbarBasic } from "./userNavbarBasic";

type NavBarBasicProps = Omit<NavbarProps, "children">;

/**
 * Navigation items configuration
 */
const navItems = [
    { id: "inicio", label: "Inicio", icon: HomeOutline, href: "#inicio" },
    { id: "caracteristicas", label: "Características", icon: PartsOutline, href: "#caracteristicas" },
    { id: "seguridad", label: "Seguridad", icon: ShieldKey, href: "#seguridad" },
    { id: "tutoriales", label: "Tutoriales", icon: VideoLibraryOutline, href: "#tutoriales" },
];

export const NavBarBasic = (props: NavBarBasicProps) => {
    const { activeScrollId } = useNavbarBasic();

    return (
        <Navbar isBordered {...props}>
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <LogoAgenda className="size-8 mb-1 mr-2 text-primary-500" />
                    <p className="font-bold text-inherit">AGENDA UC</p>
                </NavbarBrand>
                <NavbarContent className="hidden lg:flex gap-4 ml-8">
                    {navItems.map((item) => (
                        <NavbarItem key={item.id} isActive={activeScrollId === item.id}>
                            <Link
                                color="foreground"
                                className={cn(
                                    "font-semibold flex items-center justify-center gap-2 rounded p-1",
                                    activeScrollId === item.id && "font-bold text-primary-500"
                                )}
                                href={item.href}
                            >
                                <item.icon />
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                <UserNavbarBasic />
            </NavbarContent>
        </Navbar>
    );
};