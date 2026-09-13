// Cookie Consent Banner & Analytics Manager for All We Need (AWN_)

(function () {
  const STORAGE_KEY = 'awn_cookie_consent';

  function initCookieConsent() {
    const consent = localStorage.getItem(STORAGE_KEY);

    if (consent === 'accepted') {
      enableAnalytics();
      return;
    } else if (consent === 'essential') {
      disableAnalytics();
      return;
    }

    // Render banner if no choice yet
    renderBanner();
  }

  function renderBanner() {
    if (document.getElementById('awn-cookie-banner')) return;

    const banner = document.createElement('aside');
    banner.id = 'awn-cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie and privacy preferences');
    banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[999] p-5 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-indigo-500/30 text-white shadow-2xl transition-all duration-500 transform translate-y-8 opacity-0 animate-fade-in font-sans';

    // Base path calculation for subdirectories (like /projects/)
    const isSubdir = window.location.pathname.includes('/projects/');
    const privacyUrl = isSubdir ? '../privacy.html' : 'privacy.html';

    banner.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-300 text-lg">
          🍪
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-bold tracking-tight text-white mb-1">Cookie & Privacy Choices</h4>
          <p class="text-xs text-neutral-300 leading-relaxed mb-4">
            We use cookies and anonymized analytics to measure site usage and support our open-source free tools directory. No personal tracking.
            <a href="${privacyUrl}" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-1">Privacy Policy</a>.
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <button id="awn-accept-cookies" class="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-mono font-semibold rounded-lg shadow transition-all cursor-pointer">
              Accept All
            </button>
            <button id="awn-essential-cookies" class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono rounded-lg border border-white/10 transition-all cursor-pointer">
              Essential Only
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Trigger smooth fade-in
    requestAnimationFrame(() => {
      banner.classList.remove('translate-y-8', 'opacity-0');
    });

    // Event listeners
    document.getElementById('awn-accept-cookies').addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'accepted');
      enableAnalytics();
      dismissBanner(banner);
    });

    document.getElementById('awn-essential-cookies').addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, 'essential');
      disableAnalytics();
      dismissBanner(banner);
    });
  }

  function dismissBanner(banner) {
    banner.classList.add('translate-y-8', 'opacity-0');
    setTimeout(() => banner.remove(), 400);
  }

  function enableAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  }

  function disableAnalytics() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }
  }

  // Public reset method for footer "Cookie Preferences" link
  window.resetCookieConsent = function () {
    localStorage.removeItem(STORAGE_KEY);
    renderBanner();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
  } else {
    initCookieConsent();
  }
})();
