import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {User} from "../types/user.ts";
import {axiosPrivate} from "../api/axios.ts";
import {decodeJwt} from "../api/jwt.ts";

type AuthContext = {
    accessToken?: string | null;
    user?: User | null;
    handleLogin: (username: string, password: string) => Promise<void>;
    handleRefresh: () => Promise<string>;
    handleLogout: () => Promise<void>;
    hasAnyRole: (roles: User['roles'] | undefined) => boolean;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider({children}: PropsWithChildren) {
    const [accessToken, setAccessToken] = useState<string | null>();
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        initUserInformation();
    }, []);

    async function handleLogin(username: string, password: string) {
        try {
            const response = await axiosPrivate.post('/auth/login', {username, password});

            if (response.status !== 200) {
                switch (response.status) {
                    case 401:
                        return Promise.reject(new Error('Invalid username or password.'));
                    case 500:
                        return Promise.reject(new Error('Internal server error.'));
                    default:
                        return Promise.reject(new Error('Failed to sign in.'));
                }
            }

            const accessToken = response.data.accessToken;
            if (accessToken == null) return Promise.reject(new Error('Failed to sign in.'));

            setAccessToken(accessToken);
            setUser(decodeJwt(accessToken));

            window.localStorage.setItem('isLoggedIn', 'true');

            return Promise.resolve();
        } catch {
            setAccessToken(null);
            setUser(null);
            window.localStorage.setItem('isLoggedIn', 'false');

            return Promise.reject(new Error('Failed to sign in.'));
        }
    }

    async function handleRefresh() {
        try {
            const response = await axiosPrivate.get('/auth/refreshToken');

            if (response.status !== 200) throw new Error('Failed to refresh token.');

            const newAccessToken = response.data.accessToken;
            if (newAccessToken == null) throw new Error();

            setAccessToken(newAccessToken);
            setUser(decodeJwt(newAccessToken));

            window.localStorage.setItem('isLoggedIn', 'true');
            return Promise.resolve(newAccessToken);
        } catch {
            setAccessToken(null);
            setUser(null);
            window.localStorage.setItem('isLoggedIn', 'false');
            return Promise.reject();
        }
    }

    async function handleLogout() {
        try {
            const response = await axiosPrivate.get('/auth/logout');
            if (response.status !== 204) throw new Error(`Server responded with status code ${response.status}.`);
        } catch (e: any) {
            return Promise.reject(new Error(`Failed to logout. Cause: ${e.message}`));
        }

        setAccessToken(null);
        setUser(null);
        window.localStorage.setItem('isLoggedIn', 'false');
        return Promise.resolve();
    }

    function initUserInformation() {
        const isLoggedIn = window.localStorage.getItem('isLoggedIn');
        if (isLoggedIn && isLoggedIn === 'true') handleRefresh();
        else {
            setAccessToken(null);
            setUser(null);
        }
    }

    function hasAnyRole(roles: User['roles'] | undefined) {
        if (!roles) return true;
        if (user == null) return false;
        return roles.some(role => user.roles.includes(role));
    }

    return (
        <AuthContext.Provider value={{
            accessToken,
            user,
            handleLogin,
            handleRefresh,
            handleLogout,
            hasAnyRole
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}