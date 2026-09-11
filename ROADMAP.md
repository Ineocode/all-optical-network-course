# ROADMAP — 3 周 / 9 课

> 🏠 返回 [课程主页](index.html)

节奏：一天 45 分钟，一周 3 天，共 3 周。每课一个看得见的小成果（win），最后汇成一份《新楼全光网络建设方案》。

| # | 课 | 核心问题 | 本课 win | 状态 |
|---|----|----------|----------|------|
| 01 | [全光院区：把三层压成两层](./lessons/0001-what-is-all-optical-campus.html) | 全光院区到底是什么？和我熟的传统院区有何根本不同？新楼哪里该用？ | 能用一张图 + 三句话讲清 POL vs 三层以太网，并判断医院各区域适配性 | ✅ 已出 |
| 02 | [ODN 与光功率预算](./lessons/0002-odn-and-power-budget.html) | 光纤、分光器、损耗、预算怎么算？ | 独立完成一次分光比 + 光功率预算计算，判断点位能否开通 | ✅ 已出 |
| 03 | [PON 制式与选型](./lessons/0003-pon-standards-and-selection.html) | GPON/XGS-PON/50G-PON 怎么选？F5G 是什么？ | 按带宽/距离/终端选出一个制式并说明理由 | ✅ 已出 |
| 04 | [全光院区分层与拓扑](./lessons/0004-topology-and-protection.html) | OLT 放哪、ODN 怎么分、双归属/保护怎么做？ | 画出院区级 OLT + ODN 拓扑 | ✅ 已出 |
| 05 | [医院场景设计](./lessons/0005-hospital-scenario-design.html) | 病房/门诊/手术室/影像/无线/物联网怎么落？ | 产出医院全光网络的分区设计 | ✅ 已出 |
| 06 | [可靠性与运维](./lessons/0006-reliability-security-ops.html) | Type B/C 保护、ONU 认证、AES、网管、光功率监测 | 制定可靠性方案与运维要点清单 | ✅ 已出 |
| 07 | [认识 OLT/ONU 与业务模型](./lessons/0007-olt-onu-service-model.html) | 板卡、PON 口、ONU 注册、业务流、VLAN、DBA 是什么关系？ | 读懂一张 OLT 业务配置模型图 | ✅ 已出 |
| 08 | [上手配置](./lessons/0008-hands-on-configuration.html) | 一条端到端业务怎么配出来？ | 完成 PON 口 + ONU 注册 + 业务 VLAN 的端到端配置 | ✅ 已出 |
| 09 | [产出建设方案](./lessons/0009-build-the-proposal.html) | 怎么把 3 周所学变成一份可提交方案？ | 产出《新楼全光网络建设方案》框架 | ✅ 已出 |

**9/9 全部完成。** 后续可开的进阶路线：50G-PON 技术细节、OTDR 实测与故障定位、招标技术要求编写、运维实战。

## 每课固定结构

1. 复习锚点（连回上一课的 win，用回忆问句开场）
2. 知识（只讲支撑本课技能所需，密集引用一手来源）
3. 技能练习（测验 + 回忆练习，即时反馈）
4. 推荐阅读（primary source，含双语 PDF）
5. 页脚：有问题问老师（agent）+ 链接到相关 lesson / reference / glossary

## 参考文档（reference/）

- `0001-architecture-comparison-cheatsheet.html` — 架构对比 + 制式表（打印友好）
- `0001-passive-optical-lan-bilingual.pdf` — POL 入门文章中英对照双语 PDF
- `0002-odn-power-budget-cheatsheet.html` — ODN 器件损耗表 + 光功率预算判定（打印友好）
- `0002-itu-power-budget-bilingual.pdf` — ITU-T G.984.2 / G.671 关键条款中英对照双语 PDF
- `0003-pon-standards-cheatsheet.html` — PON 制式表 + 带宽账 + 选型矩阵（打印友好）
- `0003-xgspon-campus-case-bilingual.pdf` — 南京农业大学 XGS-PON 全光校园案例中英对照双语 PDF
- `0004-topology-and-protection-cheatsheet.html` — OLT 部署 + 一级/二级分光 + Type B/C 保护（打印友好）
- `0004-itu-protection-bilingual.pdf` — ITU-T G.984.1 第 14 章 PON 保护中英对照双语 PDF
- `0005-hospital-design-cheatsheet.html` — 三张网隔离 + 分区接入 + QoS + 硬数字（打印友好）
- `0005-hospital-ftto-bilingual.pdf` — Omdia《FTTO for hospitals》中英对照双语 PDF
- `0006-reliability-security-ops-cheatsheet.html` — 可靠性五层 + 安全 + 运维三阶段（打印友好）
- `0006-itu-security-bilingual.pdf` — ITU-T G.984.3 安全与 ONU 认证中英对照双语 PDF
- `0007-service-model-cheatsheet.html` — 硬件层次 + 上线三阶段 + 四对象 + T-CONT 类型 + 六步配置（打印友好）
- `0007-itu-service-model-bilingual.pdf` — ITU-T G.984.3 业务模型中英对照双语 PDF
- `0008-huawei-olt-cli-cheatsheet.html` — 华为 OLT 配置命令 + 命令↔模型对照 + 排错（打印友好）
- `0009-proposal-template.html` — 《新楼全光网络建设方案》可填写模板 + 两组练习数据 + 自检清单（打印友好）
