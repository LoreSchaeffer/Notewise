import './DropdownButton.css';
import {useEffect, useRef, useState} from "react";
import Button from "../Button.tsx";
import Dropdown from "./Dropdown.tsx";
import {MdExpandLess, MdExpandMore} from "react-icons/md";

type DropdownButtonType = {
    label?: string;
}

export function DropdownButton({label}: DropdownButtonType) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handler = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setOpen(false);
        };

        if (open) setTimeout(() => document.addEventListener('click', handler), 0);

        return () => {
            document.removeEventListener('click', handler);
        }
    }, [open]);

    const toggleDropdown = () => {
        if (!open) setOpen(true);
        else setOpen(false);
    }

    // https://github.com/CodeCompleteYT/react-dropdown/tree/main/src/components

    return (
        <div className={'dropdown-container'}>
            <Button type={'primary'} onClick={toggleDropdown}>
                {label}
                {!open ? <MdExpandMore/> : <MdExpandLess/>}
            </Button>
            <Dropdown ref={dropdownRef} open={open} items={[
                {label: 'Item 1', href: '/item1'},
                {label: 'Item 2', href: '/item2'},
                {label: 'Item 3', onClick: () => console.log('Item 3 clicked')}
            ]}></Dropdown>
        </div>
    )
}