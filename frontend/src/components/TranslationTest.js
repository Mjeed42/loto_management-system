import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log('=== Translation Debug Info ===');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Is initialized:', i18n.isInitialized);
    console.log('Has resource bundle:', i18n.hasResourceBundle(i18n.language, 'translation'));
    
    if (i18n.hasResourceBundle(i18n.language, 'translation')) {
      const bundle = i18n.getResourceBundle(i18n.language, 'translation');
      console.log('Resource bundle keys:', Object.keys(bundle));
      console.log('LOTO List section:', bundle.lotoList);
    }
    
    console.log('LOTO List Title:', t('lotoList.title'));
    console.log('Common Home:', t('common.home'));
    console.log('================================');
  }, [i18n, t]);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Translation Test</h3>
      <p><strong>Current Language:</strong> {i18n.language}</p>
      <p><strong>Is Initialized:</strong> {i18n.isInitialized ? 'Yes' : 'No'}</p>
      <p><strong>LOTO List Title:</strong> {t('lotoList.title')}</p>
      <p><strong>LOTO List Subtitle:</strong> {t('lotoList.subtitle')}</p>
      <p><strong>Search Placeholder:</strong> {t('lotoList.searchPlaceholder')}</p>
      <p><strong>Actions:</strong> {t('lotoList.actions')}</p>
      <p><strong>View:</strong> {t('lotoList.view')}</p>
      <p><strong>Edit:</strong> {t('lotoList.edit')}</p>
      <p><strong>Common Home:</strong> {t('common.home')}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => i18n.changeLanguage('en')}>English</button>
        <button onClick={() => i18n.changeLanguage('ar')}>العربية</button>
      </div>
    </div>
  );
};

export default TranslationTest;
