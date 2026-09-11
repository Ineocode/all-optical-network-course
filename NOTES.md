# NOTES

> 🏠 返回 [课程主页](index.html)

## 用户画像与偏好

- **语言**：中文讲解；专业术语保留英文并给出中英对照（OLT / ONU / ODN / PON…）
- **背景**：
  - 传统院区网络（核心-汇聚-接入、VLAN、交换机）**熟悉**
  - 交换机**配置命令不常练** → 配置课要给"可照抄的命令 + 每条命令在干什么"，不要假设他记得 CLI
  - 通信工程专业课学过**光纤与光传输** → 物理层（波长、损耗、dB）可快讲，但要点明与 PON 的衔接
- **学习节奏**：每天 45 min，一周 3 天，共 3 周 = **9 个 lesson** 的路线
- **英文资料处理**：接受英文一手资料，但**必须整理成中英对照双语 PDF** 放进 `reference/`（用户明确要求）
  - **排版偏好（重要）**：喜欢 **Trancy / 沉浸式翻译式的「上下排」双语**——一句英文，紧跟一句中文，逐句交替；**不要**左右分栏对照
  - 生成方式：写双语 HTML → Chrome headless `--print-to-pdf`（本机无 pandoc/wkhtmltopdf）
  - 本机 Chrome 路径：`C:\Program Files\Google\Chrome\Application\chrome.exe`
  - 命令：`chrome --headless=new --no-pdf-header-footer --print-to-pdf=out.pdf file:///...html`
- **落地导向**：每课一个 tangible win，最终产出《新楼全光网络建设方案》

## 课程完成（2026-09-11）

9 课全部产出（L1–L9）。第 9 课按用户要求把重点放在“如何产出建设方案”，并给了**两组不同项目数据**练手：
- **项目 A**：专科楼，12 层 / 1200 点 / 预算敏感 / 普通业务（结论：XGS-PON，1:32，Type B）
- **项目 B**：综合楼，20 层 / 3000 点 / 关键业务（结论：XGS-PON + 50G-PON 混合，普通 1:32、影像手术 1:4–1:8，Type C）

配套 `reference/0009-proposal-template.html` 是可填写的方案模板（含预算/带宽/拓扑留白与自检清单）。

## 数据使用约定（2026-09-11）

用户没有新楼真实数据（距离/层数/点位数），明确表示：**第 3 课及后续需要项目数据的地方，用案例数据来演示即可**。
→ 后续 lesson 的示例一律用**典型三甲医院新楼**的假设参数（800 床 / 20 层 / 2000 信息点），并搭配真实公开案例（NAU、深圳华南医院等）作交叉印证，不要向用户反复索要真实数据。

## 范围确认（2026-09-11）

用户确认 `MISSION.md` 范围合理：**只改造一栋新建大楼**的全光框架，不涉及多院区、不做存量老院区全面改造。

## 教学偏好（待补充）

- 喜欢"看得见成果"式课程；步骤式操作课（先讲清概念再上手）
- 愿意做测验/回忆练习（本工作区已内建 quiz.js / recall.js）

## 环境备忘（本机网络坑）

- `HTTP_PROXY/HTTPS_PROXY=127.0.0.1:16780` **指向一个没启动的代理**，直接 curl 会失败
- 抓取网络资料时要 `env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY -u all_proxy curl ...`
- 可访问：Huawei（e.huawei.com / support.huawei.com）、ITU-T、arXiv、CSDN、360搜索、txrjy（通信人家园）
- 不可访问：Wikipedia、Google、DuckDuckGo、Yandex（验证码）、知乎（403）、Fiber Broadband Association（Cloudflare）
- 搜索技巧：360 搜索（so.com）对中英文技术查询都可用；Bing 会退化成词典结果，不可靠

## 资料获取技巧

- **ITU-T 建议书 PDF 免费下载**：
  1. 打开 `https://www.itu.int/rec/T-REC-<编号>/en` 查最新日期码（如 `G.984.2-201908-I`）
  2. 下载：`https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-<日期码>!!PDF-E&type=items`
  - 已验证可下载：G.984.2（50 页）、G.671（52 页）、G.652（30 页）
  - G.9807.1（XGS-PON）等较新建议书返回登录/条款页，无法直下 → 用设备手册代替
- **华为官网资料**：站点搜索 API 可用（POST `searchdirectnew/op`，带 `X-Hw-Id` 头）；
  `e.huawei.com/.../documents/...` 是白皮书落地页，正文多为 JS 渲染，抓取需注意
- **Huawei 论坛 / 知乎 / 百度**：均为 JS 渲染或反爬，curl 抓不到正文；用 so.com 搜索看摘要即可

## 动画演示组件（2026-09-11 新增）

`assets/pon-flow.js` —— **自包含**的光信号可视化组件（无依赖，样式自动注入）。
用法：`<div class="ponmap" data-mode="..."></div>` + `<script src="../assets/pon-flow.js"></script>`。

已接入全部 9 课：

| 课 | mode | 演示内容 |
|---|---|---|
| L1 | architecture | 两层架构，下行广播脉冲分支到所有 ONU |
| L2 | power | 光脉冲沿途变暗，HUD 实时显示累计损耗 / 剩余预算 |
| L3 | bandwidth | 下行广播 vs 上行 TDMA，按钮切换 |
| L4 | protection | 模拟主干断纤 + Type B/C 切换 |
| L5 | services | 三张网 TDM 硬隔离 vs 仅 VLAN |
| L6 | security | AES 开/关，恶意 ONU 窃听演示 |
| L7 | model | ONU→T-CONT→GEM→service-port→VLAN 流水线 |
| L8 | pipeline | 配置顺序（data-stages） |
| L9 | pipeline | 方案六道工序 |

**修正（2026-09-11）**：L4 的 `protection` 初版有设计缺陷——Type B/C 只差一条怪线，且只模拟了主干故障（B/C 都能恢复），看起来没区别。
已重写：双输入双输出分光器 + 双上行 ONU，故障点可在 **无 → OLT/主干 → 配线段** 循环；
关键区别是**配线段故障**——Type B 业务中断（无光脉冲），Type C 倒换到备用配线。
已用无头浏览器模拟点击验证四种状态文本与脉冲数均不同。

**二次修正**：光脉冲原来从 OLT 直奔“分光器圆心”，与画出的光纤折点（IN_A/OUT_1）不重合，路径偏移。
已重写 `activePath()`，让光路折点与绘制链路**用同一组坐标**；并把故障点循环、端口高亮（①/②）、
故障 ✗ 标记、ONU 变灰（业务中断）一并补上。
**L5 services 修正（两轮）**：
- 第一轮：初版右侧只有三条漂浮的彩色线条 + 灰色文字标签，没有**矩形框**，且标签压在 ONU 上 → 补了三个业务框。
- 第二轮（按用户要求“先用逻辑验收动画”）：先写下逻辑链条（业务源自 OLT；共用同一张 PON：OLT→分光器→ONU；隔离发生在该链路；到 ONU 后分送入三框），
  再逐条比对，发现 3 处违反逻辑：① 切片从分光器才开始（应源自 OLT）② 粗管道只画了分光器→ONU ③ 管道画在分光器之后、把菱形盖住。
  已重画：切片贯穿 OLT→分光器→ONU，粗管道先画、节点在后，切点在 OLT(180)/分光器(480)/ONU(620)，业务框在 x=790。
  并用无头浏览器写了 **11 条逻辑断言（全部 PASS）**：起点=OLT、终点=ONU、经过分光器、TDM 三条分开、VLAN 三条合并、框=3/颜色/名称、分光器在管道之上、有脉冲。

已用无头浏览器断言 6 种状态的路径折点：TypeB无故障=A口→入A→出①→①号口；TypeB主干故障=B口→入B→出①；
TypeB配线故障=null（无通路）；TypeC配线故障=A口→入A→出②→备用迂回→②号口。均已验证正确。

扩展方式：在 `pon-flow.js` 里加 `PonFlow.prototype.scene_<mode>` 即可；
`pipeline` 是通用流水线（`data-stages` 用 `|` 分隔，`\n` 可换行）。
已用 Chrome headless `--dump-dom` 验证 9 课全部能渲染并产生光脉冲。

## 课程页脚约定（2026-09-11）

**用户明确要求：不要 `.ask` 页脚组件。** 已从 9 课全部删除，并移除 `lesson.css` 里对应的 `.footer .ask` 样式。
该组件原本写着“把你的真实数字发我 / 有问题问我”之类的引导语，用户不喜欢。
**但用户要保留其中的“下一课预告”**，只去掉“发我数据/问我”。
→ 已用中性的 `.footer .next` 盒子（标 “下一课” / “进阶方向”）恢复预告：L2–L9 各一处；L1 的预告本来就在正文 §07「下一步」。
→ **今后新建 lesson：不加“发我数据/问我”的页脚；如需预告，用 `.footer .next`。**
页脚 `.links`（速查表 / 术语表 / 路线图）保留。

## 仓库 / 团队分享（2026-09-11）

- **在线网站（GitHub Pages）**：https://ineocode.github.io/all-optical-network-course/ （已开启；public 仓库免费；根目录含 `.nojekyll` 禁用 Jekyll，保持与本地文件一致）
- **GitHub 仓库**：https://github.com/Ineocode/all-optical-network-course （**public**，默认分支 `main`）
  - 已改为 public：任何拿到链接的人都能下载（无需邀请协作者）。已验证匿名 ZIP 归档可下（codeload 200）。
- **网络处置（重要）**：本机 `github.com` HTTPS 被阻断（DNS 解析到被墙 IP，curl 超时 000），但 `api.github.com`/`codeload.github.com`/`raw.githubusercontent.com` 可通。
  - 解法：**SSH over 443**。`ssh.github.com:443` 可连；已生成部署密钥 `~/.ssh/id_ed25519_alloptical` 并通过 API 注册到仓库；`~/.ssh/config` 加 `github-deploy` 别名。
  - `origin` 已改为 `git@github-deploy:Ineocode/all-optical-network-course.git`，`git push` 正常。
  - 备选：把 `github.com` 在 hosts 里指向可用 IP（实测 `20.27.177.113` / `20.200.245.247` / `140.82.114.3` 可通，默认的 `20.205.243.166` 不通）。
- 已推送 46 个文件；`.research/`（21MB 研究草稿与 ITU PDF）已在 `.gitignore` 中排除
- 本机环境有个失效代理（`http_proxy=127.0.0.1:16780`），已配置：
  `git config --global http.https://github.com.proxy ""`（并同样配 api.github.com）
  → 现在直接 `git push` 即可，无需再清 env；若别的工具报代理错，仍可在命令前加
  `env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY -u all_proxy`
- 日后更新：`git add -A && git commit -m "..." && git push`
- 团队加入：GitHub 仓库 Settings → Collaborators 邀请；或直接 `git clone https://github.com/Ineocode/all-optical-network-course.git`

## 导航约定（2026-09-11）

根目录新增 **`index.html` 课程主页（路线图导航页）**，含三周分段课程卡片 + 参考文档库 + 学习辅助链接。

每页回主页入口：
- **课程页**：刊头 `course-label` 变成“← 课程主页”链接 + 页脚 `.links` 首项
- **速查表**：页脚 `.links` 首项加“课程主页”
- **双语 PDF 源文件（reference/*-bilingual.html）**：`</header>` 后加 `.home-nav`，并在 `@media print` 下隐藏（不影响 PDF）
- **根目录 Markdown**（MISSION/RESOURCES/GLOSSARY/NOTES）：标题下加“🏠 返回课程主页”

→ **今后新建任何页面都要带上回主页链接**；新增 lesson 记得同步更新 `index.html` 的路线图。

**已删除 `ROADMAP.md`（2026-09-11）**：它与 `index.html` 功能重叠（都是路线图/导航），用户要求保留课程主页。
原 `ROADMAP.md` 的内容已并入 `index.html`；所有指向 `ROADMAP.md` 的链接已改为指向 `index.html` 或删除。

## 每课固定结构（原 ROADMAP 保留项）

1. 复习锚点（连回上一课的 win，用回忆问句开场）
2. 知识（只讲支撑本课技能所需，密集引用一手来源）
3. 技能练习（测验 + 回忆练习，即时反馈）
4. 推荐阅读（primary source，含双语 PDF）
5. 页脚：`.next` 预告 + `.links` 导航（**不放“发我数据/问我”**）

## 深色模式（2026-09-11）

GitHub Pages 本身不提供主题，深色模式由站点自己实现：
- `assets/theme.js`：在 `<head>` 同步设定 `data-theme`（跟随 `prefers-color-scheme`），右上角注入切换按钮，选择写入 `localStorage`（key `teach-theme`）；用户未手动选时，系统主题变化实时跟随。
- `lesson.css`：`:root[data-theme="dark"]` 覆盖全部颜色变量，另加了图示/动画用的表面色变量（`--node-active-fill` / `--pipe-bg` / `--panel` / `--down-fill` / `--ok-fill` / `--bad-fill`）。
- `pon-flow.js`：注入的 CSS 类改用变量；场景里写死的表面色（管道、业务框、ONU 变灰、OLT 高亮）改用 `var(...)`。
- 已接入 19 个页面（index + 9 lessons + 9 速查表）；7 个双语 PDF 源文件是打印用文档，没接。
- 已验证：切换后 `body`/`code`/`th`/SVG 节点/文字的 computed 颜色均变为暗色，切回后恢复。

## 视觉设计（已定）

- 预设：Editorial Technology（编辑网格、规则线、等宽编号、全无衬线）
- 强调色：Anthropic 橘 `#d97757`；小字/链接用深档 `#b3542f`（WCAG AA）
- 第二强调色：蓝 `#2f5d8a`（用于"传统有源以太网"一侧，与橘色的"全光/无源"对照）
- 共享样式：`assets/lesson.css`（所有 lesson 与 reference 都链接它）
