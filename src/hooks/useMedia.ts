import { matchMedia, matchMediaAddListener } from '@utils/matchMediaPolyfill';
import { useEffect, useState } from 'react';

const useMedia = (query: string) => {
  const [state, setState] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    let mounted = true;
    matchMediaAddListener();
    const mql = matchMedia()(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql?.addEventListener?.('change', onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql?.removeEventListener?.('change', onChange);
    };
  }, [query]);

  return state;
};

export default useMedia;
