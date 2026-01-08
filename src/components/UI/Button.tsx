import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}) => {
    const buttonClasses = [
        'custom-btn',
        `btn-${variant}`,
        `btn-size-${size}`,
        fullWidth ? 'btn-full-width' : '',
        isLoading ? 'btn-loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="btn-spinner"></div>
            ) : (
                <>
                    {icon && <span className="btn-icon">{icon}</span>}
                    <span className="btn-text">{children}</span>
                </>
            )}
        </button>
    );
};

export default Button;
