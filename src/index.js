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

    // 静的アセットにフォールスルー
    return env.ASSETS.fetch(request);
  },
};
