import { connect } from 'cloudflare:sockets';

const userID = 'd342d11e-d424-4583-b36e-524ab1f0afe4';
const proxyIP = '104.16.1.1';

export default {
  async fetch(request, env, ctx) {
    try {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader !== 'websocket') {
        const url = new URL(request.url);
        if (url.pathname === `/${userID}`) {
          const vlessConfig = `vless://${userID}@${proxyIP}:443?encryption=none&security=tls&type=ws&host=${url.hostname}&path=%2F#Cloudflare-Pages-V2Ray`;
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head><title>V2Ray Config</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #fff;">
              <h2>Your V2Ray (VLESS) Key</h2>
              <textarea readonly style="width: 100%; height: 100px; padding: 10px; background: #1e293b; color: #38bdf8; font-size: 13px;">${vlessConfig}</textarea>
            </body>
            </html>
          `, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        return new Response('Pages Worker Status: Active', { status: 200 });
      }
      return new Response('WebSocket connection required', { status: 400 });
    } catch (err) {
      return new Response(err.toString(), { status: 500 });
    }
  }
};
