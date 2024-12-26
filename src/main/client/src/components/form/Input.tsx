import './Input.css';
import {InputHTMLAttributes} from "react";

type InputContainerType = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}

export function Input({label, id, className, placeholder, ...props}: InputContainerType) {
    return (
        <div className={'input-container'}>
            <input
                className={'input-field' + (className ? ' ' + className : '')}
                placeholder={' '}
                {...props}
            />
            <label className={'input-label'} htmlFor={id}>{label}</label>
        </div>
    )
}