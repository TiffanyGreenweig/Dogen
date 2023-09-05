import { createRoot } from 'react-dom/client';
import App from './App';
import '@/utils/flexible';
import '@/assets/style/common.less';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
