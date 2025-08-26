import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseClasses = "btn focus-ring";
  const variantClasses = `btn-${variant}`;
  const sizeClasses = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const disabledClass = disabled || loading ? "disabled" : "";
  const fullWidthClass = fullWidth ? "w-100" : "";
  const loadingClass = loading ? "animate-pulse" : "";

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClass} ${fullWidthClass} ${loadingClass} ${className}`.trim();

  const renderIcon = () => {
    if (loading) {
      return <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>;
    }
    return icon ? <span className={iconPosition === "right" ? "ms-2" : "me-2"}>{icon}</span> : null;
  };

  const renderContent = () => {
    if (iconPosition === "right") {
      return (
        <>
          {children}
          {renderIcon()}
        </>
      );
    }
    return (
      <>
        {renderIcon()}
        {children}
      </>
    );
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

// Button variants for easy usage
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;
export const OutlineButton = (props) => <Button variant="outline-primary" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;

export default Button;

