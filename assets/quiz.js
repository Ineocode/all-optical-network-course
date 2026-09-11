/* ============================================================
   quiz.js — 可复用测验组件
   用法：
   <div class="quiz" data-quiz='[
     {"q":"问题文本","options":["选项A","选项B","选项C","选项D"],
      "answer":0,"explain":"解析文本"},
     ...
   ]'></div>
   规则：answer 为正确选项下标（0 起）。选项应等长，避免泄露答案。
   ============================================================ */
(function () {
  "use strict";
  document.querySelectorAll(".quiz[data-quiz]").forEach(function (root) {
    var data;
    try { data = JSON.parse(root.getAttribute("data-quiz")); }
    catch (e) { console.error("quiz.js: data-quiz 解析失败", e); return; }

    var score = 0, total = data.length, answered = 0;
    var scoreEl = document.createElement("p");
    scoreEl.className = "quiz-score";
    scoreEl.textContent = "";
    root.appendChild(scoreEl);

    data.forEach(function (item, qi) {
      var qEl = document.createElement("div");
      qEl.className = "q";

      var qq = document.createElement("p");
      qq.className = "qq";
      qq.textContent = (qi + 1) + ". " + item.q;
      qEl.appendChild(qq);

      var opts = document.createElement("div");
      opts.className = "opts";

      item.options.forEach(function (opt, oi) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = String.fromCharCode(65 + oi) + ". " + opt;
        b.addEventListener("click", function () {
          if (b.disabled) return;
          var buttons = opts.querySelectorAll("button");
          buttons.forEach(function (x) { x.disabled = true; });
          buttons[item.answer].classList.add("correct");
          if (oi !== item.answer) b.classList.add("wrong");
          else score++;
          answered++;
          var exp = qEl.querySelector(".explain");
          exp.classList.add("show");
          updateScore();
        });
        opts.appendChild(b);
      });

      qEl.appendChild(opts);

      var exp = document.createElement("p");
      exp.className = "explain";
      exp.textContent = "解析：" + item.explain;
      qEl.appendChild(exp);

      root.appendChild(qEl);
    });

    function updateScore() {
      if (answered === total) {
        scoreEl.textContent = "本课测验：" + score + " / " + total +
          (score === total ? " —— 满分，掌握得很扎实！" :
           score >= total * 0.66 ? " —— 不错，薄弱点回去看对应章节。" :
           " —— 建议重读本课，隔一会儿再测一次（间隔练习记得更牢）。");
      }
    }
  });
})();
