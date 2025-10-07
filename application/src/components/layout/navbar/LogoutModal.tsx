"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";
import { DialogBold, DialogCheckBold } from "@/components/icons/iconify";
import { useLogoutModalContext } from "./LogoutModalProvider";

export function LogoutModal() {
    const { isOpen, setIsOpen, isLoggingOut, handleLogout } = useLogoutModalContext();

    return (
        <Modal isOpen={isOpen} backdrop="blur" size="lg" onOpenChange={setIsOpen} classNames={{
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
    );
}