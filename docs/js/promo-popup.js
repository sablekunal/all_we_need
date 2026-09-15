// Developer-Verified Promotion Popup for ghostIQ
// Injected non-intrusively across All We Need

(function () {
  const STORAGE_KEY = 'awn_ghostiq_promo_dismissed';

  function initPromoPopup() {
    // Check if dismissed previously
    if (localStorage.getItem(STORAGE_KEY) === 'true') {
      return;
    }

    // Delay appearance slightly so it does not interfere with initial page load
    setTimeout(renderPopup, 1500);
  }

  function renderPopup() {
    if (document.getElementById('awn-promo-popup')) return;

    // Resolve relative path to ghostIQ blog post based on current directory
    let blogHref = 'blog/free-ai-humanizer-turnitin-bypass-ghostiq-2026.html';
    const path = window.location.pathname;
    if (path.includes('/projects/')) {
      blogHref = '../blog/free-ai-humanizer-turnitin-bypass-ghostiq-2026.html';
    } else if (path.includes('/blog/')) {
      blogHref = 'free-ai-humanizer-turnitin-bypass-ghostiq-2026.html';
    }

    const popup = document.createElement('aside');
    popup.id = 'awn-promo-popup';
    popup.setAttribute('role', 'complementary');
    popup.setAttribute('aria-label', 'Recommended Free Tool Promotion');
    popup.className = 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[990] max-w-[350px] sm:max-w-[390px] w-[calc(100%-2rem)] sm:w-full bg-neutral-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl p-4 text-white font-sans transition-all duration-500 transform translate-y-8 opacity-0 pointer-events-auto';

    popup.innerHTML = `
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-semibold tracking-wide">
          <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
          </svg>
          Developer Verified
        </span>
        <button id="dismissPromoBtn" type="button" aria-label="Close notification" class="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs font-mono">
          ✕
        </button>
      </div>

      <a href="https://ghostiq.pages.dev/" target="_blank" rel="noopener noreferrer" class="block rounded-xl overflow-hidden border border-white/10 group mb-3 shadow-md bg-neutral-950">
        <img src="https://ghostiq.pages.dev/og-image.svg" alt="ghostIQ Stealth AI Humanizer Banner" class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300" width="400" height="210" loading="lazy">
      </a>

      <div>
        <div class="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold mb-1">// Found a best free humanizer for you</div>
        <h4 class="text-sm font-bold text-white leading-tight">ghostIQ — Stealth AI Humanizer & Bypass</h4>
        <p class="text-xs text-neutral-300 mt-1 leading-relaxed">Turnitin v2.4, GPTZero & Originality.ai bypass with natural syntactic flow. Zero logins, 100% free.</p>
      </div>

      <div class="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
        <a href="https://ghostiq.pages.dev/" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono text-xs font-semibold rounded-xl shadow-lg transition-all text-center">
          Visit Site ↗
        </a>
        <a href="${blogHref}" class="flex items-center justify-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-white/10 font-mono text-xs font-semibold rounded-xl transition-all text-center">
          Read More →
        </a>
      </div>
    `;

    document.body.appendChild(popup);

    // Smooth entrance
    requestAnimationFrame(() => {
      popup.classList.remove('translate-y-8', 'opacity-0');
    });

    // Dismiss handling
    const dismissBtn = document.getElementById('dismissPromoBtn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        popup.classList.add('translate-y-8', 'opacity-0');
        setTimeout(() => {
          if (popup.parentNode) popup.parentNode.removeChild(popup);
        }, 500);
        localStorage.setItem(STORAGE_KEY, 'true');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPromoPopup);
  } else {
    initPromoPopup();
  }
})();
