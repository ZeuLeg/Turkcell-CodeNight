import { startControlServer } from './control/server.js';
import { startLoop } from './core/loop.js';

// Bootstrap: control server and metric loop
// Başlangıç: kontrol sunucusu ve metrik döngüsü
startControlServer();
startLoop();

process.on('SIGINT', () => {
  console.log('Shutting down simulator');
  process.exit(0);
});