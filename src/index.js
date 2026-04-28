// Worker エントリポイント
// /api/* のPOSTを各ハンドラへルーティング、それ以外は静的アセットへフォールスルー

import { onRequestPost as joinHandler } from '../functions/api/join.js';
import { onRequestPost as contactHandler } from '../functions/api/contact.js';
import { onRequestPost as pressHandler } from '../functions/api/press.js';

const routes = {
  '/api/join': joinHandler,
  '/api/contact': contactHandler,
  '/api/press': pressHandler,
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const handler = routes[url.pathname];

    if (handler) {
      if (request.method === 'POST') {
        return handler({ request, env, ctx });
      }
      return new Response(
        JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // デバッグ: env varsの存在確認 (値は返さない)
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({
        ok: true,
        bindings: {
          DISCORD_JOIN_WEBHOOK: !!env.DISCORD_JOIN_WEBHOOK,
          DISCORD_CONTACT_WEBHOOK: !!env.DISCORD_CONTACT_WEBHOOK,
          DISCORD_PRESS_WEBHOOK: !!env.DISCORD_PRESS_WEBHOOK,
          ASSETS: !!env.ASSETS,
        },
        envKeys: Object.keys(env).sort(),
      }, null, 2), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // 静的アセットにフォールスルー
    return env.ASSETS.fetch(request);
  },
};
