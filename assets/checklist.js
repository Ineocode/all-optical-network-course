/* ============================================================
   checklist.js — 可复用步骤清单（打勾 + localStorage 记忆）
   用法：
   <ol class="checklist" data-checklist="lesson-0004-topology">
     <li>步骤文本</li>
     <li>步骤文本</li>
   </ol>
   key = data-checklist 的值；已勾选项刷新后仍然保留。
   ============================================================ */
(function () {
  "use strict";
  document.querySelectorAll("ol.checklist[data-checklist]").forEach(function (ol) {
    var key = "teach-check-" + ol.getAttribute("data-checklist");
    var state;
    try { state = JSON.parse(localStorage.getItem(key) || "[]"); }
    catch (e) { state = []; }

    var items = Array.prototype.slice.call(ol.children);
    items.forEach(function (li, i) {
      li.style.display = "flex";
      var box = document.createElement("input");
      box.type = "checkbox";
      box.checked = state.indexOf(i) !== -1;
      if (box.checked) li.classList.add("done");
      var span = document.createElement("span");
      while (li.firstChild) span.appendChild(li.firstChild);
      li.insertBefore(box, li.firstChild);
      li.appendChild(span);

      box.addEventListener("change", function () {
        if (box.checked) {
          li.classList.add("done");
          if (state.indexOf(i) === -1) state.push(i);
        } else {
          li.classList.remove("done");
          state = state.filter(function (x) { return x !== i; });
        }
        localStorage.setItem(key, JSON.stringify(state));
      });
    });
  });
})();
