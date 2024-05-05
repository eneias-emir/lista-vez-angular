import { environment } from '../environments/environment';

export const config = {
  webSocketServer: {
    url: environment.webSocketServer,
    retryCount: 1000,
    retryDelay: 5000
  },
  httpServer: 'http://127.0.0.1:8000',
  apiUrl: environment.apiUrl,
}
