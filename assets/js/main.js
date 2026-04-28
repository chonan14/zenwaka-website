/* 全国若手議員の会 — 最小限のJS */

(function () {
  'use strict';

  /* モバイルメニュー */
  const toggle = document.querySelector('.nav-toggle');
  const list = document.getElementById('primary-nav');
  if (toggle && list) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.classList.toggle('is-open');
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
  }

  /* Google翻訳リンクの動的URL設定（現在ページを翻訳） */
  const pageUrl = encodeURIComponent(location.href);
  const translateEn = document.getElementById('translate-en');
  const translateFr = document.getElementById('translate-fr');
  if (translateEn) translateEn.href = `https://translate.google.com/translate?sl=ja&tl=en&u=${pageUrl}`;
  if (translateFr) translateFr.href = `https://translate.google.com/translate?sl=ja&tl=fr&u=${pageUrl}`;

  /* 現在ページのナビをハイライト */
  const path = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav-list a, .footer-col a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href === '/') return;
    if (path.startsWith(href)) a.setAttribute('aria-current', 'page');
  });

  /* 会員数推移グラフ: ビューポートに入ったらアニメーション */
  const memberChart = document.querySelector('.member-chart');
  if (memberChart) {
    if ('IntersectionObserver' in window) {
      const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            memberChart.classList.add('animate');
            chartObserver.unobserve(memberChart);
          }
        });
      }, { threshold: 0.3 });
      chartObserver.observe(memberChart);
    } else {
      memberChart.classList.add('animate');
    }
  }

  /* 現会員数カウントアップ */
  const statsCounter = document.querySelector('.stats-counter');
  if (statsCounter) {
    const target = parseInt(statsCounter.dataset.target || '0', 10);
    const runCount = () => {
      const duration = 1800;
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        statsCounter.textContent = Math.floor(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else statsCounter.textContent = target;
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) { runCount(); obs.disconnect(); }
      }, { threshold: 0.5 });
      counterObserver.observe(statsCounter);
    } else {
      runCount();
    }
  }

  /* フォーム送信ハンドラ (Discord Webhook経由) */
  document.querySelectorAll('form[data-form-handler]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      let status = form.querySelector('.form-status');
      if (!status) {
        status = document.createElement('div');
        status.className = 'form-status';
        if (submit && submit.parentNode) submit.parentNode.appendChild(status);
        else form.appendChild(status);
      }
      const originalLabel = submit ? submit.textContent : '';
      if (submit) { submit.disabled = true; submit.textContent = '送信中…'; }
      status.textContent = '';
      status.className = 'form-status';

      try {
        const data = new FormData(form);
        const r = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        const result = await r.json().catch(() => ({}));
        if (r.ok && result.ok) {
          form.innerHTML = '<div class="form-success"><h3>送信を受け付けました</h3><p>お問合せありがとうございました。担当よりご連絡いたします。</p></div>';
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        throw new Error(result.error || '送信に失敗しました（しばらくしてからお試しください）');
      } catch (err) {
        status.textContent = err.message || '送信に失敗しました';
        status.classList.add('is-error');
        if (submit) { submit.disabled = false; submit.textContent = originalLabel || '送信する'; }
      }
    });
  });

  /* フィルタタブ（アーカイブ等） */
  document.querySelectorAll('.filter-tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.filter-tab');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.cat;
        const target = tabs.nextElementSibling;
        if (!target) return;
        target.querySelectorAll('[data-cat]').forEach(item => {
          item.style.display = (!cat || cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  });

})();
