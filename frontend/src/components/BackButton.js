import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";

const BackButton = ({ 
  to = null, 
  label = "Back", 
  className = "", 
  variant = "default" 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const getButtonClass = () => {
    const baseClass = "back-button";
    const variantClass = `back-button-${variant}`;
    return `${baseClass} ${variantClass} ${className}`.trim();
  };

  return (
    <button 
      className={getButtonClass()}
      onClick={handleBack}
      type="button"
    >
      <Icon name="arrow-left" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
