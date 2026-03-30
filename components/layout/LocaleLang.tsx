'use client';

import { useEffect } from 'react';

function LocaleLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}

export { LocaleLang };
export default LocaleLang;
