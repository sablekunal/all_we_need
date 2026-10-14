// TruthDraft Promo Popup — All We Need
// Shows a dismissible popup after 8s promoting TruthDraft (formerly GhostIQ)

(function () {
  const POPUP_KEY = 'awn_truthdraft_popup_dismissed';
  const POPUP_DELAY = 8000; // 8 seconds

  function createPopup() {
    if (localStorage.getItem(POPUP_KEY) === 'true') return;

    const popup = document.createElement('div');
    popup.id = 'truthdraftPromoPopup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'TruthDraft — Free AI Humanizer');
    popup.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:9999',
      'width:320px',
      'background:linear-gradient(135deg,#0f0f1a 60%,#1a0f2e)',
      'border:1px solid rgba(139,92,246,0.35)',
      'border-radius:16px',
      'box-shadow:0 8px 40px rgba(0,0,0,0.7),0 0 0 1px rgba(139,92,246,0.1)',
      'overflow:hidden',
      'opacity:0',
      'transform:translateY(20px)',
      'transition:opacity 0.4s ease,transform 0.4s ease',
      'font-family:Inter,sans-serif'
    ].join(';');

    popup.innerHTML = `
      <div style="position:relative;">
        <!-- Banner image -->
        <div style="width:100%;height:120px;overflow:hidden;border-radius:16px 16px 0 0;background:#0c0c18;">
          <img src="https://truthdraft.com/og-image.png"
               alt="TruthDraft AI Humanizer"
               style="width:100%;height:100%;object-fit:cover;opacity:0.85;"
               onerror="this.style.display='none'">
        </div>
        <!-- Close button -->
        <button id="truthdraftCloseBtn"
                aria-label="Close"
                style="position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.15);color:#ccc;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;line-height:1;backdrop-filter:blur(4px);">
          ✕
        </button>
        <!-- Badge -->
        <div style="position:absolute;top:8px;left:12px;display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:20px;background:rgba(139,92,246,0.25);border:1px solid rgba(139,92,246,0.4);font-size:10px;font-family:'JetBrains Mono',monospace;font-weight:700;color:#c4b5fd;letter-spacing:0.05em;text-transform:uppercase;">
          <span style="width:6px;height:6px;border-radius:50%;background:#a78bfa;animation:awn-pulse 1.5s ease-in-out infinite;"></span>
          Free Tool
        </div>
      </div>
      <!-- Content -->
      <div style="padding:16px 18px 18px;">
        <p style="margin:0 0 4px 0;font-size:11px;font-family:'JetBrains Mono',monospace;color:#7c3aed;text-transform:uppercase;letter-spacing:0.08em;">Found a best free humanizer for you</p>
        <h3 style="margin:0 0 8px 0;font-size:15px;font-weight:700;color:#fff;line-height:1.3;">TruthDraft — AI Humanizer &amp; Detector</h3>
        <p style="margin:0 0 14px 0;font-size:11px;color:#9ca3af;line-height:1.6;">
          Detect AI text &amp; humanize it instantly. Turnitin, GPTZero &amp; Originality.ai compatible. Natural syntactic flow. Zero logins, 100% free.
        </p>
        <div style="display:flex;gap:8px;align-items:center;">
          <a href="https://truthdraft.com/"
             target="_blank"
             rel="noopener noreferrer"
             id="truthdraftPromoBtn"
             style="flex:1;display:block;text-align:center;padding:9px 12px;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;text-decoration:none;border-radius:10px;font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace;transition:opacity 0.2s;letter-spacing:0.03em;"
             onmouseover="this.style.opacity='0.85'"
             onmouseout="this.style.opacity='1'">
            Try TruthDraft →
          </a>
          <button id="truthdraftDismissBtn"
                  style="padding:9px 12px;background:transparent;border:1px solid rgba(255,255,255,0.1);color:#6b7280;border-radius:10px;cursor:pointer;font-size:11px;font-family:'JetBrains Mono',monospace;white-space:nowrap;"
                  onmouseover="this.style.borderColor='rgba(255,255,255,0.25)';this.style.color='#d1d5db'"
                  onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#6b7280'">
            Dismiss
          </button>
        </div>
      </div>
    `;

    // Pulse keyframe
    if (!document.getElementById('awn-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'awn-popup-styles';
      style.textContent = `
        @keyframes awn-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(popup);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        popup.style.opacity = '1';
        popup.style.transform = 'translateY(0)';
      });
    });

    function dismiss(remember) {
      popup.style.opacity = '0';
      popup.style.transform = 'translateY(20px)';
      setTimeout(() => popup.remove(), 400);
      if (remember) localStorage.setItem(POPUP_KEY, 'true');
    }

    document.getElementById('truthdraftCloseBtn').addEventListener('click', () => dismiss(false));
    document.getElementById('truthdraftDismissBtn').addEventListener('click', () => dismiss(true));
    document.getElementById('truthdraftPromoBtn').addEventListener('click', () => dismiss(true));
  }

  function init() {
    // Don't show on truthdraft page itself
    if (window.location.href.includes('truthdraft')) return;
    setTimeout(createPopup, POPUP_DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
