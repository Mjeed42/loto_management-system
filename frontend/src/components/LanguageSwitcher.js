import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  // Initialize RTL/LTR classes on component mount
  useEffect(() => {
    const currentLanguage = i18n.language;
    if (currentLanguage === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.setAttribute('data-rtl', 'true');
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
      document.body.setAttribute('data-rtl', 'true');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-rtl', 'false');
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
      document.body.setAttribute('data-rtl', 'false');
    }
  }, [i18n.language]);

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    
    // Update document direction for RTL support
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.documentElement.setAttribute('data-rtl', 'true');
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
      document.body.setAttribute('data-rtl', 'true');
      
      // Force reflow to ensure styles are applied
      document.documentElement.offsetHeight;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-rtl', 'false');
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
      document.body.setAttribute('data-rtl', 'false');
      
      // Force reflow to ensure styles are applied
      document.documentElement.offsetHeight;
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
