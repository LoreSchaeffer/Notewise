import './Container.css';
import {forwardRef, HTMLAttributes, PropsWithChildren} from "react";

type ContainerType = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
    type?: 'default' | 'container' | 'primary' | 'primary-variant' | 'error' | 'error-variant' | 'warning' | 'warning-variant' | 'success' | 'success-variant';
    elevation?: '1' | '2' | '3' | '4' | '6' | '8' | '12' | '16' | '24';
    rounded?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerType>(({
                                                                 type = 'default',
                                                                 elevation,
                                                                 rounded = false,
                                                                 children,
                                                                 className,
                                                                 ...props
                                                             }: ContainerType, ref) => {
    let clsName = type;
    if (elevation && type == 'default') clsName += ' e' + elevation;
    if (rounded) clsName += ' rounded';
    if (clsName) clsName += ' ' + className;

    return (
        <div
            ref={ref}
            className={clsName}
            {...props}
        >
            {children}
        </div>
    )
});

export default Container;