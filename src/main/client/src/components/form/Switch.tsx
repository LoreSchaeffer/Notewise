import './Switch.css';
import {InputHTMLAttributes} from "react";

type SwitchType = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
}

export function Switch({label, className, id, ...props}: SwitchType) {
    return (
        <div className={'row' + (className ? ' ' + className : '')}>
            {label && <span>{label}</span>}
            <label
                className={'input-switch'}
                htmlFor={id}
            >
                <input
                    type={'checkbox'}
                    {...props}
                />
                <div className={'slider round'}></div>
            </label>
        </div>
    )
}