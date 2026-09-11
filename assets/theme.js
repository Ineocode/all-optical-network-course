/* ============================================================
   theme.js — 深色模式（跟随系统 + 手动切换 + localStorage 记忆）
   用法：放在 <head> 里（越早越好，避免闪烁）
     <script src="../assets/theme.js"></script>
   行为：
   - 首次访问跟随系统 prefers-color-scheme
   - 点页头右上角按钮可手动切换，选择会被记住
   - 用户未手动选择时，系统主题变化会实时跟随
   ============================================================ */
(function () {
  "use strict";
  var KEY = "teach-theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function systemDark() { return !!(mq && mq.matches); }
  function apply(t) { root.setAttribute("data-theme", t); }
  function current() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }

  // 尽早设定主题（在 <head> 同步执行）
  var stored = read();
  apply(stored || (systemDark() ? "dark" : "light"));

  function syncBtn(btn) {
    var dark = current() === "dark";
    btn.textContent = dark ? "\u2600" : "\u263E";      // ☀ / ☾
    btn.title = dark ? "切换到浅色模式" : "切换到深色模式";
    btn.setAttribute("aria-label", btn.title);
  }

  // 未手动选择时，跟随系统变化
  if (mq) {
    var onChange = function () {
      if (!read()) apply(systemDark() ? "dark" : "light");
      var b = document.querySelector(".theme-toggle");
      if (b) syncBtn(b);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function init() {
    if (document.querySelector(".theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      apply(next); save(next); syncBtn(btn);
    });
    syncBtn(btn);
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.Theme = { current: current, set: function (t) { apply(t); save(t); } };
})();
