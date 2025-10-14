import { useState, useEffect } from 'react';
import { Linking } from 'react-native';

export interface AppIntent {};
// export type OpenProductIntent = AppIntent & {
//     productId: number;
// } 

export class OpenProductIntent implements AppIntent {
    url: string;

    constructor(url: string) {
        this.url = url;
    }

    getProductId(): number | undefined {
        //   const match = this.url.match(/product\/(\d+)/);
        //   if (match && match[1]) {
        //       const productId = parseInt(match[1], 10);
        //       if (!isNaN(productId)) {
        //           return productId;
        //       }
        // }
        const parts = this.url.split('/');
        return Number(parts[parts.length - 1]);
    }
}

export const useDeepLink = () => {
  const [intent, setIntent] = useState<OpenProductIntent | null>(null);

  const clearIntent = () => {
    setIntent(null);
  };

  const handleUrl = (url: string | null) => {
    if (!url) {
      return;
    }
    console.log("Received URL:", url);

    // Expected URL format: apichallenge://product/1
    if (url.startsWith('apichallenge://product')) {
      setIntent(new OpenProductIntent(url));
    }
  };

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      handleUrl(initialUrl);
    };

    getUrlAsync();

    // Register callback if a URL is used while the app is opened.
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    return () => subscription.remove();
  }, []);

  return { intent, clearIntent };
};
