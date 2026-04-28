// 一般お問合せフォーム → Discord Webhook
// POST /api/contact

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    const formData = await request.formData();
    data = Object.fromEntries(formData);
  } catch (e) {
    return jsonResponse({ ok: false, error: 'リクエストの解析に失敗しました' }, 400);
  }

  const required = ['name', 'email', 'message'];
  const missing = required.filter(f => !(data[f] || '').trim());
  if (missing.length > 0) {
    return jsonResponse({ ok: false, error: `必須項目が未入力です: ${missing.join(', ')}` }, 400);
  }

  const webhook = env.DISCORD_CONTACT_WEBHOOK;
  if (!webhook) {
    return jsonResponse({ ok: false, error: 'サーバ設定エラー（管理者に連絡してください）' }, 500);
  }

  const embed = {
    title: '📩 一般お問合せ',
    color: 0xE87722,
    fields: [
      { name: 'お名前', value: trunc(data.name), inline: true },
      { name: 'ご所属', value: trunc(data.organization), inline: true },
      { name: 'メール', value: trunc(data.email), inline: false },
      { name: '電話', value: trunc(data.phone), inline: true },
      { name: 'お問合せ内容', value: trunc(data.message), inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: '全国若手議員の会 / 一般お問合せ' },
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
