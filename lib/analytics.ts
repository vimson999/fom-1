export const GOOGLE_ANALYTICS_ID = 'G-J5CTEBXCRF' as const;

export const GOOGLE_ADSENSE_CLIENT_ID = 'ca-pub-5054963576840100' as const;
const GOOGLE_ADSENSE_PROTOCOL = 'https:' as const;
const GOOGLE_ADSENSE_SCRIPT_HOST = 'pagead2.googlesyndication.com' as const;
export const GOOGLE_ADSENSE_SCRIPT_SRC =
  `${GOOGLE_ADSENSE_PROTOCOL}//${GOOGLE_ADSENSE_SCRIPT_HOST}/pagead/js/adsbygoogle.js?client=${GOOGLE_ADSENSE_CLIENT_ID}` as const;
