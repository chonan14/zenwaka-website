// 新規入会フォーム → Discord Webhook
// POST /api/join

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    const formData = await request.formData();
    data = Object.fromEntries(formData);
  } catch (e) {
    return jsonResponse({ ok: false, error: 'リクエストの解析に失敗しました' }, 400);
  }

  const required = ['name', 'age', 'phone', 'municipality', 'elected'];
  const missing = required.filter(f => !(data[f] || '').trim());
  if (missing.length > 0) {
    return jsonResponse({ ok: false, error: `必須項目が未入力です: ${missing.join(', ')}` }, 400);
  }

  const webhook = env.DISCORD_JOIN_WEBHOOK;
  if (!webhook) {
    return jsonResponse({ ok: false, error: 'サーバ設定エラー（管理者に連絡してください）' }, 500);
  }

  const embed = {
    title: '🆕 新規入会申込',
    color: 0xE87722,
    fields: [
      { name: '氏名', value: trunc(data.name), inline: true },
      { name: '年齢', value: trunc(String(data.age)), inline: true },
      { name: '電話番号', value: trunc(data.phone), inline: true },
      { name: '自治体名', value: trunc(data.municipality), inline: true },
      { name: '初当選年', value: trunc(String(data.elected)), inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: '全国若手議員の会 / 入会フォーム' },
  };

  try {
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
    if (!r.ok) {
      return jsonResponse({ ok: false, error: '通知の送信に失敗しました' }, 502);
    }
  } catch (e) {
    return jsonResponse({ ok: false, error: 'ネットワークエラーが発生しました' }, 502);
  }

  return jsonResponse({ ok: true });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function trunc(s, max = 1000) {
  if (!s) return '（未記入）';
  const str = String(s);
  return str.length > max ? str.slice(0, max - 5) + '…' : str;
}
