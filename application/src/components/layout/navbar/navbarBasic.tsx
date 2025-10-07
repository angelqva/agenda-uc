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
import { useSession } from "next-auth/react";
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
    const { activeScrollId } = useNavbarBasic();
    const { data: session } = useSession();

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
                            >
                                <item.icon />
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            </NavbarContent>

            <NavbarContent as="div" className="items-center" justify="end">
                {session ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                color="primary"
                                size="sm"
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Conectado como</p>
                                <p className="font-semibold">{session.user?.correo || "usuario@example.com"}</p>
                            </DropdownItem>
                            <DropdownItem key="settings">Mis Configuraciones</DropdownItem>
                            <DropdownItem key="team_settings">Configuraciones del Equipo</DropdownItem>
                            <DropdownItem key="analytics">Analíticas</DropdownItem>
                            <DropdownItem key="system">Sistema</DropdownItem>
                            <DropdownItem key="configurations">Configuraciones</DropdownItem>
                            <DropdownItem key="help_and_feedback">Ayuda y Comentarios</DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                Cerrar Sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <Link
                        color="primary"
                        href="/autenticacion/iniciar-sesion"
                        className="font-semibold"
                    >
                        Iniciar Sesión
                    </Link>
                )}
            </NavbarContent>
        </Navbar>
    );
};