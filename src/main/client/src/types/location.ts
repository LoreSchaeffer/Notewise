import {ReactElement} from "react";

export type Location = {
    path: string;
    title?: string;
    allowedRoles?: string[];
    element: ReactElement;
    navbar?: Navbar;
}

export type Navbar = {
    requireAuth?: boolean;
    location?: 'left' | 'right' | 'user' | 'custom';
}