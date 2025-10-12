import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationDemo = () => {
  const { t } = useTranslation();

  return (
    <div className="translation-demo">
      <h2>{t('common.dashboard')}</h2>
      <p>{t('auth.welcome')}</p>
      <button className="cf-btn cf-btn-primary">
        {t('common.create')}
      </button>
      <button className="cf-btn cf-btn-secondary">
        {t('common.edit')}
      </button>
      <button className="cf-btn cf-btn-danger">
        {t('common.delete')}
      </button>
    </div>
  );
};

export default TranslationDemo;



