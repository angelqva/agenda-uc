"use client";
import React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    NavbarProps,
    cn,
} from "@heroui/react";
import { HomeOutline, LogoAgenda, PartsOutline, ShieldKey, VideoLibraryOutline } from "@/components/icons/iconify";
import { useNavbarBasic } from "./useNavbarBasic";

type NavBarBasicProps = Omit<NavbarProps, "children">;

/**
 * Navigation items configuration
 */
const navItems = [
    { id: "inicio", label: "Inicio", icon: HomeOutline, href: "/#inicio" },
    { id: "caracteristicas", label: "Características", icon: PartsOutline, href: "/#caracteristicas" },
    { id: "seguridad", label: "Seguridad", icon: ShieldKey, href: "/#seguridad" },
    { id: "tutoriales", label: "Tutoriales", icon: VideoLibraryOutline, href: "/#tutoriales" },
];

export const NavBarBasic = (props: NavBarBasicProps) => {
    const { activeScrollId, scrollToSection } = useNavbarBasic();

    return (
        <Navbar isBordered {...props}>
            <NavbarContent justify="start">
                <NavbarBrand className="mr-4">
                    <LogoAgenda className="size-8 mb-1 mr-2 text-primary-500" />
                    <p className="hidden sm:block font-bold text-inherit">AGENDA UC</p>
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(item.id);
                                    window.location.hash = item.id;
                                }}
                            >
                                <item.icon />
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="primary"
                            name="Jason Hughes"
                            size="sm"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as</p>
                            <p className="font-semibold">zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="team_settings">Team Settings</DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
                        <DropdownItem key="system">System</DropdownItem>
                        <DropdownItem key="configurations">Configurations</DropdownItem>
                        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
};