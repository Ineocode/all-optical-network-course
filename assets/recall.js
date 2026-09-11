/* ============================================================
   recall.js — 回忆练习（先写，再看参考答案）
   用法：
   <div class="recall">
     <div class="rt">回忆练习</div>
     <p>提示……</p>
     <textarea placeholder="先在脑海里写出来……"></textarea>
     <button type="button">看参考答案</button>
     <div class="reveal"><p>参考答案……</p></div>
   </div>
   ============================================================ */
(function () {
  "use strict";
  document.querySelectorAll(".recall").forEach(function (root) {
    var btn = root.querySelector("button");
    var reveal = root.querySelector(".reveal");
    if (!btn || !reveal) return;
    btn.addEventListener("click", function () {
      reveal.classList.toggle("show");
      btn.textContent = reveal.classList.contains("show") ? "收起参考答案" : "看参考答案";
    });
  });
})();
