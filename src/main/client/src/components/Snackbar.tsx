import './Snackbar.css';
import {HTMLAttributes, PropsWithChildren, useEffect, useState} from "react";

type SnackbarType = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
    type?: 'default' | 'primary' | 'primary-variant' | 'success' | 'warning' | 'error';
    text?: string;
    dismissible?: boolean;
    position?: 'bottom' | 'top';
    timeout?: number;
    show?: boolean;
    onCreate?: () => void;
    onShow?: () => void;
    onDismiss?: () => void;
    onTimeout?: () => void;
}

export function Snackbar({
                             type = 'default',
                             text,
                             children,
                             dismissible = false,
                             position = 'bottom',
                             timeout = -1,
                             show = false,
                             onCreate,
                             onShow,
                             onDismiss,
                             onTimeout,
                             className,
                             ...props
                         }: SnackbarType) {
    const [visible, setVisible] = useState(show);
    const [hiding, setHiding] = useState(false);

    useEffect(() => {
        if (onCreate) onCreate();
    }, [onCreate]);

    useEffect(() => {
        if (visible && timeout > 0) {
            const timer = setTimeout(() => {
                if (onTimeout) onTimeout();
                hideSnackbar();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [visible, timeout, onTimeout]);

    useEffect(() => {
        if (show) showSnackbar();
        else hideSnackbar();
    }, [show]);

    const showSnackbar = () => {
        setVisible(true);
        setHiding(false);
        if (onShow) onShow();
    }

    const hideSnackbar = () => {
        setHiding(true);

        setTimeout(() => {
            setVisible(false);
            if (onDismiss) onDismiss();
        }, 600);
    }

    let clsName = [
        'snackbar',
        type !== 'default' && `snackbar-${type}`,
        position === 'top' && 'snackbar-top',
        show && 'show',
        hiding && 'hide',
    ]
        .filter(Boolean)
        .join(' ');
    if (className) clsName += ` ${className}`;

    if (!visible) return null;

    return (
        <div className={clsName} {...props}>
            <div className="snackbar-content">{children ? children : text}</div>
            {dismissible && (
                <span
                    className="snackbar-close"
                    onClick={hideSnackbar}
                    aria-label="Dismiss Snackbar"
                >
                    &times;
                </span>
            )}
        </div>
    );
}