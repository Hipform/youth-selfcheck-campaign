(function () {
  "use strict";

  /** 교육용 문항 (공식 스크리닝 척도 복제 아님). 점수 높을수록 돌봄·연결이 더 필요할 수 있음. */
  var QUESTIONS = [
    {
      text: "요즘 힘들 때, 이야기하거나 의지할 사람이 있다.",
      options: [
        { label: "그렇다", score: 0 },
        { label: "가끔 그렇다", score: 1 },
        { label: "거의 없다", score: 2 },
        { label: "전혀 없다", score: 3 }
      ]
    },
    {
      text: "도움이 필요할 때, 누군가에게 먼저 요청할 수 있다.",
      options: [
        { label: "쉽게 할 수 있다", score: 0 },
        { label: "노력하면 할 수 있다", score: 1 },
        { label: "매우 어렵다", score: 2 },
        { label: "거의 못 한다", score: 3 }
      ]
    },
    {
      text: "하루 중 혼자만의 시간이 지나치게 많다고 느낀다.",
      options: [
        { label: "그렇지 않다", score: 0 },
        { label: "조금 그렇다", score: 1 },
        { label: "자주 그렇다", score: 2 },
        { label: "거의 매일 그렇다", score: 3 }
      ]
    },
    {
      text: "최근 외출·학교·모임 등 밖에 나가는 활동이 줄었다.",
      options: [
        { label: "크게 줄지 않았다", score: 0 },
        { label: "조금 줄었다", score: 1 },
        { label: "많이 줄었다", score: 2 },
        { label: "거의 나가지 않는다", score: 3 }
      ]
    },
    {
      text: "위와 같은 느낌이 수주~수개월 동안 이어지는 편이다.",
      options: [
        { label: "아니다 / 해당 없음", score: 0 },
        { label: "며칠~1주 정도", score: 1 },
        { label: "몇 주 이상", score: 2 },
        { label: "몇 달 이상", score: 3 }
      ]
    },
    {
      text: "사람이나 활동을 피하고 싶은 마음이 자주 든다.",
      options: [
        { label: "거의 없다", score: 0 },
        { label: "가끔 있다", score: 1 },
        { label: "자주 있다", score: 2 },
        { label: "거의 항상 있다", score: 3 }
      ]
    },
    {
      text: "요즘 일상(잠·식사·공부·할 일)을 유지하는 데 부담이 크다.",
      options: [
        { label: "괜찮다", score: 0 },
        { label: "조금 부담된다", score: 1 },
        { label: "꽤 힘들다", score: 2 },
        { label: "거의 버겁다", score: 3 }
      ]
    },
    {
      text: "지금 상태를 조금이라도 바꾸고 싶다는 마음이 있다.",
      options: [
        { label: "그렇다 (변화 의지 있음)", score: 0 },
        { label: "조금 있다", score: 1 },
        { label: "잘 모르겠다", score: 2 },
        { label: "거의 없다", score: 3 }
      ]
    },
    {
      text: "친구·가족·선생님과 연락하거나 만나는 빈도가 줄었다.",
      options: [
        { label: "비슷하거나 늘었다", score: 0 },
        { label: "조금 줄었다", score: 1 },
        { label: "많이 줄었다", score: 2 },
        { label: "거의 연락하지 않는다", score: 3 }
      ]
    }
  ];

  var MAX_SCORE = QUESTIONS.length * 3;
  /** 구간: 안전 0~8 / 주의 9~17 / 경고 18~27 (9문항×0~3) */
  var THRESHOLDS = { caution: 9, warn: 18 };

  var RESULTS = {
    safe: {
      levelClass: "level-safe",
      levelLabel: "안전",
      title: "지금은 비교적 안정적으로 보이는 편입니다",
      html:
        "<p>관계와 일상을 어느 정도 유지하고 있는 쪽으로 보입니다. " +
        "그래도 힘들 때는 언제든 이야기해도 괜찮습니다.</p>" +
        "<ul>" +
        "<li>지금 잘 되고 있는 습관·관계를 가볍게 적어 보세요.</li>" +
        "<li>작은 변화라도 스스로 알아차리는 것만으로도 도움이 됩니다.</li>" +
        "<li>주변 친구 중 혼자인 듯한 사람이 있다면, 먼저 안부를 물어봐도 좋습니다.</li>" +
        "</ul>"
    },
    caution: {
      levelClass: "level-caution",
      levelLabel: "주의",
      title: "혼자 버티기보다, 한 사람과 연결해 보세요",
      html:
        "<p>관계·외출·일상 중 일부가 부담으로 느껴질 수 있는 구간입니다. " +
        "진단이 아니라, <strong>조금 더 돌봄과 대화가 필요한 신호</strong>로 읽어 주세요.</p>" +
        "<ul>" +
        "<li>믿을 수 있는 한 명(친구·가족·선생님)에게 짧게라도 이야기해 보세요.</li>" +
        "<li>학교 상담·Wee클래스에 “요즘 좀 힘들다”고만 말해도 됩니다.</li>" +
        "<li>다음 화면의 지원 안내에서 1388·지역 기관도 확인해 보세요.</li>" +
        "</ul>"
    },
    warn: {
      levelClass: "level-warn",
      levelLabel: "경고",
      title: "혼자 해결하려 하지 말고, 상담·어른과 연결하세요",
      html:
        "<p>관계가 줄고 혼자 있는 시간·부담이 크게 느껴질 수 있는 결과입니다. " +
        "이는 <strong>진단·판정이 아니며</strong>, 지금 도움을 요청해도 된다는 안내입니다.</p>" +
        "<ul>" +
        "<li>담임·상담 선생님, 또는 가족에게 먼저 말해 보세요.</li>" +
        "<li>청소년 상담 <strong>1388</strong>(전화·채팅)을 바로 이용할 수 있습니다.</li>" +
        "<li>위험하거나 너무 힘들면 응급실·긴급 도움도 망설이지 마세요.</li>" +
        "</ul>"
    }
  };

  var state = {
    index: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    level: null
  };

  var el = {
    intro: document.getElementById("screen-intro"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result"),
    support: document.getElementById("screen-support"),
    meta: document.getElementById("q-meta"),
    text: document.getElementById("q-text"),
    options: document.getElementById("q-options"),
    bar: document.getElementById("progress-bar"),
    prev: document.getElementById("btn-prev"),
    next: document.getElementById("btn-next"),
    level: document.getElementById("result-level"),
    title: document.getElementById("result-title"),
    body: document.getElementById("result-body"),
    urgent: document.getElementById("support-urgent")
  };

  function show(screen) {
    el.intro.classList.toggle("hidden", screen !== "intro");
    el.quiz.classList.toggle("hidden", screen !== "quiz");
    el.result.classList.toggle("hidden", screen !== "result");
    el.support.classList.toggle("hidden", screen !== "support");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    var q = QUESTIONS[state.index];
    var n = state.index + 1;
    el.meta.textContent = n + " / " + QUESTIONS.length;
    el.text.textContent = q.text;
    el.bar.style.width = Math.round((state.index / QUESTIONS.length) * 100) + "%";
    el.options.innerHTML = "";
    q.options.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.textContent = opt.label;
      if (state.answers[state.index] === i) {
        btn.style.borderColor = "var(--teal)";
        btn.style.background = "var(--teal-soft)";
      }
      btn.addEventListener("click", function () {
        state.answers[state.index] = i;
        renderQuestion();
        el.next.disabled = false;
      });
      el.options.appendChild(btn);
    });
    el.prev.disabled = state.index === 0;
    el.next.disabled = state.answers[state.index] === null;
    el.next.textContent = state.index === QUESTIONS.length - 1 ? "결과 보기" : "다음";
  }

  function totalScore() {
    var sum = 0;
    state.answers.forEach(function (ans, qi) {
      if (ans === null) return;
      sum += QUESTIONS[qi].options[ans].score;
    });
    return sum;
  }

  function decideLevel(score) {
    if (score >= THRESHOLDS.warn) return "warn";
    if (score >= THRESHOLDS.caution) return "caution";
    return "safe";
  }

  function showResult() {
    var score = totalScore();
    var key = decideLevel(score);
    state.level = key;
    var r = RESULTS[key];
    el.level.className = "result-level " + r.levelClass;
    el.level.textContent = r.levelLabel + " · 참고 점수 " + score + " / " + MAX_SCORE;
    el.title.textContent = r.title;
    el.body.innerHTML = r.html;
    el.bar.style.width = "100%";
    show("result");
  }

  function showSupport() {
    var showUrgent = state.level === "caution" || state.level === "warn";
    el.urgent.classList.toggle("hidden", !showUrgent);
    show("support");
  }

  function restart() {
    state.index = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    state.level = null;
    show("intro");
  }

  document.getElementById("btn-start").addEventListener("click", function () {
    state.index = 0;
    renderQuestion();
    show("quiz");
  });

  el.prev.addEventListener("click", function () {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  });

  el.next.addEventListener("click", function () {
    if (state.answers[state.index] === null) return;
    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      renderQuestion();
    } else {
      showResult();
    }
  });

  document.getElementById("btn-to-support").addEventListener("click", showSupport);
  document.getElementById("btn-restart").addEventListener("click", restart);
  document.getElementById("btn-home").addEventListener("click", restart);
  document.getElementById("btn-back-result").addEventListener("click", function () {
    show("result");
  });
})();
