"use client";
import React, { useState } from "react";
import {
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

import { signOut, useSession } from "next-auth/react";
import { DialogBold, DialogCheckBold } from "@/components/icons/iconify";

export const UserNavbarBasic = () => {
    const { data: session } = useSession();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
        }
    };

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
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    {session ? (
                        <>
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
                            <DropdownItem key="logout" color="danger" onClick={() => setIsLogoutModalOpen(true)}>
                                <strong>Cerrar Sesión</strong>
                            </DropdownItem>
                        </>
                    ) : (
                        <DropdownItem as={Link} key="sign_in" color="primary" href="/autenticarse">
                            <strong>Iniciar Sesión</strong>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>

            <Modal isOpen={isLogoutModalOpen} backdrop="blur" size="lg" onOpenChange={setIsLogoutModalOpen} classNames={{
                backdrop: "bg-transparent",
            }}>
                <ModalContent className="py-2">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-2 text-2xl font-bold text-danger-500">
                                <DialogBold className="size-8" /> Confirmar cierre de sesión
                            </ModalHeader>
                            <ModalBody>
                                <p className="text-center">¿Estás seguro de que quieres cerrar tu sesión? <br /> Se perderán los cambios no guardados.</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleLogout}
                                    isLoading={isLoggingOut}
                                    disabled={isLoggingOut}
                                    startContent={!isLoggingOut && <DialogCheckBold className="size-6" />}
                                >
                                    {isLoggingOut ? "Cerrando sesión..." : "Confirmar"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};