import './index.css';
import { Router } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('app');
  if (appEl) {
    const router = new Router(appEl);
    router.init();
  }
});
