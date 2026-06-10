# 牌感日记 · 部署指南

## 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com) 注册并新建项目
2. 进入 **SQL Editor**，粘贴并运行 [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql)
3. 进入 **Project Settings → API**，复制：
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`（仅本地 seed 用，勿提交）

## 2. 本地开发

```bash
cp .env.example .env
# 编辑 .env 填入 Supabase 密钥

npm install
npm run dev
```

## 3. 导入 78 张牌义

在 Supabase 建表后运行：

```bash
node scripts/seed-cards.mjs
```

## 4. Auth 设置

Supabase → **Authentication → URL Configuration**：
- Site URL: `http://localhost:5173`（本地）或你的 Vercel 域名
- Redirect URLs: 同上 + 生产域名

可在 **Authentication → Providers** 开启 Email 注册。

## 5. 部署到 Vercel

1. 推送代码到 GitHub
2. [vercel.com](https://vercel.com) 导入项目
3. 配置环境变量 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`
4. 部署完成后，把 Vercel 域名加入 Supabase Redirect URLs

## 6. 后续补图

把牌面照片放入 `public/cards/`，文件名与牌 id 一致（如 `the-fool.jpg`），重新部署即可。

## 7. 修改牌义

- **改一两张**：Supabase → Table Editor → `tarot_cards`
- **批量改**：编辑 `src/data/tarotCards.js` 后运行 `node scripts/seed-cards.mjs`
