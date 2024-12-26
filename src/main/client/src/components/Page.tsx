import {PropsWithChildren, useEffect, useState} from "react";
import {useLocations} from "../context/LocationsProvider.tsx";
import {useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthProvider.tsx";
import SiteNavbar from "./SiteNavbar.tsx";
import {Spinner} from "./Spinner.tsx";

export default function Page({children}: PropsWithChildren) {
    const {user} = useAuth();
    const location = useLocation();
    const {locations} = useLocations();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (user !== undefined) setReady(true);
    }, [user]);

    useEffect(() => {
        const title = locations.find(l => l.path === location.pathname)?.title;
        if (title == null || location.pathname === '/') document.title = 'Notewise';
        else document.title = 'Notewise ' + title;
    }, []);

    return (
        <>
            <SiteNavbar/>
            <main>
                {
                    ready
                        ? children
                        : <div style={{
                            height: 'calc(100vh - var(--navbar-height))',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}><Spinner/></div>
                }
            </main>
        </>
    )
}