import { createRoot } from 'react-dom/client';
import App from './App';
import '@/utils/flexible';

const root = createRoot(document.getElementById('root') as HTMLElement);
console.log('====== root_index', root)
root.render(<App />);
