# 阶段性功能拆分（Next.js + Tailwind + Supabase + Vercel）

## 目标与范围
- 目标：基于现有原型（Home/Studio/Result/History），快速落地“上传照片 → 生成搞怪表情 → 自动文案 → 手机分享”的闭环。
- 范围：前端高保真落地 + 生成服务接入 + 作品管理 + 分享与隐私策略。

## 技术栈与职责划分
- 前端：Next.js（App Router）+ Tailwind CSS + 客户端上传/预览/状态管理。
- 后端：Supabase（Auth/DB/Storage/Edge Functions），AI/图像生成服务（第三方或自研）。
- 部署：Vercel（Web）+ Supabase（后端）。

## 阶段拆分

### Phase 0：骨架落地（1-2 周）
- 功能：
  - Home/Studio/Result/History 四页面落地为 Next.js 路由。
  - UI 组件库基础（按钮、卡片、标签、进度条、表单控件）。
  - Tailwind 主题（颜色、字体、间距体系）。
- 产出：可导航的前端骨架 + 静态数据渲染。

### Phase 1：MVP 生成闭环（2-4 周）
- 功能：
  - 上传与校验（类型/大小/失败提示）。
  - Supabase Storage：原图上传、生成图存储。
  - 生成流程：提交任务 → 轮询/订阅状态 → 结果页展示。
  - 自动文案：调用文案生成服务返回 3 条候选。
  - 基础分享：下载/复制链接（移动端友好）。
- 交互：上传进度、生成进度、失败重试、完成态 CTA。
- 产出：可用的“上传-生成-分享”完整链路。

### Phase 2：体验与留存提升（2-3 周）
- 功能：
  - 风格强度调节、生成功能参数化。
  - 作品历史与筛选（按时间/风格/关键词）。
  - 分享短链与失效策略（24h 默认）。
  - 生成缓存（相同输入与参数复用）。
- 产出：更顺畅的复用与传播体验。

### Phase 3：增长与商业化（持续迭代）
- 功能：
  - 登录与用户体系（Supabase Auth）。
  - 模板收藏、个性化偏好。
  - 额度/计费/套餐（若商业化）。
  - 运营看板（生成次数、分享率、转化）。
- 产出：可规模化运营的产品形态。

## 核心模块拆分

### 前端模块
- 页面：`/`(Home), `/studio`, `/result/[id]`, `/history`。
- 组件：UploadCard、StyleSelector、StrengthSlider、CopyableCaption、SharePanel、GenerationProgress、ResultGallery。
- 状态：useState + server actions/route handlers 或轻量状态库。

### 后端模块（Supabase）
- Storage：`uploads/`（原图）、`results/`（生成图）。
- Edge Functions：
  - `generate-emoji`：触发生成任务。
  - `generate-caption`：生成文案。
- Webhook/Queue（可选）：异步生成任务编排。

## 数据模型（建议）
- `users`：id, email, created_at。
- `generations`：id, user_id, style, intensity, status, input_url, output_url, created_at。
- `captions`：id, generation_id, text, tone。
- `share_links`：id, generation_id, token, expires_at。

## 部署与运维
- Vercel 环境变量：Supabase URL/Key、生成服务密钥。
- 监控：错误日志 + 生成失败率 + 平均生成时长。

## 验收标准（MVP）
- 10MB 以内图片上传成功率 > 98%。
- 生成成功率 > 90%，平均时长 < 10s（依赖模型）。
- Result 页面可下载/复制文案/分享链接。
