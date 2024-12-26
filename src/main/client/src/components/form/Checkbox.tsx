import './Checkbox.css';
import {InputHTMLAttributes} from "react";

type CheckboxType = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
}

export function Checkbox({label, className, ...props}: CheckboxType) {
    return (
        <label className={'input-checkbox' + (className ? ' ' + className : '')}>
            <input
                type={'checkbox'}
                {...props}
            />
            {label && <span>{label}</span>}
        </label>
    )
}