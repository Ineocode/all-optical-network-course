# 全光网络架构 Glossary

> 🏠 返回 [课程主页](index.html)

本工作区的**术语基准**。所有课程、参考文档、学习记录都按这里的定义用词。
规则：一个概念只留一个正名，其余写法列为 _避免_。

> 说明：术语在用户**能正确使用**后才正式收入本表（本表会随课程增长）。
> 标 <span class="pill on">L1</span> 的为第一课引入并测过的基础词。

## 架构层次

**全光院区网络（All-Optical Campus Network）** <span class="pill on">L1</span>：
用 PON 技术（GPON / XGS-PON / 50G-PON）构建的院区网，把传统"核心-汇聚-接入"三层有源交换机压成
"OLT + 无源 ODN + ONU"两层点到多点结构，一根光纤承载数据/语音/视频/物联网多种业务。
_Avoid_：全光网（易与电信 AON 混淆，见"常见歧义"）、纯光网络

**POL（Passive Optical LAN，无源光局域网）** <span class="pill on">L1</span>：
PON 技术在企业/院区局域网（LAN）场景的落地形态，是把 PON 从"光纤到户"搬到办公楼、医院、校园的说法。
_Avoid_：无源以太网、光局域网

**FTTO（Fiber to the Office）/ iFTTO** <span class="pill on">L1</span>：
光纤直达办公室/房间/终端的部署形态；华为把带 AI 与物联网能力的版本叫 iFTTO（intelligent FTTO）。
_Avoid_：光纤到桌面（FTTD 是更早的、含义不同的叫法）

**PON（Passive Optical Network，无源光网络）** <span class="pill on">L1</span>：
点到多点（P2MP）的光接入网：局端一个 OLT 通过无源分光器连接多个 ONU，中间不需要供电的有源设备。

**OLT（Optical Line Terminal，光线路终端）** <span class="pill on">L1</span>：
PON 的**局端设备**，放在机房/主机房。它是有源的，负责上行接入汇聚、PON 口管理、ONU 注册与业务下发。
_Avoid_：光端机（那是传输设备叫法）

**ONU / ONT（Optical Network Unit / Terminal，光网络单元/终端）** <span class="pill on">L1</span>：
PON 的**用户侧设备**，放在房间/终端处。它也是有源的，负责把光信号转成电口（网口/电话/AP/物联网）。
本工作区统一用 **ONU**；厂商文档里的 ONT 视为同一物的别名。
_Avoid_：光猫（家用语境可以，工程语境不用）

**ODN（Optical Distribution Network，光分配网）** <span class="pill on">L1</span>：
OLT 与 ONU 之间**全部无源**的部分：光纤、分光器、连接器、配线（ODF）等。全光院区"省电、免弱电间"的关键就在这一层。

## 光分配网（ODN）

**分光器（Splitter）** <span class="pill on">L1</span>：
把一路光功率**均分**成 N 路的无源器件（1:N）。不耗电、不易坏，但会带来**插入损耗**，N 越大损耗越大。

**分光比（Split ratio）**：
OLT 一个 PON 口下最多挂多少个 ONU 的比例，如 1:16、1:32、1:64。分光比越高越省钱，但每个 ONU 分到的光功率和带宽越小。

**插入损耗（Insertion Loss, IL）** <span class="pill on">L2</span>：
光通过某个器件后损失的光功率（dB）。ODN 各器件的 IL 直接相加构成链路总损耗。

**熔接（Fusion splice）** <span class="pill on">L2</span>：
两段光缆永久接续（用电弧熔接）。标准最大损耗：主动对准 0.3 dB、被动对准 0.5 dB。

**活动连接器（Optical connector）** <span class="pill on">L2</span>：
可插拔的光连接（跳纤/法兰）。单芯标准最大损耗 0.5 dB。

**ODF（光纤配线架）** <span class="pill on">L2</span>：
光缆成端、跳线调度、留纤的配线架。属无源 ODN 的一部分，每个 ODF 成端会产生连接器损耗。

## 光功率预算与链路计算

**光功率预算（Optical power budget）** <span class="pill on">L1 L2</span>：
发送光功率 − 接收灵敏度，即这条链路"允许损耗多少 dB"。链路实际损耗（光纤 + 分光器 + 连接器 + 熔接 + 光路代价 + 余量）必须 ≤ 它。
_Avoid_：光功率余量（余量是预算减去实际损耗后的剩余，不是同一个概念）

**Class B+ / C+ / D** <span class="pill on">L2</span>：
ITU-T G.984.2 定义的 GPON 光功率预算等级，最大允许损耗分别为 28 / 32 / 35 dB。XGS-PON 用 N1/N2/E1/E2 等级，方法相同。

**光路代价（Optical path penalty）** <span class="pill on">L2</span>：
色散、反射等造成的等效功率代价；G.984.2 规定最大 1 dB，链路预算中必须计入。

**设计余量（Design margin）** <span class="pill on">L2</span>：
为光纤老化、温度变化、后期维修而预留的 dB 裕量（工程上常留 3 dB）。没有余量的方案会"初期能通、几年后掉线"。

## PON 制式

**GPON**：
ITU-T G.984 系列，下行 2.5G / 上行 1.25G。第一代主流制式，仍在大量存量网络中使用。

**XG-PON** <span class="pill on">L3</span>：
ITU-T G.987，**10G 下行 / 2.5G 上行（非对称）**。上行是它的短板；XGS-PON 才是对称版。

**XGS-PON**：
ITU-T G.9807.1，**上下行对称 10G**。当前院区全光的主力制式（"万兆全光"通常指它）。

**NG-PON2** <span class="pill on">L3</span>：
ITU-T G.989，40G（4 个波长 × 10G）的波长堆叠方案，可平滑扩容。

**EPON / 10G-EPON** <span class="pill on">L3</span>：
IEEE 802.3ah / 802.3av，1.25G 对称 / 10G 以太网 PON。IEEE 路线，国内新院区较少选用。

**50G-PON**：
ITU-T G.9804 系列，单波长 50G（下行 49.7664G；上行可选 12.44/24.88/49.77G）。面向 Wi-Fi 7 / AI 病理等高带宽场景的新一代制式。

**F5G / F5G-A**：
ETSI 提出的"第五代固定网络 / 其演进版"行业标签（对应 5G 之于移动）。是**产业叙事**，不是某个具体协议；
看到"F5G 全光院区"就理解为"基于 PON 的全光院区方案"。_Avoid_：把 F5G 当成一种技术标准

## 拓扑、可靠性与运维

**P2MP（Point-to-Multipoint，点到多点）** <span class="pill on">L1</span>：
一个 OLT 口经分光器服务多个 ONU 的拓扑。相对于交换机的点对点（P2P）星型，它省光纤但共享介质。

**共享介质 / 广播下行 + TDMA 上行** <span class="pill on">L3</span>：
一个 PON 口的带宽由该口下所有 ONU 共享：下行是广播（ONU 各取所需），上行是时分复用（同一时刻只有一个 ONU 能发）。

**收敛比（Oversubscription ratio）** <span class="pill on">L3</span>：
（所有 ONU 的承诺带宽之和）÷（PON 口线路速率）。收敛比越小越宽松；接近或超过 1 说明带宽门过不了。
_避免_：把"分光比"当成带宽分配比例（分光比只决定光功率与端口数量，不直接等于带宽比例）

**OAM / O&M** <span class="pill on">L3</span>：
运行、管理与维护（Operations, Administration and Maintenance）。ONT/ONU 的远程管理靠 OMCI（G.988）实现。

**一级分光 / 二级分光** <span class="pill on">L4</span>：
ODN 的两种分光结构。一级（集中）分光是 OLT → 一个 1:N → ONU；二级（分散）分光是 OLT → 1:M → 1:K → ONU（级联）。二级多一级插损与接续点，但省主干光纤、可逐级下沉。

**双归属（dual parenting）** <span class="pill on">L4</span>：
PON 的两套线路终端不放在同一台 OLT 设备内，而是位于物理分离的两处，提高抗故障能力（G.984.1 明确允许）。

**Type A / B / C / D 保护** <span class="pill on">L1 L4</span>：
ITU-T G.984.1 定义的 PON 双份保护配置。Type A 只双份光纤（已废弃）；
<strong>Type B</strong> 双份 OLT 侧与到分光器的光纤，只能恢复 OLT 侧，冷备、切换可能丢帧；
<strong>Type C</strong> 同时双份 OLT 侧与 ONU 侧，任意一点可恢复，热备、可无损切换（hitless）；Type D 是 B/C 混合（已废弃）。
_Avoid_：把 Type B 当成"全路径保护"（它保护不到 ONU 侧）

**冷备 / 热备（cold / hot standby）** <span class="pill on">L4</span>：
备用电路的工作方式。冷备需切换激活，切换期间可能丢信号/丢帧（Type B）；热备随时可用，可实现无损切换（Type C）。

**LOS / LOF / 信号劣化** <span class="pill on">L4</span>：
保护倒换的自动触发条件：信号丢失（Loss of Signal）、帧丢失（Loss of Frame）、误码率超过阈值的信号劣化。

**AES 加密** <span class="pill on">L6</span>：
PON 下行数据的加密机制（G.984.3）。算法为 AES，采用 CTR 模式，密钥长度固定 128 bit。
开它的原因：PON 下行是**广播**的，被改装的 ONU 可能窃听同口其他用户的下行数据。

**ONU 认证** <span class="pill on">L6</span>：
防止非法 ONU 接入的机制（G.984.3 附录 VI）：基于序列号（SN）、PLOAM 密码、注册 ID（国内常称 LOID），也允许 MAC 地址入库等。

**OMCI（ONU Management and Control Interface）** <span class="pill on">L6</span>：
ITU-T G.988 定义的接口，OLT 靠它远程管理与配置 ONU：业务模板、属性、告警与性能统计。

**OTDR（光时域反射仪）** <span class="pill on">L6</span>：
通过发射光脉冲并分析反射/后向散射来定位光纤断点、损耗与长度。因分光器无源不可管理，ODN 故障常靠它定位。

## 医院场景

**三张网（内网 / 外网 / 设备网）** <span class="pill on">L5</span>：
内网承载 HIS/EMR/PACS 等诊疗业务（安全最高）；外网承载办公与互联网、患者/访客 Wi-Fi；
设备网承载监护、楼控、门禁、资产定位、医疗设备等物联网终端。

**硬隔离切片（TDM 硬管道）** <span class="pill on">L5</span>：
在同一张 PON 上用时分复用为不同业务划出独立管道，使内网/外网/设备网做到硬隔离，比 VLAN 逻辑隔离更强。

**零漫游（zero roaming）** <span class="pill on">L5</span>：
终端在 Wi-Fi AP 之间移动时连接不中断。移动护理车、手术示教等需要连续连接的场景的刚需。

**光 AP / 开放物联网** <span class="pill on">L5</span>：
带物联网接入能力的光终端（如面板式），可接资产标签、传感、门禁等；华为方案用 NearLink 实现亚米级资产定位与设备全生命周期管理。

**一纤到房间** <span class="pill on">L5</span>：
一根光纤进入每个房间，同时承载数据/电话/电视/AP/物联网多种业务，典型可降低约 80% 布线量。

## 业务模型与配置

**ONU-ID** <span class="pill on">L7</span>：
ONU 在 PON 上的身份标识，在激活（测距）时分配。

**Alloc-ID（分配标识）** <span class="pill on">L7</span>：
OLT 分配给 ONU 的 12 位标识，用于标识该 ONU 内接收上行带宽分配的承载流量实体（T-CONT 或上行 OMCC）。
每个 ONU 至少有一个**默认 Alloc-ID，其数值等于 ONU-ID**，承载上行 PLOAM 与 OMCC，不可去分配或更改。

**T-CONT（传输容器）** <span class="pill on">L7</span>：
ONU 内承载流量的对象，代表一组逻辑连接，作为单一实体参与上行带宽分配。分 Type 1–5 五种（固定/保证/最大/尽力）。

**GEM port** <span class="pill on">L7</span>：
GTC 适配子层上的抽象，代表与某个客户端业务流关联的逻辑连接（“装业务”的那一层）。

**DBA（动态带宽分配）** <span class="pill on">L7</span>：
OLT 根据各 ONU 的活动状态与流量合约，把上行 PON 容量分配给各 T-CONT 的过程。

**service-port / 业务流** <span class="pill on">L7</span>：
把 GEM port 与业务 VLAN 绑定、使业务真正落地的配置对象（厂商叫法不一）。

**line profile / service profile** <span class="pill on">L7</span>：
厂商用于预设 ONU 能力的能力模板：line profile 管 T-CONT/DBA，service profile 管 GEM/QoS，注册时绑定。

**ONU 激活（activation）** <span class="pill on">L7</span>：
ONU 上线的过程，分三阶段：参数学习 → 序列号获取 → 测距（分配 ONU-ID）。

**OMCC** <span class="pill on">L7</span>：
ONU 管理与控制通道，承载 OMCI 管理信息；由默认 Alloc-ID 承载。

**认证发现（autofind）** <span class="pill on">L8</span>：
OLT 列出某个 PON 口下等待注册的 ONU 及其序列号（SN），是注册第一步拿 SN 的命令。

**Native VLAN** <span class="pill on">L8</span>：
ONU 用户侧端口（UNI）的本地 VLAN：进入该口的无标签报文被打上此 VLAN。

**tag-transform** <span class="pill on">L8</span>：
service-port 上内外层 VLAN 的处理方式：translate（转换）/ transparent（透传），决定用户侧 VLAN 如何映射到 OLT 侧 VLAN。

**profile-id** <span class="pill on">L8</span>：
模板编号。华为 OLT 的 DBA/线路/业务模板都用 profile-id 引用；系统保留 1–9，自定义模板一般从 10 起。

## 常见歧义（重要）

**"全光网络"这个词有两个意思** <span class="pill on">L1</span>：
1. **电信传输的 AON（All-Optical Network）**：骨干/城域用 OXC、ROADM 做全光交换，中间不做光电转换；
2. **院区的全光（POL / F5G 全光院区）**：基于 PON 的无源光局域网。
**本工作区说"全光网络"，除非特别注明，都指第 2 种。** 这是中文技术圈最常见的一个坑。
