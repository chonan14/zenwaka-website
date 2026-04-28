# 全国若手議員の会 公式ホームページ

> Young Councilors Association of Japan — Official Website

1994年設立の超党派ネットワーク「全国若手議員の会」の公式ウェブサイト。

🌐 https://www.zenwaka.net （※ 公開後）

## 特徴

- 静的 HTML / CSS / JavaScript（ビルド不要）
- Cloudflare Pages にホスティング、Pages Functions で動的処理
- フォーム送信を Discord Webhook 経由で通知（入会・一般問合せ・取材依頼）
- ヘッダーに Google 翻訳ボタン（EN / FR）
- 会員数推移の棒グラフアニメーション、都道府県別9ブロック地図など、視覚的要素を多数実装
- レスポンシブ対応（PC / タブレット / モバイル）

## ページ構成

| パス | 内容 |
|---|---|
| `/` | トップ（ヒーロー・会員数・3本柱・全国9ブロック・メディア掲載） |
| `/about/` | 会の紹介（目的・事業・会長挨拶・事務局長挨拶・基本情報） |
| `/members/` | 役員紹介（顔写真付き＋部会・ブロック役員一覧） |
| `/activities/` | 今年度の活動（年表形式） |
| `/history/` | 歴史（始まりのエピソード・年表・歴代役員） |
| `/join/` | 入会案内 + 入会申込フォーム |
| `/media/` | メディア掲載 |
| `/contact/` | お問合せ（一般／マスコミ取材窓口） |
| `/links/` | 関連リンク |

## ローカル開発

### A) 静的プレビュー（フォーム送信を除く確認）

```bash
python3 -m http.server 8000
# → http://localhost:8000/
```

### B) フォーム機能込みのフルプレビュー

Cloudflare Pages Functions（`functions/api/*.js`）を動かすには [`wrangler`](https://developers.cloudflare.com/workers/wrangler/) が必要です。

```bash
npm install -g wrangler
cp .dev.vars.example .dev.vars
# .dev.vars を編集し、各 Discord Webhook URL を設定
wrangler pages dev .
# → http://localhost:8788/
```

## デプロイ

GitHub と Cloudflare Pages を連携することで、`main` ブランチへのpush毎に自動デプロイされます。

### Cloudflare Pages 設定

| 項目 | 値 |
|---|---|
| Build command | （なし） |
| Build output directory | `/` |
| Root directory | `/` |

### 環境変数（Settings → Environment variables）

Production / Preview の両方に以下を設定：

- `DISCORD_JOIN_WEBHOOK` — 入会申込通知用
- `DISCORD_CONTACT_WEBHOOK` — 一般お問合せ通知用
- `DISCORD_PRESS_WEBHOOK` — マスコミ取材依頼通知用

## ディレクトリ構成

```
.
├── index.html              # トップページ
├── about/                  # 会の紹介
├── members/                # 役員
├── activities/             # 活動
├── history/                # 歴史
├── join/                   # 入会
├── media/                  # メディア掲載
├── contact/                # お問合せ
├── links/                  # リンク集
├── assets/
│   ├── css/style.css       # スタイル全般
│   ├── js/main.js          # ナビ / フォーム送信 / グラフアニメ
│   └── img/                # 画像（ヒーロー・役員・地図SVG）
├── functions/api/          # Cloudflare Pages Functions（フォーム→Discord）
│   ├── join.js
│   ├── contact.js
│   └── press.js
├── requirements.md         # 要件定義
├── wireframes.md           # ワイヤーフレーム
├── .dev.vars.example       # 環境変数テンプレート
└── .gitignore
```

## クレジット

- 日本地図 SVG: [geolonia/japanese-prefectures](https://github.com/geolonia/japanese-prefectures) (GFDL)
- 日本語フォント: [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) (Google Fonts, OFL)

## ライセンス

© 全国若手議員の会 / Young Councilors Association of Japan

掲載写真・原稿等のコンテンツの無断転載・再配布を禁じます。
