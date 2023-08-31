import { createRoot } from 'react-dom/client';
import { bootSentry } from './sentry';
import App from './App';
import '@/utils/flexible';

import '@/assets/style/index.less';

bootSentry();

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
