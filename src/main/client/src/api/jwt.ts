import {jwtDecode, JwtPayload} from 'jwt-decode';
import {User} from "../types/user.ts";

interface UserJwtPayload extends JwtPayload {
    id?: string;
    roles?: string[];
}

export const decodeJwt = (accessToken: string) => {
    const decoded = jwtDecode<UserJwtPayload>(accessToken);

    if (decoded.exp && Date.now() >= decoded.exp * 1000) throw new Error('Token expired');

    return {
        id: decoded.id,
        username: decoded.sub,
        roles: decoded.roles
    } as User;
}