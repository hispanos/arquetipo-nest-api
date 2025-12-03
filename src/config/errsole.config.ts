import errsole from 'errsole';
import * as path from 'path';
import * as fs from 'fs';
import ErrsoleMySQL from 'errsole-mysql';

/**
 * Configuración e inicialización de Errsole
 */
export function initializeErrsole() {
  if (process.env.ERSOLE_ENABLED === 'false') {
    return;
  }

  try {
    // Configurar directorio de logs
    const logsDir =
      process.env.ERSOLE_LOGS_DIR || path.join(process.cwd(), 'logs');

    // Crear directorio si no existe
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Inicializar Errsole
    errsole.initialize({
      storage: new ErrsoleMySQL({
        host: process.env.DB_HOST, // Replace with your actual MySQL host
        user: process.env.DB_USER, // Replace with your actual MySQL user
        password: process.env.DB_PASSWORD, // Replace with your actual MySQL password
        database: process.env.DB_NAME, // Replace with the name of your MySQL database
        port: parseInt(process.env.DB_PORT || '3306'),
      }),
      exitOnException: process.env.ERSOLE_EXIT_ON_EXCEPTION === 'true',
      collectLogs: process.env.ERSOLE_COLLECT_LOGS
        ? (process.env.ERSOLE_COLLECT_LOGS.split(',') as any[])
        : ['error', 'warn', 'info', 'debug', 'log'],
      enableConsoleOutput: process.env.ERSOLE_ENABLE_CONSOLE !== 'false',
      enableDashboard: process.env.ERSOLE_ENABLE_DASHBOARD !== 'false',
      port: parseInt(process.env.ERSOLE_PORT || '8001'),
      path: '/',
      appName: process.env.ERSOLE_APP_NAME || 'api-dian-modern',
      environmentName: process.env.NODE_ENV || 'development',
      serverName: process.env.ERSOLE_SERVER_NAME || 'api-dian-modern-server',
    });

    console.log('✅ Errsole inicializado correctamente');
  } catch (error) {
    console.warn('⚠️ Error al inicializar Errsole:', error);
    // No fallar si Errsole no está disponible
  }
}
