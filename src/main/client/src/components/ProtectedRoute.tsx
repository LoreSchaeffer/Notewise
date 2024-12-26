import {PropsWithChildren, useEffect} from "react";
import {User} from "../types/user.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthProvider.tsx";
import Page from "./Page.tsx";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: User['roles']
}

export default function ProtectedRoute({allowedRoles, children}: ProtectedRouteProps) {
    const navigate = useNavigate();
    const {user, hasAnyRole} = useAuth();

    useEffect(() => {
        if (user === undefined) return;

        if (user == null) {
            navigate('/login', {replace: true});
            return;
        }

        if (allowedRoles && hasAnyRole(allowedRoles)) return;

        navigate(-1);
    }, [user, allowedRoles]);

    if (user !== null && allowedRoles && allowedRoles.some(role => user?.roles.includes(role))) {
        return <Page>{children}</Page>;
    } else {
        return null;
    }
}