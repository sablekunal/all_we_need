// Announcement Banner & Suggestions Management Script for All We Need

(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Check dismissal state
    const banner = document.getElementById('announcementBanner');
    if (banner && localStorage.getItem('awn_announcement_dismissed') === 'true') {
      banner.style.display = 'none';
    }

    // Bind close button
    const closeBtn = document.getElementById('dismissBannerBtn');
    if (closeBtn && banner) {
      closeBtn.addEventListener('click', function () {
        banner.style.transition = 'all 0.3s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-100%)';
        setTimeout(function () {
          banner.style.display = 'none';
        }, 300);
        localStorage.setItem('awn_announcement_dismissed', 'true');
      });
    }

    // Initialize suggestions list if on /suggestions page
    if (document.getElementById('suggestionsList')) {
      initSuggestionsPage();
    }
  });
})();

// Toggle quick suggestion form in announcement banner
function toggleSuggestionForm() {
  const modal = document.getElementById('quickSuggestionModal');
  if (modal) {
    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      const input = document.getElementById('sugName');
      if (input) input.focus();
    } else {
      modal.classList.add('hidden');
    }
  }
}

// Handle quick suggestion submit from banner
function handleQuickSuggestionSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('announcementSuggestionForm');
  const nameInput = document.getElementById('sugName');
  const catInput = document.getElementById('sugCategory');
  const descInput = document.getElementById('sugDescription');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  // Clear previous errors
  clearFormErrors(form);

  let hasError = false;

  if (!nameInput || !nameInput.value.trim()) {
    showInputError(nameInput, 'Please enter your name or GitHub handle.');
    hasError = true;
  }

  if (!descInput || !descInput.value.trim()) {
    showInputError(descInput, 'Please describe your suggestion or feedback.');
    hasError = true;
  } else if (descInput.value.trim().length < 5) {
    showInputError(descInput, 'Suggestion description must be at least 5 characters.');
    hasError = true;
  }

  if (hasError) return;

  // Loading state (Item 12)
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.origText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span class="inline-flex items-center gap-1.5">
        <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
      </span>
    `;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
  }

  const name = nameInput.value.trim();
  const category = catInput ? catInput.value : 'Feature Request';
  const description = descInput.value.trim();
  const title = description.length > 65 ? description.substring(0, 62) + '...' : description;

  // GitHub Issue pre-filled URL to store on GitHub
  const issueTitle = `[Suggestion] ${category}: ${title}`;
  const issueBody = `### Community Suggestion / Expected Change\n\n**Submitted by:** ${name}\n**Category:** ${category}\n\n**Description:**\n${description}\n\n---\n*Submitted via All We Need website announcement banner.*`;
  const githubIssueUrl = `https://github.com/sablekunal/all_we_need/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;

  const newSuggestion = {
    id: 'user-sug-' + Date.now(),
    name: name,
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(name)}`,
    title: title,
    description: description,
    category: category,
    status: 'Community Idea',
    votes: 1,
    date: new Date().toISOString().split('T')[0],
    githubUrl: githubIssueUrl
  };

  // Save to localStorage
  const localSuggestions = JSON.parse(localStorage.getItem('awn_user_suggestions') || '[]');
  localSuggestions.unshift(newSuggestion);
  localStorage.setItem('awn_user_suggestions', JSON.stringify(localSuggestions));

  setTimeout(() => {
    // Reset form & hide modal
    nameInput.value = '';
    descInput.value = '';
    if (submitBtn && submitBtn.dataset.origText) {
      submitBtn.innerHTML = submitBtn.dataset.origText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
    toggleSuggestionForm();

    // Open GitHub Issue tab in background
    try {
      window.open(githubIssueUrl, '_blank');
    } catch (e) {
      console.warn('Popup blocked:', e);
    }

    // Redirect to Thank You page (Item 14)
    window.location.href = getBasePath() + 'thank-you.html';
  }, 600);
}

// Inline Form Error Helpers (Item 13)
function showInputError(inputEl, message) {
  if (!inputEl) return;
  inputEl.classList.add('border-rose-500', 'ring-1', 'ring-rose-500');
  let err = inputEl.parentNode.querySelector('.form-error-msg');
  if (!err) {
    err = document.createElement('p');
    err.className = 'form-error-msg text-rose-400 text-[10px] font-mono mt-1 flex items-center gap-1';
    inputEl.parentNode.appendChild(err);
  }
  err.innerHTML = `<span>⚠️ ${escapeHtml(message)}</span>`;

  // Auto clear error when user types
  const clearHandler = function () {
    inputEl.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
    if (err) err.remove();
    inputEl.removeEventListener('input', clearHandler);
  };
  inputEl.addEventListener('input', clearHandler);
}

function clearFormErrors(form) {
  if (!form) return;
  form.querySelectorAll('.border-rose-500').forEach(el => {
    el.classList.remove('border-rose-500', 'ring-1', 'ring-rose-500');
  });
  form.querySelectorAll('.form-error-msg').forEach(el => el.remove());
}

// Get base path relative to current page
function getBasePath() {
  if (window.location.pathname.includes('/projects/')) {
    return '../';
  }
  return '';
}

// Show Toast Notification
function showNotification(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-[120] bg-indigo-950 text-white px-5 py-3 rounded-xl border border-indigo-500/40 shadow-2xl flex items-center gap-3 font-sans text-xs animate-bounce';
  toast.innerHTML = `<span>🎉 ${escapeHtml(msg)}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4500);
}

// Escape HTML
function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[s]));
}

// Initialize /suggestions page rendering & filtering
async function initSuggestionsPage() {
  const container = document.getElementById('suggestionsList');
  if (!container) return;

  let seedSuggestions = [];
  try {
    const res = await fetch(getBasePath() + 'suggestions.json');
    if (res.ok) {
      seedSuggestions = await res.json();
    }
  } catch (e) {
    console.warn('Could not load suggestions.json:', e);
  }

  const localSuggestions = JSON.parse(localStorage.getItem('awn_user_suggestions') || '[]');
  const allSuggestions = [...localSuggestions, ...seedSuggestions];

  window.CURRENT_SUGGESTIONS = allSuggestions;
  renderSuggestionsList(allSuggestions);

  // Bind category filter tabs
  const tabs = document.querySelectorAll('.sug-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('bg-indigo-600', 'text-white'));
      tabs.forEach(t => t.classList.add('bg-neutral-900', 'text-neutral-400'));
      this.classList.remove('bg-neutral-900', 'text-neutral-400');
      this.classList.add('bg-indigo-600', 'text-white');

      const filter = this.getAttribute('data-filter');
      if (filter === 'all') {
        renderSuggestionsList(allSuggestions);
      } else {
        const filtered = allSuggestions.filter(s => s.category.toLowerCase() === filter.toLowerCase());
        renderSuggestionsList(filtered);
      }
    });
  });
}

// Render list of suggestions cards
function renderSuggestionsList(items) {
  const container = document.getElementById('suggestionsList');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 bg-neutral-900/50 rounded-2xl border border-white/5">
        <p class="text-neutral-400 font-mono text-sm">No suggestions found in this category yet.</p>
        <button onclick="toggleSuggestionForm()" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-mono text-xs">Be the first to suggest!</button>
      </div>
    `;
    return;
  }

  const userVotes = JSON.parse(localStorage.getItem('awn_suggestion_votes') || '{}');

  container.innerHTML = items.map(item => {
    const isVoted = userVotes[item.id];
    const voteCount = item.votes + (isVoted ? 1 : 0);
    
    let statusClass = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    if (item.status === 'Planned') statusClass = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (item.status === 'Implemented') statusClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (item.status === 'Under Review') statusClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

    return `
      <div class="glass-card p-6 rounded-2xl border border-white/5 bg-neutral-900/60 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <img src="${item.avatar}" alt="${escapeHtml(item.name)}" class="w-8 h-8 rounded-full border border-white/10 object-cover bg-neutral-800">
              <div>
                <h5 class="text-xs font-mono text-white font-semibold">${escapeHtml(item.name)}</h5>
                <span class="text-[10px] font-mono text-neutral-500">${escapeHtml(item.date)}</span>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${statusClass}">
              ${escapeHtml(item.status)}
            </span>
          </div>

          <h4 class="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">${escapeHtml(item.title)}</h4>
          <p class="text-xs text-neutral-400 leading-relaxed mb-4">${escapeHtml(item.description)}</p>
        </div>

        <div class="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
          <span class="text-[11px] font-mono text-neutral-500 bg-neutral-950 px-2.5 py-1 rounded-md border border-white/5">
            ${escapeHtml(item.category)}
          </span>
          <div class="flex items-center gap-3">
            <button onclick="upvoteSuggestion('${item.id}')" class="px-3 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${isVoted ? 'bg-indigo-600 text-white shadow-md' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'}">
              👍 <span>${voteCount}</span>
            </button>
            <a href="${item.githubUrl || 'https://github.com/sablekunal/all_we_need/issues'}" target="_blank" class="text-[11px] font-mono text-indigo-400 hover:text-white flex items-center gap-1">
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Upvote suggestion
function upvoteSuggestion(id) {
  const userVotes = JSON.parse(localStorage.getItem('awn_suggestion_votes') || '{}');
  if (userVotes[id]) {
    delete userVotes[id];
  } else {
    userVotes[id] = true;
  }
  localStorage.setItem('awn_suggestion_votes', JSON.stringify(userVotes));
  if (window.CURRENT_SUGGESTIONS) {
    renderSuggestionsList(window.CURRENT_SUGGESTIONS);
  }
}
