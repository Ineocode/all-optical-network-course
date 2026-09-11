/* ============================================================
   pon-flow.js — 全光网络「光信号」可视化动画组件（自包含）
   用法：
     <div class="ponmap" data-mode="architecture"></div>
   支持的 data-mode：
     architecture  两层架构 + 下行广播
     power         光功率预算：脉冲随损耗变暗，HUD 累计 dB
     bandwidth     共享带宽：下行广播 / 上行 TDMA 轮流
     protection    Type B / Type C 保护与断纤倒换
     services      三张网：VLAN 逻辑隔离 vs TDM 硬隔离
     security      AES 加密与窃听威胁
     model         业务模型：ONU→T-CONT→GEM→service-port→VLAN
     pipeline      通用步骤流水线（data-stages）
   依赖：无。样式自动注入。
   ============================================================ */
(function () {
  "use strict";

  var CSS = [
    ".ponmap{position:relative;margin:1.4rem 0;border:1px solid var(--border-subtle,#e8e6dc);" ,
    "border-radius:8px;background:var(--surface-2,#fff);padding:0.6rem 0.6rem 0.2rem;}",
    ".ponmap svg{display:block;width:100%;height:auto;}",
    ".ponmap .pf-caption{font-family:var(--mono,monospace);font-size:11px;letter-spacing:.06em;",
    "text-transform:uppercase;color:var(--accent-strong,#b3542f);margin:0.1rem 0 0.4rem;padding-left:0.3rem;}",
    ".ponmap .pf-controls{display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;",
    "padding:0.35rem 0.3rem 0.5rem;}",
    ".ponmap .pf-controls button{font-family:var(--mono,monospace);font-size:12px;",
    "padding:0.32rem 0.7rem;border:1px solid var(--border-strong,#b0aea5);border-radius:6px;",
    "background:var(--surface-1,#f4f2ea);color:var(--text-secondary,#4a4842);cursor:pointer;}",
    ".ponmap .pf-controls button:hover{border-color:var(--accent,#d97757);color:var(--accent-strong,#b3542f);}",
    ".ponmap .pf-controls button.on{background:var(--accent-soft,#f6e7e0);border-color:var(--accent,#d97757);",
    "color:var(--accent-strong,#b3542f);font-weight:700;}",
    ".ponmap .pf-legend{font-family:var(--mono,monospace);font-size:11px;color:var(--text-tertiary,#78766e);",
    "padding:0 0.3rem 0.5rem;display:flex;gap:1rem;flex-wrap:wrap;}",
    ".ponmap .pf-legend i{display:inline-block;width:0.7rem;height:0.7rem;border-radius:3px;margin-right:0.3rem;vertical-align:-0.05rem;}",
    ".ponmap text{font-family:ui-sans-serif,system-ui,'PingFang SC','Microsoft YaHei',sans-serif;}",
    ".ponmap .n-label{font-size:15px;font-weight:700;fill:#141413;}",
    ".ponmap .n-sub{font-size:11px;fill:#78766e;}",
    ".ponmap .seg-label{font-size:11px;fill:#78766e;font-family:ui-monospace,monospace;}",
    ".ponmap .hud{font-family:ui-monospace,monospace;font-size:12.5px;fill:#141413;}",
    ".ponmap .hud-ok{fill:#26704b;font-weight:700;}",
    ".ponmap .hud-warn{fill:#b43e3e;font-weight:700;}",
    ".ponmap .stage-box{fill:#f4f2ea;stroke:#b0aea5;stroke-width:1;}",
    ".ponmap .stage-box.active{fill:#f6e7e0;stroke:#d97757;}",
    ".ponmap .stage-t{font-size:12.5px;font-weight:700;fill:#141413;}",
    ".ponmap .stage-s{font-size:10.5px;fill:#78766e;}",
    ".ponmap .node-active{fill:#eef3f8;stroke:#2f5d8a;stroke-width:1.5;}",
    ".ponmap .node-passive{fill:#fdf1ea;stroke:#d97757;stroke-width:1.4;stroke-dasharray:5 4;}",
    "@media (prefers-reduced-motion: reduce){.ponmap .pf-controls{opacity:.85;}}"
  ].join("");

  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    if (attrs) for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    return e;
  }
  function txt(x, y, s, cls, anchor) {
    var t = el("text", { x: x, y: y, "class": cls || "", "text-anchor": anchor || "start" });
    t.textContent = s; return t;
  }
  function ptAt(pts, t) {
    var segs = [], total = 0, i;
    for (i = 0; i < pts.length - 1; i++) {
      var dx = pts[i+1][0]-pts[i][0], dy = pts[i+1][1]-pts[i][1];
      var d = Math.sqrt(dx*dx+dy*dy); segs.push(d); total += d;
    }
    var want = Math.max(0, Math.min(1, t)) * total, acc = 0;
    for (i = 0; i < segs.length; i++) {
      if (acc + segs[i] >= want) {
        var f = segs[i] ? (want - acc) / segs[i] : 0;
        return [pts[i][0] + (pts[i+1][0]-pts[i][0])*f, pts[i][1] + (pts[i+1][1]-pts[i][1])*f];
      }
      acc += segs[i];
    }
    return pts[pts.length-1].slice();
  }
  function pathD(pts) { return pts.map(function(p,i){ return (i?"L":"M")+p[0]+" "+p[1]; }).join(" "); }

  // ---------- geometry ----------
  var OLT = { x: 40, y: 190, w: 140, h: 80 };
  var SPLIT = { x: 480, y: 230 };
  var ONU_X = 770, ONU_W = 140, ONU_H = 56;
  var ONU_CY = [95, 185, 275, 365];
  function oltRight() { return [OLT.x + OLT.w, OLT.y + OLT.h/2]; }
  function onuLeft(i) { return [ONU_X, ONU_CY[i]]; }
  function onuCenter(i) { return [ONU_X + ONU_W/2, ONU_CY[i]]; }

  function drawOlt(g, label, sub) {
    g.appendChild(el("rect", { x: OLT.x, y: OLT.y, width: OLT.w, height: OLT.h, rx: 8, "class": "node-active" }));
    g.appendChild(txt(OLT.x + OLT.w/2, OLT.y + 36, label || "OLT", "n-label", "middle"));
    g.appendChild(txt(OLT.x + OLT.w/2, OLT.y + 58, sub || "有源 · 机房", "n-sub", "middle"));
  }
  function drawOnu(g, i, label, sub) {
    g.appendChild(el("rect", { x: ONU_X, y: ONU_CY[i]-ONU_H/2, width: ONU_W, height: ONU_H, rx: 8, "class": "node-active" }));
    g.appendChild(txt(ONU_X + ONU_W/2, ONU_CY[i]-2, label || ("ONU " + (i+1)), "n-label", "middle"));
    g.appendChild(txt(ONU_X + ONU_W/2, ONU_CY[i]+18, sub || "有源 · 房间", "n-sub", "middle"));
  }
  function drawSplitter(g, sub) {
    var d = 34;
    g.appendChild(el("polygon", {
      points: [SPLIT.x+","+(SPLIT.y-d), (SPLIT.x+d)+","+SPLIT.y, SPLIT.x+","+(SPLIT.y+d), (SPLIT.x-d)+","+SPLIT.y].join(" "),
      "class": "node-passive"
    }));
    g.appendChild(txt(SPLIT.x, SPLIT.y + d + 20, "ODN 无源分光器", "n-label", "middle"));
    g.appendChild(txt(SPLIT.x, SPLIT.y + d + 38, sub || "无源 · 不供电", "n-sub", "middle"));
  }
  function link(g, a, b, passive) {
    g.appendChild(el("path", { d: pathD([a,b]), fill: "none",
      stroke: passive ? "#d97757" : "#2f5d8a", "stroke-width": passive ? 2 : 2.4,
      "stroke-dasharray": passive ? "6 5" : "" , opacity: passive ? .85 : .9 }));
  }

  // ---------- engine ----------
  function PonFlow(root) {
    this.root = root;
    this.mode = root.getAttribute("data-mode") || "architecture";
    this.timers = [];
    this.pulses = [];
    this.disposed = false;
    this.build();
  }
  PonFlow.prototype.build = function () {
    var self = this;
    if (!document.getElementById("pf-style")) {
      var st = document.createElement("style"); st.id = "pf-style"; st.textContent = CSS;
      document.head.appendChild(st);
    }
    var cap = document.createElement("p"); cap.className = "pf-caption"; cap.textContent = this.caption();
    this.root.appendChild(cap);
    var svg = el("svg", { viewBox: "0 0 960 460", role: "img", "aria-label": cap.textContent });
    this.svg = svg; this.root.appendChild(svg);
    this.base = el("g"); this.pulseG = el("g"); this.hudG = el("g");
    svg.appendChild(this.base); svg.appendChild(this.pulseG); svg.appendChild(this.hudG);

    var ctr = document.createElement("div"); ctr.className = "pf-controls"; this.ctr = ctr;
    this.root.appendChild(ctr);
    var lg = document.createElement("div"); lg.className = "pf-legend"; this.lg = lg;
    this.root.appendChild(lg);

    (this["scene_" + this.mode] || this.scene_architecture).call(this);

    this.last = performance.now();
    this.raf = requestAnimationFrame(function tick(now){ self.frame(now); });
  };
  PonFlow.prototype.caption = function () {
    return ({
      architecture: "两层架构 · 下行光信号广播给该 PON 口下所有 ONU",
      power: "光功率预算 · 光信号沿途衰减，累计损耗 vs 预算",
      bandwidth: "共享带宽 · 下行广播 / 上行 TDMA 轮流发送",
      protection: "保护倒换 · Type B 与 Type C，断纤后走备用路径",
      services: "三张网隔离 · VLAN 逻辑隔离 vs TDM 硬隔离",
      security: "安全 · AES 加密与“被改装的 ONU”窃听威胁",
      model: "业务模型 · 一个数据包从 ONU 到 OLT 经过的配置对象",
      pipeline: "流程 · 每一步的输入与输出"
    })[this.mode] || "光信号可视化";
  };
  PonFlow.prototype.btn = function (label, fn) {
    var b = document.createElement("button"); b.type = "button"; b.textContent = label;
    b.addEventListener("click", fn); this.ctr.appendChild(b); return b;
  };
  PonFlow.prototype.legend = function (items) {
    this.lg.innerHTML = "";
    items.forEach(function (it) {
      var s = document.createElement("span");
      s.innerHTML = '<i style="background:' + it.c + ';' + (it.dash ? "border:1px dashed " + it.c + ";background:transparent;" : "") + '"></i>' + it.t;
      this.lg.appendChild(s);
    }, this);
  };
  PonFlow.prototype.spawn = function (pts, dur, delay, onDone, color, r) {
    var self = this, start = performance.now() + (delay || 0);
    var c = el("circle", { r: r || 7, fill: color || "#2f5d8a", opacity: 0 });
    this.pulseG.appendChild(c);
    var p = { el: c, pts: pts, dur: dur, start: start, t: 0, onDone: onDone, dead: false, baseR: r || 7 };
    this.pulses.push(p);
    return p;
  };
  PonFlow.prototype.frame = function (now) {
    if (this.disposed) return;
    var self = this;
    this.pulses.forEach(function (p) {
      if (p.dead) return;
      var t = (now - p.start) / p.dur;
      if (t < 0) { p.el.setAttribute("opacity", 0); return; }
      if (t >= 1) {
        p.dead = true; p.el.setAttribute("opacity", 0);
        if (p.onDone) p.onDone();
        return;
      }
      var pos = ptAt(p.pts, t);
      p.el.setAttribute("cx", pos[0]); p.el.setAttribute("cy", pos[1]);
      p.el.setAttribute("opacity", p.opacity === undefined ? 1 : p.opacity);
      if (p.dim) p.el.setAttribute("opacity", Math.max(0.18, 1 - 0.85*t));
    });
    this.pulses = this.pulses.filter(function (p) { return !p.dead; });
    if (this.pulses.length > 40) this.pulses.splice(0, this.pulses.length - 40);
    this.raf = requestAnimationFrame(function (n) { self.frame(n); });
  };
  PonFlow.prototype.clearPulses = function () { this.pulseG.innerHTML = ""; this.pulses = []; };
  PonFlow.prototype.set = function (fn, ms) { var id = setInterval(fn, ms); this.timers.push(id); return id; };
  PonFlow.prototype.dispose = function () {
    this.disposed = true; cancelAnimationFrame(this.raf);
    this.timers.forEach(clearInterval);
  };

  // ---------- scenes ----------
  PonFlow.prototype.scene_architecture = function () {
    var self = this, g = this.base;
    link(g, oltRight(), [SPLIT.x, SPLIT.y], false);
    for (var i = 0; i < 4; i++) link(g, [SPLIT.x, SPLIT.y], onuLeft(i), true);
    drawOlt(g); drawSplitter(g);
    for (i = 0; i < 4; i++) drawOnu(g, i);
    this.legend([
      { c: "#2f5d8a", t: "有源：OLT / ONU（要供电）" },
      { c: "#d97757", t: "无源：ODN 分光器（不供电）", dash: true }
    ]);
    this.btn("▶ 重新播放", function () { self.clearPulses(); cycle(); });
    function cycle() {
      self.spawn([oltRight(), [SPLIT.x, SPLIT.y]], 640, 0, function () {
        for (var k = 0; k < 4; k++) self.spawn([[SPLIT.x, SPLIT.y], onuLeft(k)], 820, k * 60);
      });
    }
    cycle(); this.set(cycle, 2300);
  };

  PonFlow.prototype.scene_power = function () {
    var self = this, g = this.base;
    var target = 1;
    link(g, oltRight(), [SPLIT.x, SPLIT.y], false);
    link(g, [SPLIT.x, SPLIT.y], onuLeft(target), true);
    drawOlt(g); drawSplitter(g, "无源 · 1:16 分光（−14.1 dB）");
    drawOnu(g, target, "ONU（病房）", "有源 · 房间");
    g.appendChild(txt((OLT.x+OLT.w+SPLIT.x)/2, OLT.y + 4, "光纤 2.3 km（−0.92 dB）", "seg-label", "middle"));
    g.appendChild(txt((SPLIT.x+ONU_X)/2, ONU_CY[target] - 12, "连接器/熔接/余量", "seg-label", "middle"));
    this.legend([
      { c: "#2f5d8a", t: "光脉冲（越暗＝光功率越低）" },
      { c: "#26704b", t: "预算内到达" }
    ]);
    var hud = txt(40, 40, "", "hud");
    this.hudG.appendChild(hud);
    var total = 0, budget = 28;
    function upd(extra) {
      var margin = budget - total;
      hud.textContent = "预算 " + budget.toFixed(2) + " dB　|　累计损耗 " + total.toFixed(2) +
        " dB　|　剩余 " + margin.toFixed(2) + " dB" + (extra ? "　" + extra : "");
    }
    function cycle() {
      self.clearPulses(); total = 0; upd("");
      var p = self.spawn([oltRight(), [SPLIT.x, SPLIT.y], onuLeft(target)], 2600, 0, function () {
        total = 21.62; upd("✓ 到达 ONU");
        hud.setAttribute("class", "hud hud-ok");
      });
      p.dim = true;
      var s1 = setTimeout(function(){ total = 0.92; upd(); }, 900);
      var s2 = setTimeout(function(){ total = 15.02; upd(); }, 1500);
      self.timers.push(s1, s2);
    }
    hud.setAttribute("class", "hud");
    cycle(); this.set(cycle, 4200);
    this.btn("▶ 重新播放", cycle);
  };

  PonFlow.prototype.scene_bandwidth = function () {
    var self = this, g = this.base;
    link(g, oltRight(), [SPLIT.x, SPLIT.y], false);
    for (var i = 0; i < 4; i++) link(g, [SPLIT.x, SPLIT.y], onuLeft(i), true);
    drawOlt(g); drawSplitter(g);
    var marks = [];
    for (i = 0; i < 4; i++) {
      drawOnu(g, i);
      var m = el("circle", { cx: onuCenter(i)[0], cy: ONU_CY[i], r: 16, fill: "#26704b", opacity: 0 });
      g.appendChild(m); marks.push(m);
    }
    var phaseLabel = txt(40, 40, "", "hud"); this.hudG.appendChild(phaseLabel);
    var phase = "down", timer;
    function flash(i, dur) {
      marks[i].setAttribute("opacity", 0.75);
      setTimeout(function(){ marks[i].setAttribute("opacity", 0); }, dur || 380);
    }
    function downCycle() {
      phaseLabel.textContent = "下行：OLT 一次广播，该 PON 口下所有 ONU 同时收到";
      phaseLabel.setAttribute("class", "hud");
      self.spawn([oltRight(), [SPLIT.x, SPLIT.y]], 560, 0, function () {
        for (var k = 0; k < 4; k++) { self.spawn([[SPLIT.x, SPLIT.y], onuLeft(k)], 760, 0); flash(k, 420); }
      });
    }
    function upCycle() {
      phaseLabel.textContent = "上行：TDMA 同一时刻只有一个 ONU 能发 → 轮流用时隙";
      phaseLabel.setAttribute("class", "hud hud-ok");
      for (var k = 0; k < 4; k++) {
        (function (idx) {
          setTimeout(function () {
            self.spawn([onuLeft(idx), [SPLIT.x, SPLIT.y], oltRight()], 900, 0, null, "#26704b");
            flash(idx, 700);
          }, idx * 700);
        })(k);
      }
      setTimeout(function(){ for (var k=0;k<4;k++) marks[k].setAttribute("opacity",0); }, 4*700 + 200);
    }
    function run() { if (phase === "down") downCycle(); else upCycle(); }
    run();
    timer = this.set(function () { phase = phase === "down" ? "up" : "down"; run(); }, 3200);
    var b1 = this.btn("下行广播", function(){ phase = "down"; run(); });
    var b2 = this.btn("上行 TDMA", function(){ phase = "up"; run(); });
    this.legend([{ c: "#2f5d8a", t: "下行（广播）" }, { c: "#26704b", t: "上行（TDMA 时隙）" }]);
    setTimeout(function(){ b2.classList.add("on"); }, 10);
    // toggle button highlight
    var t2 = setInterval(function(){ b1.classList.toggle("on", phase==="down"); b2.classList.toggle("on", phase==="up"); }, 300);
    this.timers.push(t2);
  };

  PonFlow.prototype.scene_protection = function () {
    var self = this, g = this.base;

    // ---- 几何：所有折点都在这里，脉冲必须沿这些折点走 ----
    var A_right = [OLT.x + OLT.w, 105];   // OLT-A 出口
    var B_right = [OLT.x + OLT.w, 345];   // OLT-B 出口
    var S       = [470, 220];             // 分光器中心
    var IN_A    = [438, 196], IN_B = [438, 244];   // 分光器两个输入口
    var OUT_1   = [502, 196], OUT_2 = [502, 244];  // 分光器两个输出口
    var P1      = [758, 196], P2 = [758, 244];     // ONU ①② 号上行口
    var DIST2   = [[620, 300], [700, 300], P2];    // 备用配线的迂回走线

    function box(x, y, w, h, label, sub) {
      var r = el("rect", { x: x, y: y, width: w, height: h, rx: 8, "class": "node-active" });
      g.appendChild(r);
      g.appendChild(txt(x + w/2, y + h/2 - 4, label, "n-label", "middle"));
      g.appendChild(txt(x + w/2, y + h/2 + 16, sub, "n-sub", "middle"));
      return r;
    }
    var oltA = box(OLT.x, 70,  OLT.w, 70, "OLT-A", "主用 · 有源");
    var oltB = box(OLT.x, 310, OLT.w, 70, "OLT-B", "备用 / 双归属");

    // 分光器（双输入 / 双输出）
    g.appendChild(el("polygon", {
      points: [S[0]+","+(S[1]-34), (S[0]+34)+","+S[1], S[0]+","+(S[1]+34), (S[0]-34)+","+S[1]].join(" "),
      "class": "node-passive"
    }));
    g.appendChild(txt(S[0], S[1] + 56, "ODN 分光器（2 输入 / 2 输出）", "n-label", "middle"));
    g.appendChild(txt(S[0], S[1] + 74, "无源 · 不供电", "n-sub", "middle"));

    // ONU（双上行口 = Type C 的 ONU 侧双份）
    var onu = box(758, 160, 172, 120, "ONU", "有源 · 房间");
    function port(cx, cy, color) {
      var dot = el("circle", { cx: cx, cy: cy, r: 5, fill: color });
      var ring = el("circle", { cx: cx, cy: cy, r: 9, fill: "none", stroke: color, "stroke-width": 2, opacity: 0 });
      g.appendChild(dot); g.appendChild(ring); return { dot: dot, ring: ring, color: color };
    }
    var PT1 = port(758, 196, "#2f5d8a");
    var PT2 = port(758, 244, "#26704b");
    g.appendChild(txt(748, 200, "\u2460", "n-sub", "end"));
    g.appendChild(txt(748, 248, "\u2461", "n-sub", "end"));

    // ---- 链路（脉冲就沿这些线走）----
    function line(pts, color, dash) {
      var p = el("path", { d: pathD(pts), fill: "none", stroke: color, "stroke-width": 2.5,
                           "stroke-dasharray": dash || "", opacity: 1 });
      g.appendChild(p); return p;
    }
    var feederA = line([A_right, IN_A], "#2f5d8a");
    var feederB = line([B_right, IN_B], "#26704b", "7 5");
    var dist1   = line([OUT_1, P1], "#d97757", "7 5");
    var dist2   = line([OUT_2].concat(DIST2), "#26704b", "7 5");
    feederB.setAttribute("opacity", .55);
    dist2.setAttribute("opacity", 0);

    g.appendChild(txt(250, 88, "主干光纤", "seg-label", "middle"));
    g.appendChild(txt(300, 360, "备用主干", "seg-label", "middle"));
    g.appendChild(txt(630, 178, "主配线段", "seg-label", "middle"));
    g.appendChild(txt(660, 322, "备用配线（仅 Type C）", "seg-label", "middle"));

    // ---- HUD / 故障标记 / 业务状态 ----
    var state = txt(40, 40, "", "hud"); this.hudG.appendChild(state);
    var note  = txt(40, 62, "", "seg-label"); this.hudG.appendChild(note);
    var badge = txt(690, 120, "", "hud"); this.hudG.appendChild(badge);
    var mark  = txt(0, 0, "\u2717", "hud hud-warn"); mark.setAttribute("text-anchor", "middle");
    mark.setAttribute("opacity", 0); this.hudG.appendChild(mark);
    var svc   = txt(844, 300, "", "hud"); svc.setAttribute("text-anchor", "middle");
    this.hudG.appendChild(svc);

    var fault = "none", typeC = false; // fault: none | feeder | dist

    // ---- 逻辑核心：有故障时，光路该走哪条 ----
    function activePath() {
      if (fault === "dist" && !typeC) return null;          // Type B 配线断：无通路
      var fStart = (fault === "feeder") ? B_right : A_right; // 主干故障→改走 OLT-B
      var fIn    = (fault === "feeder") ? IN_B    : IN_A;
      var outPort = (fault === "dist") ? OUT_2 : OUT_1;      // 配线故障(Type C)→走备用输出
      var seg     = (fault === "dist") ? DIST2 : [P1];
      return [fStart, fIn, outPort].concat(seg);             // 折点完整，贴合画出的光纤
    }

    function render() {
      var down = (fault === "dist" && !typeC);

      feederA.setAttribute("stroke", fault === "feeder" ? "#b43e3e" : "#2f5d8a");
      feederA.setAttribute("opacity", fault === "feeder" ? .3 : 1);
      feederB.setAttribute("opacity", (fault === "feeder" || typeC) ? 1 : .55);
      dist1.setAttribute("stroke", fault === "dist" ? "#b43e3e" : "#d97757");
      dist1.setAttribute("opacity", fault === "dist" ? .3 : 1);
      dist2.setAttribute("opacity", typeC ? (fault === "dist" ? 1 : .55) : 0);

      // OLT 高亮：谁在承载业务
      var useB = (fault === "feeder");
      oltA.style.fill = useB ? "#f4f2ea" : ""; oltA.style.stroke = useB ? "#b0aea5" : "";
      oltB.style.fill = useB ? "#e6f2ea" : ""; oltB.style.stroke = useB ? "#26704b" : "";

      // 端口：当前到达哪个口
      var usePort2 = (fault === "dist" && typeC);
      PT2.dot.setAttribute("opacity", typeC ? 1 : 0);
      PT1.ring.setAttribute("opacity", down ? 0 : (usePort2 ? 0 : 1));
      PT2.ring.setAttribute("opacity", usePort2 ? 1 : 0);

      // ONU：业务中断则变灰
      onu.style.fill = down ? "#eeeeea" : ""; onu.style.stroke = down ? "#b43e3e" : "";
      svc.textContent = down ? "业务中断" : "业务正常";
      svc.setAttribute("class", down ? "hud hud-warn" : "hud hud-ok");

      // 故障标记位置
      if (fault === "feeder") { mark.setAttribute("x", 300); mark.setAttribute("y", 156); mark.setAttribute("opacity", 1); }
      else if (fault === "dist") { mark.setAttribute("x", 630); mark.setAttribute("y", 190); mark.setAttribute("opacity", 1); }
      else mark.setAttribute("opacity", 0);

      // 文案
      if (fault === "none") {
        state.textContent = "\u25cf 正常：OLT-A \u2192 主干A \u2192 分光器 \u2192 主配线 \u2192 ONU ①";
        state.setAttribute("class", "hud hud-ok");
        note.textContent = typeC ? "Type C：OLT 侧 + ONU 侧全程双份，任意点故障可恢复"
                                 : "Type B：只双份 OLT 侧与主干，配线段与 ONU 不保护";
      } else if (fault === "feeder") {
        state.textContent = "\u2717 主干故障 \u2192 改走 OLT-B \u2192 备用主干 \u2192 分光器 \u2192 ONU ①  \u2713";
        state.setAttribute("class", "hud hud-ok");
        note.textContent = typeC ? "Type C 同样覆盖主干（保护范围更宽）"
                                 : "Type B 能恢复：OLT 侧与主干正是它保护的范围";
      } else if (typeC) {
        state.textContent = "\u2717 配线故障 \u2192 分光器改用②号输出 \u2192 备用配线 \u2192 ONU ②  \u2713";
        state.setAttribute("class", "hud hud-ok");
        note.textContent = "Type C 的 ONU 侧双份在这里发挥作用：热备、无损切换（hitless）";
      } else {
        state.textContent = "\u2717 配线故障 \u2192 无可用通路 \u2192 业务中断（Type B 保护不到 ONU 侧）";
        state.setAttribute("class", "hud hud-warn");
        note.textContent = "这正是 Type B 的边界：只恢复到 OLT 侧，配线段断了恢复不了";
      }
      badge.textContent = typeC ? "保护范围：全程" : "保护范围：OLT 侧 + 主干";
      badge.setAttribute("class", typeC ? "hud hud-ok" : "hud");
    }

    function cycle() {
      self.clearPulses();
      var p = activePath();
      self.__path = p; // 测试钩子：当前实际光路
      if (!p) return;
      var color = (fault === "none") ? "#2f5d8a" : "#26704b";
      self.spawn(p, 1800, 0, null, color, 7);
    }

    render(); cycle(); this.set(cycle, 2400);

    this.btn("故障点：无", function () {
      fault = fault === "none" ? "feeder" : (fault === "feeder" ? "dist" : "none");
      this.textContent = "故障点：" + ({ none: "无", feeder: "OLT/主干", dist: "配线段" })[fault];
      render(); cycle();
    });
    var bType = this.btn("当前：Type B（点此切 C）", function () {
      typeC = !typeC;
      this.textContent = typeC ? "当前：Type C（点此切 B）" : "当前：Type B（点此切 C）";
      bType.classList.toggle("on", typeC);
      render(); cycle();
    });
    this.legend([
      { c: "#2f5d8a", t: "主用" },
      { c: "#26704b", t: "备用（受保护路径）" },
      { c: "#b43e3e", t: "故障" }
    ]);
  };

  PonFlow.prototype.scene_services = function () {
    var self = this, g = this.base;
    // 逻辑：三种业务源自 OLT，在同一张 PON 上（OLT→分光器→ONU）以隔离管道传输，
    //       到 ONU 后分别送入右侧三个业务框。
    var OLR = [OLT.x + OLT.w, OLT.y + OLT.h/2];     // (180,230) 业务起点 = OLT 右缘
    var SP  = [SPLIT.x, SPLIT.y];                   // (480,220) 无源分光器
    var ONUx = 620, ONUy = 185, ONUw = 120, ONUh = 70;
    var ONUl = [ONUx, ONUy + ONUh/2];               // (620,220)
    var ONUr = [ONUx + ONUw, ONUy + ONUh/2];        // (740,220)
    var names = ["内网", "外网", "设备网"];
    var colors = ["#b43e3e", "#2f5d8a", "#26704b"];
    var boxX = 790, boxW = 150, boxH = 46, cys = [110, 220, 330];
    function slicePath(o) { return [[OLR[0], OLR[1] + o], [SP[0], SP[1] + o], [ONUl[0], ONUl[1] + o]]; }

    // ① 同一张 PON 的物理管道（浅灰粗管）——先画，位于节点之下
    g.appendChild(el("path", { d: pathD([OLR, SP, ONUl]), fill: "none", stroke: "#eceae2",
      "stroke-width": 22, "stroke-linecap": "round", "stroke-linejoin": "round" }));

    // ② 三条隔离管道（贯穿 OLT→分光器→ONU；TDM 分开 / VLAN 合并）
    var slices = colors.map(function (c) {
      var p = el("path", { d: "", fill: "none", stroke: c, "stroke-width": 3.4,
        "stroke-linecap": "round", "stroke-linejoin": "round", opacity: .8 });
      g.appendChild(p); return p;
    });

    // ③ 节点（画在管道之上，避免管道盖住分光器）
    drawOlt(g, "OLT", "三种业务的起点");
    drawSplitter(g, "无源 · 不供电");
    g.appendChild(el("rect", { x: ONUx, y: ONUy, width: ONUw, height: ONUh, rx: 8, "class": "node-active" }));
    g.appendChild(txt(ONUx + ONUw/2, ONUy + 30, "ONU", "n-label", "middle"));
    g.appendChild(txt(ONUx + ONUw/2, ONUy + 50, "有源 · 多业务", "n-sub", "middle"));

    // ④ ONU → 右侧业务框
    var lanes = [];
    for (var i = 0; i < 3; i++) {
      var lane = [ONUr.slice(), [ONUr[0] + 25, cys[i]], [boxX, cys[i]]];
      lanes.push(lane);
      g.appendChild(el("path", { d: pathD(lane), fill: "none", stroke: colors[i],
        "stroke-width": 2.4, opacity: .5 }));
    }

    // ⑤ 右侧三个业务框
    for (i = 0; i < 3; i++) {
      g.appendChild(el("rect", { x: boxX, y: cys[i] - boxH/2, width: boxW, height: boxH, rx: 8,
        fill: "#fff", stroke: colors[i], "stroke-width": 1.8 }));
      var t = txt(boxX + 18, cys[i] + 7, names[i], "n-label", "start");
      t.setAttribute("fill", colors[i]);
      g.appendChild(t);
      g.appendChild(txt(boxX + boxW - 16, cys[i] + 7, "业务", "n-sub", "end"));
    }

    // ⑥ 标注
    g.appendChild(txt((OLR[0] + ONUl[0]) / 2, 166, "同一张 PON 承载三种业务", "seg-label", "middle"));
    var mode = txt(40, 40, "", "hud"); this.hudG.appendChild(mode);
    var tag = txt(ONUx + ONUw/2, ONUy + ONUh + 24, "", "seg-label", "middle"); this.hudG.appendChild(tag);

    var hard = true;
    function render() {
      var offs = hard ? [-14, 0, 14] : [0, 0, 0];
      slices.forEach(function (p, i) { p.setAttribute("d", pathD(slicePath(offs[i]))); });
      if (hard) {
        mode.textContent = "TDM 硬隔离：内网 / 外网 / 设备网 在同一张 PON 上各走独立管道";
        mode.setAttribute("class", "hud hud-ok");
        tag.textContent = "↑ 三条独立管道";
        tag.setAttribute("class", "seg-label");
      } else {
        mode.textContent = "仅 VLAN 逻辑隔离：三种业务挤在同一条管道，配置错误或攻击可能越权";
        mode.setAttribute("class", "hud hud-warn");
        tag.textContent = "↑ 共用一条管道";
        tag.setAttribute("class", "hud hud-warn");
      }
    }
    function cycle() {
      self.clearPulses();
      var offs = hard ? [-14, 0, 14] : [0, 0, 0];
      for (var i = 0; i < 3; i++) {
        (function (i) {
          self.spawn(slicePath(offs[i]), 950, hard ? 0 : i * 320, function () {
            self.spawn(lanes[i], 750, 0, null, colors[i], 6);
          }, colors[i], 6);
        })(i);
      }
    }
    render(); cycle(); this.set(cycle, 2600);
    var b = this.btn("切换为“仅 VLAN”", function(){
      hard = !hard; b.textContent = hard ? "切换为“仅 VLAN”" : "切换为“TDM 硬隔离”";
      b.classList.toggle("on", !hard); render(); cycle();
    });
    this.legend([{ c: "#b43e3e", t: "内网" }, { c: "#2f5d8a", t: "外网" }, { c: "#26704b", t: "设备网" }]);
  };

  PonFlow.prototype.scene_security = function () {
    var self = this, g = this.base;
    link(g, oltRight(), [SPLIT.x, SPLIT.y], false);
    for (var i = 0; i < 3; i++) link(g, [SPLIT.x, SPLIT.y], onuLeft(i), true);
    drawOlt(g, "OLT", "AES 加密");
    drawSplitter(g);
    drawOnu(g, 0, "目标 ONU", "正常用户");
    drawOnu(g, 1, "其他 ONU", "同 PON 口");
    // eavesdropper
    g.appendChild(el("rect", { x: ONU_X, y: ONU_CY[2]-ONU_H/2, width: ONU_W, height: ONU_H, rx: 8, fill: "#fbeaea", stroke: "#b43e3e", "stroke-width": 1.6 }));
    g.appendChild(txt(ONU_X+ONU_W/2, ONU_CY[2]-2, "恶意 ONU", "n-label", "middle"));
    g.appendChild(txt(ONU_X+ONU_W/2, ONU_CY[2]+18, "被改装 · 窃听", "n-sub", "middle"));
    var state = txt(40, 40, "", "hud"); this.hudG.appendChild(state);
    var note = txt(40, 60, "", "seg-label"); this.hudG.appendChild(note);
    var aes = true;
    function render() {
      if (aes) {
        state.textContent = "🔒 AES-128 CTR 加密：下行是密文";
        state.setAttribute("class", "hud hud-ok");
        note.textContent = "恶意 ONU 收到密文，无法解读其他用户数据。";
      } else {
        state.textContent = "⚠ AES 关闭：下行是明文";
        state.setAttribute("class", "hud hud-warn");
        note.textContent = "恶意 ONU 可直接读取同一 PON 口下所有用户的下行数据（窃听威胁）。";
      }
    }
    function cycle() {
      self.clearPulses();
      var label = aes ? "密文" : "明文";
      self.spawn([oltRight(), [SPLIT.x, SPLIT.y]], 600, 0, function () {
        for (var k = 0; k < 3; k++) self.spawn([[SPLIT.x, SPLIT.y], onuLeft(k)], 780, 0, function(){}, aes ? "#8a6217" : "#b43e3e", 8);
      }, aes ? "#8a6217" : "#b43e3e", 8);
    }
    render(); cycle(); this.set(cycle, 2200);
    var b = this.btn("关闭 AES 加密", function(){
      aes = !aes; b.textContent = aes ? "关闭 AES 加密" : "开启 AES 加密";
      b.classList.toggle("on", !aes); render(); cycle();
    });
    this.legend([{ c: "#8a6217", t: "密文（加密）" }, { c: "#b43e3e", t: "明文（可被窃听）" }]);
  };

  PonFlow.prototype.scene_model = function () {
    this.pipeline(["ONU 业务流", "T-CONT / Alloc-ID\n上行带宽", "GEM port\n业务封装", "service-port\n绑 VLAN", "OLT 上行"], "一个数据包从 ONU 到 OLT 经过的配置对象");
  };

  PonFlow.prototype.scene_pipeline = function () {
    var raw = this.root.getAttribute("data-stages") || "需求|光功率|带宽|拓扑|场景|落地";
    this.pipeline(raw.split("|"), this.root.getAttribute("data-note") || "");
  };

  // generic horizontal pipeline
  PonFlow.prototype.pipeline = function (stages, note) {
    var self = this, g = this.base;
    // 兼容 data-stages 里写的字面量 "\n"（两字符）与真实换行
    stages = stages.map(function (s) { return String(s).replace(/\\n/g, "\n"); });
    this.ctr.innerHTML = ""; this.lg.innerHTML = "";
    var n = stages.length, x0 = 40, x1 = 920, y = 210, w = (x1 - x0) / n - 16, h = 96;
    var boxes = [], labels = [];
    for (var i = 0; i < n; i++) {
      var x = x0 + i * ((x1 - x0) / n);
      var box = el("rect", { x: x, y: y - h/2, width: w, height: h, rx: 8, "class": "stage-box" });
      g.appendChild(box); boxes.push(box);
      var parts = stages[i].split("\n");
      g.appendChild(txt(x + w/2, y - (parts[1] ? 6 : 4), parts[0], "stage-t", "middle"));
      if (parts[1]) g.appendChild(txt(x + w/2, y + 14, parts[1], "stage-s", "middle"));
      if (i < n - 1) g.appendChild(el("path", { d: pathD([[x+w, y], [x + (x1-x0)/n, y]]), stroke: "#b0aea5", "stroke-width": 2, fill: "none", "marker-end": "" }));
    }
    var cap = txt(40, 60, "", "seg-label"); this.hudG.appendChild(cap);
    var cur = -1;
    function step() {
      if (cur >= 0) boxes[cur].classList.remove("active");
      cur = (cur + 1) % n;
      boxes[cur].classList.add("active");
      cap.textContent = "步骤 " + (cur + 1) + " / " + n + "：" + stages[cur].replace("\n", " · ");
      var from = [x0 + cur * ((x1-x0)/n) - 20, y], to = [x0 + cur * ((x1-x0)/n) + w/2, y];
      self.spawn([from, to], 520, 0, null, "#d97757", 6);
    }
    step(); this.set(step, 1500);
    var b = this.btn("▶ 重新播放", function(){ self.clearPulses(); cur = -1; boxes.forEach(function(x){x.classList.remove("active");}); step(); });
    this.legend([{ c: "#d97757", t: note || "当前步骤" }]);
  };

  // ---------- boot ----------
  function boot() {
    var nodes = document.querySelectorAll(".ponmap[data-mode]");
    nodes.forEach(function (n) { if (!n.__pf) { n.__pf = new PonFlow(n); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.PonFlow = { boot: boot };
})();
