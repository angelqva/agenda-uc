import { Input, InternalForwardRefRenderFunction, type InputProps } from "@heroui/react"
import React from "react";
import { EyeClosedBold, EyeOutline } from "../icons/iconify";

export const InputPassword = ({ ...props }: InternalForwardRefRenderFunction<"input", InputProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    return <Input endContent={<button
        aria-label="toggle password visibility"
        className="focus:outline-solid outline-transparent"
        type="button"
        onClick={toggleVisibility}
    >
        {isVisible ? (
            <EyeClosedBold className="text-2xl text-default-400 pointer-events-none" />
        ) : (
            <EyeOutline className="text-2xl text-default-400 pointer-events-none" />
        )}
    </button>} {...props} type={isVisible ? "text" : "password"} />
}