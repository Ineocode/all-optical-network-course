# 全光网络架构 Resources

> 🏠 返回 [课程主页](index.html)

本清单是本工作区的一手资料来源。课程里的每个技术断言都应能追溯到这里的某一项。
标注格式：**链接** → 它覆盖什么 / 什么时候该翻它。

## Knowledge（知识来源）

### 标准与规范（最高可信度，先看这些）

- [ITU-T G.984.1 — GPON: General characteristics](https://www.itu.int/rec/T-REC-G.984.1/en)
  GPON 总体特征；**第 14 章定义 PON 保护类型 Type A/B/C/D**（Type B/C 的原始定义、切换类型与要求）。第 4 课主读。
  GPON（2.5G/1.25G）总体架构与术语的**原始定义**。搞清楚"分光比、测距、DBA"时看它。
- [ITU-T G.984.2 — GPON: Physical Media Dependent (PMD) layer](https://www.itu.int/rec/T-REC-G.984.2/en)
  **光功率预算的权威出处**：Class B+ / C+ 等光收发指标。做分光比与链路预算计算时看它。
- [ITU-T G.984.3 — GPON: Transmission convergence layer specification](https://www.itu.int/rec/T-REC-G.984.3/en)
  **第 12 章安全**：PON 威胁模型（下行广播→窃听威胁）、AES-128 CTR 加密；**附录 VI**：ONU 认证方式（序列号 / PLOAM 密码 / 注册 ID）。第 6 课主读。
- [ITU-T G.987.1 — XG-PON: General requirements](https://www.itu.int/rec/T-REC-G.987.1/en)
  10G 非对称 PON（下行 10G / 上行 2.5G）。
- [ITU-T G.9807.1 — XGS-PON（10G 对称）](https://www.itu.int/rec/T-REC-G.9807.1/en)
  当前院区全光**主力制式**的标准正文。选型、看清"对称 10G"含义时看它。
- [ITU-T G.989.1 — NG-PON2（40G）General requirements](https://www.itu.int/rec/T-REC-G.989.1/en)
  波长堆叠路线（TWDM-PON），理解"多波长升级"时看它。
- [ITU-T G.9804.1 — Higher speed PON（50G-PON）Requirements](https://www.itu.int/rec/T-REC-G.9804.1/en)
  50G-PON 的官方需求定义，对应国内"万兆全光/50G POL"宣传。
- [ITU-T G.988 — ONU management and control interface (OMCI)](https://www.itu.int/rec/T-REC-G.988/en)
  OLT 如何**远程管理 ONU**（业务模板、告警模型）——第 7–8 课配置模型的标准依据。
- [ITU-T G.671 — Transmission characteristics of optical components and subsystems](https://www.itu.int/rec/T-REC-G.671/en)
  **光器件损耗的权威表**：§6.6 PON 分光器最大插入损耗（1:2=3.9 dB … 1:64=20.9 dB，普通距离）、
  §6.7 连接器（≤0.5 dB）、§6.14 熔接（≤0.3/0.5 dB）。第 2 课的计算全靠它。
- [ITU-T G.652 — Characteristics of a single-mode optical fibre and cable](https://www.itu.int/rec/T-REC-G.652/en)
  光纤衰减系数上限（1310 nm ≤0.4 dB/km、1550 nm ≤0.35 dB/km）。第 2 课链路预算的光纤项。
  <span class="cite">提示：ITU 建议书 PDF 可通过 `https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-<编号>-<日期码>-I!!PDF-E&type=items` 免费下载（G.984.2/G.671/G.652 已验证；部分较新建议书如 G.9807.1 需接受条款）</span>
- [T/CECA 20002-2019《无源光局域网工程技术标准》](https://www.huawei.com/cn/news/2019/6/first-pol-engineering-technical-standard-china)（中国勘察设计协会，2019-06-06 发布，2019-08-01 实施）
  **中国第一个 POL 工程标准**，含 OLT/ONU 选型、分光器配置、光功率计算、验收要求。
  <span class="cite">（华为新闻稿确认发布时间与发布方；标准正文可通过标准平台/文库获取）</span>

### 厂商与行业一手资料（技术正确，但带厂商立场，注意甄别）

- [华为 iFTTO 医疗院区网络方案](https://e.huawei.com/en/solutions/enterprise-optical-network/campus-optix/medical-campus-optical-network)
  医院场景的**真实数字**：50G PON + AI 病理切片上传 129s→15s、一纤到房间省 80% 布线、
  Type C 双链路保护、XGS-PON Pro 单纤 12.5G、内外网硬隔离切片。医院方案课的核心案例源。
- [华为 Campus OptiX 全光院区总览](https://e.huawei.com/en/solutions/enterprise-optical-network/campus-optix)
  FTTO/iFTTO 架构、"用无源分光器替代有源设备、把多层交换压成 P2MP 两层"的官方表述。
- [Stephen Wilson (Omdia): FTTO for hospitals](https://e.huawei.com/en/blogs/2025/solutions/enterprise-optical-network/ftto-hospital)
  **第三方分析机构**对医院为什么需要 FTTO 的分析。本课硬数字来源：影像读取 30 s→&lt;1 s、
  光纤寿命约 30 年、可升级 10G/50G PON 不动光缆、武汉协和质子中心埋线难题、贵州省人民医院 50 ms 切换。医院场景设计主读。
- [Huawei Case Study: 南京农业大学（NAU）XGS-PON 全光校园](https://e.huawei.com/en/case-studies/enterprise-transmission-access/campus-optix-college-nanjing)
  **选型落地案例**：2020 年远程教学流量激增，原交换机网络撑不住 → 选 XGS-PON + Wi-Fi 6，
  OLT + 无源分光器 SPL + ONU + 面板 AP 两层架构，上下行对称 10G。第 3 课主读。
- [Huawei: An Intriguing Networking Choice — Passive Optical LAN (POL)](https://e.huawei.com/en/blogs/enterprise-transmission-access/passive-optical-lan)（S. J. Schuchart Jr., 2020-01-17）
  **本课的 primary source**：英文 POL 入门，讲透"无源=只有源和收端要供电"、铜缆 100m 限制、POL 可达 20km、新建/历史建筑最合适。已整理为双语 PDF（见 `reference/0001`）。
- [华为《全光园区网络技术及应用白皮书》](https://e.huawei.com/en/documents/solutions/enterprise-optical-network/06128ee0848f46318d5a0609e5215d1a)
  官方定义："all-optical campus network = 用 GPON/XGS-PON/Wi-Fi 7 构建的园区网，承载数据/语音/视频，架构简单、易演进、智能运维、高可靠。"
- [华为《POL 安装工艺与施工指导白皮书》](https://e.huawei.com/en/documents/solutions/commercial-market/9aa64882539e43d39b5db00d8b8f8609)（MWC 2025 发布）
  规范化 FTTO/POL 的设计、安装、测试、验收、运维流程；施工细节与验收标准看它。
- [Nokia — Passive Optical LAN](https://www.nokia.com/broadband-networks/passive-optical-lan/)
  另一家主流厂商的 POL 视角，用于交叉验证华为说法、看不同产品形态。
- [CommScope（康普）](https://www.commscope.com/)
  POL 的布线/ODN 侧（分光器、配线、连接器）产品与设计资料。
- [FTTH Council Europe](https://www.ftthcouncil.eu/)
  欧洲光纤接入行业组织；其 **FTTH Handbook** 是 PON 架构/PON 基础最经典的行业入门书（需注册下载）。

### 中文技术文章与课程（用于查漏补缺，注意作者水平参差）

- [与非网：还在纠结分光比？看懂园区全光方案，这一篇就够啦](https://www.eefocus.com/)
  中文里少见的把"分光比 vs 成本 vs 光功率"讲清楚的文章。
- [51CTO 学堂：园区全光网络怎么规划](https://edu.51cto.com/)
  视频课，偏工程落地。
- [CSDN：GPON 技术详解——光功率预算与网络架构](https://www.csdn.net/)
  中文复习材料，可快速找回光功率预算手感。

### 学术（用于深入原理，非必须）

- [arXiv（eess.SP / eess.NI）](https://arxiv.org/list/eess.SP/recent)
  搜 `passive optical network survey` / `PON power budget` 可获得综述论文。用于需要严格推导时。

### 实施 / 命令（第 8 课）

- [博客园《GPON 介绍及华为 OLT 网关注册配置流程》](https://www.cnblogs.com/sysk/p/8777508.html)
  华为 OLT（MA5680T/MA5800 同族 CLI）完整配置实例：dba-profile、ont-lineprofile（tcont/gem/gem mapping）、
  ont-srvprofile、ont add（sn-auth）、service-port。命令结构的主要依据。
- [简书《华为 OLT 业务配置》](https://www.jianshu.com/p/c89bc026c2a5)
  补充交叉验证：ont add 两种认证方式（sn-auth / password-auth）、native-vlan、service-port、tag-transform。
- [华为技术支持（官方命令参考）](https://support.huawei.com/enterprise/zh/index.html)
  **最终权威**。按产品型号搜“命令参考 / 配置指南”。注意：需登录/交互，curl 抓不到正文。
  <span class="cite">警示：型号/版本间命令有差异，第 8 课命令仅用于理解流程，实操前必查官方文档。</span>

### 本工作区自制参考

- [`reference/0001-architecture-comparison-cheatsheet.html`](./reference/0001-architecture-comparison-cheatsheet.html) — 传统以太网 vs 全光院区 对比表 + PON 制式表（打印友好）
- [`reference/0001-passive-optical-lan-bilingual.pdf`](./reference/0001-passive-optical-lan-bilingual.pdf) — POL 入门文章**中英对照双语 PDF**
- [`reference/0002-odn-power-budget-cheatsheet.html`](./reference/0002-odn-power-budget-cheatsheet.html) — ODN 器件损耗表 + 光功率预算判定（打印友好）
- [`reference/0002-itu-power-budget-bilingual.pdf`](./reference/0002-itu-power-budget-bilingual.pdf) — ITU-T G.984.2 / G.671 关键条款**中英对照双语 PDF**
- [`reference/0003-pon-standards-cheatsheet.html`](./reference/0003-pon-standards-cheatsheet.html) — PON 制式表 + 带宽账 + 选型矩阵（打印友好）
- [`reference/0003-xgspon-campus-case-bilingual.pdf`](./reference/0003-xgspon-campus-case-bilingual.pdf) — NAU XGS-PON 全光校园案例**中英对照双语 PDF**
- [`reference/0008-huawei-olt-cli-cheatsheet.html`](./reference/0008-huawei-olt-cli-cheatsheet.html) — 华为 OLT 配置命令速查（含警示：以官方文档为准）
- [`reference/0009-proposal-template.html`](./reference/0009-proposal-template.html) — 《新楼全光网络建设方案》可填写模板 + 两组练习数据
- [`GLOSSARY.md`](./GLOSSARY.md) — 本工作区的术语基准

## Wisdom（社区 / 把技能拿到真实世界检验）

- [通信人家园（txrjy.com）](https://www.txrjy.com/)
  中文通信行业**最高信号**的论坛之一，运营商/设备商/设计院从业者聚集。适合问"某制式现场坑""某厂商设备实际表现"。
- [华为企业技术支持社区（forum.huawei.com）](https://forum.huawei.com/enterprise/en/)
  有大量 GPON 技术帖（如"光功率损耗及预算""GPON 口光功率预算的五个规范"），现网问题问答很实用。
- [CHIMA 中国医院协会信息专业委员会](https://www.chima.org.cn/)
  医院信息科同行的行业社区——问"别家医院全光改造怎么做的、踩过什么坑"的最佳场所。
- [r/networking](https://www.reddit.com/r/networking/) · [r/FiberOptics](https://www.reddit.com/r/FiberOptics/)
  英文社区，适合验证 POL 在英语世界的真实部署经验与反对意见。
- 线下：本地设计院/集成商的技术交流会、Huawei/中兴/新华三的行业沙龙
  最直接的 wisdom 来源——带方案去被人挑毛病。

## Gaps（还缺什么）

- **缺** 一级分光 vs 二级分光的高可信一手来源：目前只能从 G.671 算损耗差、从 G.984.2 确认 ODN 为"树形与分支"结构，中文资料多为二手（知乎/搜狐/博客）。
- **缺** 医院内部机房/设备间建设标准（供电、UPS、空调、安防）的公开权威出处——OLT 选址会用到，目前靠工程常识。

- **缺** FTTH Handbook 的可直接下载 PDF（官网要注册），需要找一份公开镜像或替代入门书
- **缺** 中国《无源光局域网工程技术标准》(T/CECA 20002-2019) 的正式全文（目前只有二手转述）
- **缺** 具体 OLT 型号（如华为 EA5800 / MA5800）的**中文配置手册可直接抓取的稳定链接**——第 7–8 课配置课开课前需补上（可考虑 support.huawei.com 产品文档）
- **缺** 医院全光网络的第三方（非厂商）评估报告或论文

## 社区偏好

- 用户暂未表态是否需要加入社区；默认在"智慧获取"环节推荐，不强制。
