/* Single-page catalog. Project facts stay in projects.json; editorial text in catalog-copy.js. */
window.CodeWerkCatalog = (() => {
  const grid = document.querySelector('#projectsGrid');
  const search = document.querySelector('#catalogSearch');
  const dialog = document.querySelector('#programDialog');
  const detailBody = document.querySelector('#programDetailBody');
  const detailLanguage = document.querySelector('#detailLanguage');
  let projects = [];
  let searchIndex;
  let activeFilter = 'all';
  let activeId = null;
  let openedFromHistory = false;
  let closingFromNavigation = false;
  let returnFocus;

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };
  const icon = (name) => {
    const node = el('i');
    node.dataset.lucide = name;
    node.setAttribute('aria-hidden', 'true');
    return node;
  };
  const paintIcons = () => window.lucide?.createIcons();
  const normalize = (text) => String(text || '').toLocaleLowerCase().replaceAll('ё', 'е').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const copy = (project, language = currentLanguage) => ({ ...project, ...(projectTranslations[language]?.[project.id] || {}), ...(window.CodeWerkCatalogCopy[language].projects[project.id] || {}) });
  const platform = (project) => {
    if (project.id === 'calendar-germany') return 'Chrome';
    if (project.crossPlatform) return 'Windows · macOS · Linux';
    if (project.id === 'link-manager') return `Windows · ${t('browser')}`;
    return project.id === 'cookbook' ? 'Windows 10 / 11 · x64' : 'Windows 10 / 11';
  };
  const categories = (p) => p.categories || (p.id === 'calendar-germany' ? ['extension'] : p.crossPlatform ? ['browser'] : p.id === 'link-manager' ? ['windows', 'browser'] : ['windows']);

  const action = (label, name, callback, style = 'button button-ghost') => {
    const button = el('button', style);
    button.type = 'button';
    if (name) button.append(icon(name));
    button.append(el('span', null, label));
    button.addEventListener('click', callback);
    return button;
  };
  const link = (label, url, name, style = 'button button-ghost') => {
    const a = el('a', style);
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    if (name) a.append(icon(name));
    a.append(el('span', null, label));
    return a;
  };
  const fileLink = (label, url, name = 'download', style = 'button button-primary') => {
    const a = link(label, url, name, style);
    a.removeAttribute('target');
    a.setAttribute('download', '');
    return a;
  };
  const storeLink = (p) => link('Microsoft Store', p.storeUrl, 'shopping-bag');
  const download = (p) => {
    if (p.downloadAvailable === false || (!p.downloadUrl && !p.storeUrl)) {
      const button = action(t('downloadUnavailable'), 'download', () => {}, 'button button-primary');
      button.disabled = true;
      button.title = t(p.downloadUnavailableReason || 'downloadUnavailable');
      return button;
    }
    if (p.storeUrl && !p.downloadUrl) return storeLink(p);
    if (p.downloadMode === 'request') return link(t('requestDownload'), buildDownloadRequestLink(p), 'download', 'button button-primary');
    return fileLink(t('download'), p.downloadUrl);
  };
  const image = (src, alt) => {
    const wrapper = el('div', 'catalog-image');
    const img = el('img');
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.addEventListener('error', () => wrapper.replaceChildren(el('p', 'image-error', t('imageMissing'))), { once: true });
    wrapper.append(img);
    return wrapper;
  };

  const buildCard = (raw, index) => {
    const p = copy(raw);
    const article = el('article', 'catalog-program');
    article.id = p.id;
    const meta = el('div', 'catalog-meta');
    meta.append(el('span', 'catalog-number', String(index + 1).padStart(2, '0')), el('span', null, platform(p)));
    const title = el('h3', 'catalog-program-title', p.title);
    article.setAttribute('aria-labelledby', `title-${p.id}`);
    title.id = `title-${p.id}`;
    const heading = el('div', 'catalog-program-heading');
    heading.append(title);
    if (p.videoUrl) {
      const video = link('', p.videoUrl, 'youtube', 'catalog-video-link');
      video.title = t('youtube');
      video.setAttribute('aria-label', `${t('youtube')}: ${p.title}`);
      heading.append(video);
    }
    const shot = action('', null, () => open(p.id), 'catalog-shot');
    shot.setAttribute('aria-label', `${t('details')}: ${p.title}`);
    shot.append(image(p.screenshot, t('screenshot', { title: p.title })));
    const bottom = el('div', 'catalog-program-bottom');
    const text = el('div');
    text.append(el('p', 'catalog-tagline', p.tagline), el('p', 'catalog-description', p.description));
    const actions = el('div', 'catalog-program-actions');
    const details = action(t('details'), 'arrow-up-right', () => open(p.id), 'button button-primary');
    details.dataset.detailFor = p.id;
    actions.append(details);
    if (p.storeUrl && p.downloadUrl) {
      actions.classList.add('has-store');
      actions.append(storeLink(p));
    }
    actions.append(download(p));
    actions.lastChild.className = 'button button-ghost';
    if (p.qrImage) {
      const qr = el('details', 'catalog-qr');
      qr.append(el('summary', null, t('qrLabel')));
      const qrImage = el('img');
      qrImage.src = p.qrImage;
      qrImage.alt = t('qrAlt');
      qrImage.width = 100;
      qrImage.height = 100;
      qr.append(qrImage);
      actions.append(qr);
    }
    bottom.append(text, actions);
    article.append(meta, heading, shot, bottom);
    return article;
  };

  const rebuildIndex = () => {
    const records = projects.map((p) => ({
      id: p.id,
      names: normalize([p.id, p.title, ...(p.searchAliases || []), ...['ru', 'en', 'de'].map(lang => copy(p, lang).title)].join(' ')),
      text: normalize(['ru', 'en', 'de'].map(lang => { const c = copy(p, lang); return [c.description, c.tagline, ...(c.features || []), ...(c.sections || []).flat()].join(' '); }).join(' '))
    }));
    searchIndex = window.Fuse ? new Fuse(records, { keys: [{ name: 'names', weight: 0.7 }, { name: 'text', weight: 0.3 }], threshold: 0.32, ignoreLocation: true, includeScore: true, minMatchCharLength: 2 }) : null;
  };
  const searchIds = () => {
    const query = normalize(search.value).trim();
    if (!query) return null;
    const stop = new Set(['как', 'для', 'мне', 'хочу', 'нужно', 'что', 'где', 'из', 'the', 'for', 'with', 'want', 'how', 'can', 'und', 'ich', 'eine', 'ein', 'mit', 'fur']);
    const terms = query.split(/[^\p{L}\p{N}]+/u).filter(term => term.length > 1 && !stop.has(term));
    const scores = new Map();
    for (const term of terms.length ? terms : [query]) {
      const matches = searchIndex ? searchIndex.search(term) : projects.filter(p => normalize(JSON.stringify(p)).includes(term)).map(p => ({ item: p, score: 0 }));
      for (const { item, score } of matches) scores.set(item.id, (scores.get(item.id) || 0) + 1 - (score || 0));
    }
    const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    const cutoff = (ranked[0]?.[1] || 0) * 0.65;
    return ranked.filter(([, score]) => score >= cutoff).map(([id]) => id);
  };

  const renderList = () => {
    const ids = searchIds();
    let visible = projects.filter(p => (activeFilter === 'all' || categories(p).includes(activeFilter)) && (!ids || ids.includes(p.id)));
    if (ids) visible.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
    grid.replaceChildren(...visible.map(buildCard));
    document.querySelector('#catalogCount').textContent = t('results', { count: visible.length });
    document.querySelector('#clearCatalogSearch').hidden = !search.value;
    if (!visible.length) {
      const empty = el('div', 'catalog-empty');
      empty.append(icon('search-x'), el('h3', null, t('emptyTitle')), el('p', null, t('emptyText')), action(t('reset'), 'rotate-ccw', reset));
      grid.append(empty);
    }
    paintIcons();
  };
  const reset = () => {
    search.value = '';
    activeFilter = 'all';
    document.querySelectorAll('[data-catalog-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.catalogFilter === 'all')));
    renderList();
    search.focus();
  };

  const renderDetails = (raw) => {
    const p = copy(raw);
    const previousScroll = detailBody.scrollTop;
    document.querySelector('#programDialogTitle').textContent = p.title;
    detailLanguage.value = currentLanguage;
    const intro = el('section', 'detail-intro');
    intro.append(el('p', 'catalog-meta', platform(p)), el('h2', null, p.tagline), el('p', 'detail-lead', p.description));
    const downloads = el('div', 'detail-actions');
    const primaryDownload = download(p);
    if (p.id === 'cookbook' && p.downloadAvailable !== false && !p.storeUrl) primaryDownload.lastChild.textContent = t('installer');
    if (p.storeUrl && p.downloadUrl) downloads.append(storeLink(p));
    downloads.append(primaryDownload);
    if (p.portablePreviewUrl) downloads.append(fileLink(t('portablePreview'), p.portablePreviewUrl, 'flask-conical', 'button button-ghost'));
    if (p.videoUrl) downloads.append(link(t('youtube'), p.videoUrl, 'youtube'));
    if (p.showRepositoryLink !== false && p.githubUrl) downloads.append(link('GitHub', p.githubUrl, 'github'));
    intro.append(downloads);
    if (p.downloadAvailable === false) intro.append(el('p', 'detail-note', t(p.downloadUnavailableReason || 'downloadUnavailable')));
    if (p.version) intro.append(el('p', 'detail-version', `${t('releaseLabel')}: ${p.version}`));
    if (p.updatedAt) intro.append(el('p', 'detail-version', `${t('updatedDate')}: ${p.updatedAt}`));
    if (p.languages?.length) intro.append(el('p', 'detail-version', `${t('appLanguages')}: ${p.languages.join(', ')}`));
    if (p.licenseType) intro.append(el('p', 'detail-version', `${t('distribution')}: ${t(`license_${p.licenseType}`)}`));
    if (p.price?.amount != null && p.price?.currency) intro.append(el('p', 'detail-version', new Intl.NumberFormat(currentLanguage, { style: 'currency', currency: p.price.currency }).format(p.price.amount)));
    if (p.contentDraft) intro.append(el('p', 'detail-note', t('draftNotice')));
    const media = el('section', 'detail-gallery');
    media.setAttribute('aria-label', t('gallery'));
    const sources = [...new Set([p.screenshot, ...(p.gallery || []).map(entry => entry.src || entry)].filter(Boolean))];
    let selected = 0;
    const showImage = () => {
      const current = sources[selected];
      media.querySelector('.catalog-image')?.remove();
      media.prepend(image(current, t('screenshot', { title: p.title })));
      const counter = media.querySelector('.gallery-counter');
      if (counter) counter.textContent = `${selected + 1} / ${sources.length}`;
    };
    if (sources.length > 1) {
      const controls = el('div', 'gallery-controls');
      const previous = action('', 'chevron-left', () => { selected = (selected - 1 + sources.length) % sources.length; showImage(); });
      const next = action('', 'chevron-right', () => { selected = (selected + 1) % sources.length; showImage(); });
      previous.setAttribute('aria-label', t('galleryPrevious'));
      next.setAttribute('aria-label', t('galleryNext'));
      controls.append(previous, el('span', 'gallery-counter'), next);
      media.append(controls);
    }
    if (sources.length) showImage();
    const content = el('div', 'detail-reading');
    const facts = el('section', 'detail-facts');
    facts.append(el('h3', null, t('features')));
    const list = el('ul');
    (p.features || []).forEach(feature => list.append(el('li', null, feature)));
    facts.append(list);
    content.append(facts);
    (p.sections || []).forEach(([title, text], index) => {
      const section = el('section', `detail-section detail-section-${index % 2}`);
      section.append(el('span', 'section-number', String(index + 1).padStart(2, '0')), el('h3', null, title), el('p', null, text));
      content.append(section);
    });
    if (p.id === 'cookbook' || (p.downloadAvailable !== false && p.installSteps?.length)) {
      const help = el('details', 'detail-help');
      help.append(el('summary', null, t('requirementsTitle')));
      if (p.id === 'cookbook') help.append(el('p', null, t('cookbookInstall')), el('p', null, t('dllHelp')), link(t('runtime'), 'https://aka.ms/vc14/vc_redist.x64.exe', 'external-link'));
      else {
        const steps = el('ol');
        p.installSteps.forEach(step => steps.append(el('li', null, step)));
        help.append(steps);
      }
      content.append(help);
    }
    const actions = el('section', 'detail-feedback');
    actions.append(link(t('updatesProjectButton'), buildUpdatesLink(p), 'bell'), link(t('feedbackProjectButton'), buildFeedbackLink(p), 'message-square'), action(t('reviewsButton', { count: getPublishedReviewsForProject(p).length }), 'messages-square', () => openProjectReviews(p)), action(t('shareProgram'), 'send', () => openEmailPreview(p)), action(t('ratingButton'), 'star', () => openProjectRating(p)));
    content.append(actions);
    detailBody.replaceChildren(intro, media, content);
    detailBody.scrollTop = previousScroll;
    paintIcons();
  };

  const open = (id, updateHistory = true) => {
    const p = projects.find(item => item.id === id);
    if (!p) return;
    if (!dialog.open) returnFocus = document.activeElement;
    activeId = id;
    renderDetails(p);
    if (!dialog.open) {
      dialog.showModal();
      detailBody.scrollTop = 0;
      document.body.classList.add('catalog-open');
      document.querySelector('#closeProgramDialog').focus();
    }
    if (updateHistory && location.hash !== `#${id}`) {
      history.pushState({ catalogDetail: id }, '', `#${id}`);
      openedFromHistory = true;
    }
  };
  const syncHash = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    if (projects.some(p => p.id === id)) {
      if (!dialog.open || activeId !== id) open(id, false);
    } else if (dialog.open) {
      closingFromNavigation = true;
      dialog.close();
    }
  };

  document.querySelector('#closeProgramDialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('cancel', event => {
    const child = dialog.querySelector('.modal.is-open');
    if (child) { event.preventDefault(); closeModal(child); }
  });
  dialog.addEventListener('close', () => {
    dialog.querySelectorAll('.modal.is-open').forEach(closeModal);
    document.body.classList.remove('catalog-open');
    if (!closingFromNavigation && location.hash === `#${activeId}`) {
      if (openedFromHistory && history.state?.catalogDetail) history.back();
      else history.replaceState(null, '', '#projects');
    }
    closingFromNavigation = false;
    openedFromHistory = false;
    const focus = returnFocus?.isConnected ? returnFocus : document.querySelector(`[data-detail-for="${activeId}"]`);
    focus?.focus({ preventScroll: true });
    activeId = null;
  });
  // Legacy review/share/rating dialogs must be inside the native modal's top layer.
  document.querySelectorAll('.modal:not(#aboutModal)').forEach(modal => dialog.append(modal));
  detailLanguage.addEventListener('change', () => document.querySelector(`[data-lang="${detailLanguage.value}"]`).click());
  document.querySelector('#clearCatalogSearch').addEventListener('click', () => { search.value = ''; renderList(); search.focus(); });
  search.addEventListener('input', renderList);
  document.querySelectorAll('[data-catalog-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.catalogFilter;
    document.querySelectorAll('[data-catalog-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    renderList();
  }));
  window.addEventListener('popstate', syncHash);
  window.addEventListener('hashchange', syncHash);
  return {
    render(data) {
      projects = data.filter(p => p.status === 'published').sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
      rebuildIndex();
      renderList();
      if (activeId && dialog.open) renderDetails(projects.find(p => p.id === activeId));
      else syncHash();
    },
    translate() {
      search.placeholder = t('searchPlaceholder');
      document.querySelector('#clearCatalogSearch').setAttribute('aria-label', t('clearSearch'));
      detailLanguage.setAttribute('aria-label', t('language'));
      document.querySelector('#closeProgramDialog').title = t('closeLabel');
      document.querySelector('.catalog-filters').setAttribute('aria-label', t('features'));
      paintIcons();
    }
  };
})();
