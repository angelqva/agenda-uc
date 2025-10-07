"use client";
import React from "react";
import {
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
} from "@heroui/react";

import { useSession } from "next-auth/react";
import { LogoutModal } from "./LogoutModal";
import { useLogoutModalContext } from "./LogoutModalProvider";

export const UserNavbarBasic = () => {
    const { data: session } = useSession();
    const { openModal } = useLogoutModalContext();

    return (
        <>
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
                {session ? (<DropdownMenu aria-label="Acciones del Perfil" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                        <p><strong>Conectado como</strong></p>
                        <p><strong>{session.user?.correo || "usuario@example.com"}</strong></p>
                    </DropdownItem>
                    <DropdownItem key="settings"><strong>Mis Configuraciones</strong></DropdownItem>
                    <DropdownItem key="team_settings"><strong>Configuraciones del Equipo</strong></DropdownItem>
                    <DropdownItem key="analytics"><strong>Analíticas</strong></DropdownItem>
                    <DropdownItem key="system"><strong>Sistema</strong></DropdownItem>
                    <DropdownItem key="configurations"><strong>Configuraciones</strong></DropdownItem>
                    <DropdownItem key="help_and_feedback"><strong>Ayuda y Comentarios</strong></DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={openModal}>
                        <strong>Cerrar Sesión</strong>
                    </DropdownItem>
                </DropdownMenu>) : (<DropdownMenu aria-label="Acciones del Perfil" variant="flat">
                    <DropdownItem as={Link} key="sign_in" color="primary" href="/autenticarse">
                        <strong>Iniciar Sesión</strong>
                    </DropdownItem>
                </DropdownMenu>)}
            </Dropdown >
            <LogoutModal />
        </>
    );
};