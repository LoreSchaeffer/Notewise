import './Dropdown.css';
import {useNavigate} from "react-router-dom";
import {DropdownItem} from "../../types/dropdownItem.ts";
import {forwardRef} from "react";
import Container from "../Container.tsx";

type DropdownType = {
    items: DropdownItem[];
    open?: boolean;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownType>(({items, open}: DropdownType, ref) => {
    const navigate = useNavigate();

    const handleClick = (item: DropdownItem) => {
        if (item.href) navigate(item.href);
        else if (item.onClick) item.onClick();
    }

    if (!open) return null;

    return (
        <Container ref={ref} elevation={'24'} rounded className={`dropdown${open ? ' open' : ''}`}>
            <ul>
                {items.map((item, index) => (
                    <li key={index} onClick={() => handleClick(item)}>
                        <span className={'light t-normal'}>{item.label}</span>
                    </li>
                ))}
            </ul>
        </Container>
    )
    }

);

export default Dropdown;