import './SiteNavbar.css';
import {Link, useLocation} from "react-router-dom";
import {useLocations} from "../context/LocationsProvider.tsx";
import {useAuth} from "../context/AuthProvider.tsx";
import {useState} from "react";
import {DropdownItem} from "../types/dropdownItem.ts";

function SiteNavbar() {
    const {locations} = useLocations();
    const {user, hasAnyRole} = useAuth();
    const location = useLocation();
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const navItems = locations.filter(l => l.navbar)
        .filter(l => l.navbar?.location == undefined || l.navbar?.location === 'left')
        .filter(l => !l.navbar?.requireAuth || (l.navbar?.requireAuth && hasAnyRole(l.allowedRoles)))
        .map(l => (
            <li key={l.path} className={`nav-link rounded${location.pathname === l.path ? ' active' : ''}`}>
                <Link to={l.path} className={'bold'}>{l.title}</Link>
            </li>
        ));

    const userNavItems = locations.filter(l => l.navbar)
        .filter(l => l.navbar?.location === 'user')
        .filter(l => !l.navbar?.requireAuth || (l.navbar?.requireAuth && hasAnyRole(l.allowedRoles)))
        .map(l => ({label: l.title, href: l.path} as DropdownItem));


    return (
        <>
            {showUserDropdown && (
                // <Dropdown items={userNavItems} onClose={() => setShowUserDropdown(false)}/>
                <></>
            )}
            <div id="siteNavbar" className={'navbar'}>
                <img className={'nav-brand'} src={'/images/icon.svg'} alt={'Notewise'}/>
                <nav>
                    <ul>
                        {navItems}
                    </ul>
                </nav>
                <nav className={'nav-right'}>
                    {user == null && (
                        <ul>
                            <li className={`nav-link rounded${location.pathname === '/login' ? ' active' : ''}`}>
                                <Link to={'/login'} className={'bold'}>Login</Link>
                            </li>
                        </ul>
                    )}
                    {user != null && (
                        <button className={'nav-avatar'} onClick={() => setShowUserDropdown(true)}>
                            <img src={'/images/user.webp'} alt={user.username}/>
                        </button>
                    )}
                </nav>
            </div>
        </>
    )
}

export default SiteNavbar;