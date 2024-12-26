import './Button.css';
import {forwardRef, HTMLAttributes, PropsWithChildren} from "react";

type ButtonType = PropsWithChildren<HTMLAttributes<HTMLButtonElement>> & {
    type?: 'default' | 'primary' | 'primary-variant' | 'error' | 'error-variant' | 'warning' | 'warning-variant' | 'success' | 'success-variant';
    outlined?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonType>(({type = 'default', outlined = false, children, className, onClick, ...props}: ButtonType, ref) => {
    let clsName = 'btn';
    if (type != 'default') clsName += ' btn-' + type;
    if (outlined && (type == 'primary' || type == 'success' || type == 'warning' || type == 'error')) clsName += ' btn-outline';
    if (className) clsName += ' ' + className;

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;

        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - (button.offsetLeft + radius)}px`;
        circle.style.top = `${e.clientY - (button.offsetTop + radius)}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) ripple.remove();

        button.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        createRipple(e);
        if (onClick) onClick(e);
    }

    return (
        <button
            ref={ref}
            className={clsName}
            {...props}
            onClick={handleClick}
        >
            {children}
        </button>
    )
});

export default Button;