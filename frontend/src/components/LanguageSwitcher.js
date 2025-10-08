import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    
    // Update document direction for RTL support
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
    }
  };

  const currentLanguage = i18n.language;

  return (
    <div className="language-switcher">
      <div className="language-dropdown">
        <button className="language-toggle">
          <span className="language-flag">
            {currentLanguage === 'ar' ? '🇸🇦' : '🇺🇸'}
          </span>
          <span className="language-text">
            {currentLanguage === 'ar' ? 'ع' : 'EN'}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>
        <div className="language-menu">
          <button
            className={`language-option ${currentLanguage === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            🇺🇸 English
          </button>
          <button
            className={`language-option ${currentLanguage === 'ar' ? 'active' : ''}`}
            onClick={() => changeLanguage('ar')}
          >
            🇸🇦 العربية
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
