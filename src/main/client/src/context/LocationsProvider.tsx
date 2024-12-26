import {createContext, PropsWithChildren, useContext, useState} from "react";
import {Location} from "../types/location.ts";
import HomePage from "../components/pages/HomePage.tsx";
import CollectionsPage from "../components/pages/CollectionsPage.tsx";
import SettingsPage from "../components/pages/SettingsPage.tsx";
import LoginPage from "../components/pages/LoginPage.tsx";
import ProfilePage from "../components/pages/ProfilePage.tsx";
import LogoutPage from "../components/pages/LogoutPage.tsx";
import NotFoundPage from "../components/pages/NotFoundPage.tsx";

type LocationContext = {
    locations: Location[];
};

const LocationsContext = createContext<LocationContext | undefined>(undefined);

export default function LocationsProvider({children}: PropsWithChildren) {
    const [locations, _setLocations] = useState<Location[]>([
        {path: '/', title: 'Home', allowedRoles: ['USER', 'ADMIN'], element: <HomePage/>, navbar: {requireAuth: false}},
        {path: '/collections', title: 'Collections', allowedRoles: ['USER', 'ADMIN'], element: <CollectionsPage/>, navbar: {requireAuth: true}},
        {path: '/settings', title: 'Settings', allowedRoles: ['ADMIN'], element: <SettingsPage/>, navbar: {requireAuth: true}},
        {path: '/login', title: 'Login', element: <LoginPage/>},
        {path: '/profile', title: 'Profile', allowedRoles: ['USER', 'ADMIN'], element: <ProfilePage/>, navbar: {requireAuth: true, location: 'user'}},
        {path: '/logout', title: 'Logout', allowedRoles: ['USER', 'ADMIN'], element: <LogoutPage/>, navbar: {requireAuth: true, location: 'user'}},
        {path: '*', title: 'Not found', element: <NotFoundPage/>},
    ]);

    return (
        <LocationsContext.Provider value={{locations}}>
            {children}
        </LocationsContext.Provider>
    )
}

export function useLocations() {
    const context = useContext(LocationsContext);
    if (context === undefined) throw new Error('useLocations must be used within a LocationsProvider');
    return context;
}