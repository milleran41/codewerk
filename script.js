const projectsGrid = document.querySelector("#projectsGrid");
const year = document.querySelector("#year");
const modalOpenButtons = document.querySelectorAll("[data-modal-open]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const emailForm = document.querySelector("#emailForm");
const userEmail = document.querySelector("#userEmail");
const emailStatus = document.querySelector("#emailStatus");
const desktopEmailStorageKey = "codewerkDesktopEmail";

year.textContent = new Date().getFullYear();

// Локальная копия нужна только для открытия index.html двойным кликом.
// На GitHub Pages данные загружаются из data/projects.json.
const localProjectsFallback = [
  {
    id: "cookbook",
    title: "Taste & Trace / Кулинарная книга",
    status: "published",
    description:
      "Windows-программа для ведения личной кулинарной книги: рецепты, категории, заметки, фотографии и детали приготовления в одном месте.",
    features: [
      "Личная база рецептов",
      "Категории, заметки и фотографии",
      "Хранение деталей приготовления",
      "Портативная Windows-сборка",
      "Проект подготовлен для дальнейшего развития"
    ],
    screenshot: "assets/screenshots/cookbook.png",
    githubUrl: "https://github.com/milleran41/taste-and-trace-download",
    downloadUrl: "https://github.com/milleran41/taste-and-trace-download/releases/download/v0.0.0/Taste.Trace-Portable-0.0.0-x64.exe",
    qrImage: "assets/qr/cookbook.png",
    qrTarget: "https://milleran41.github.io/codewerk/#cookbook"
  },
  {
    id: "timer",
    title: "Timer",
    status: "published",
    description:
      "Компактный настольный таймер для Windows с круговым индикатором прогресса, звуковыми уведомлениями и плавающим окном поверх остальных окон.",
    features: [
      "Круговой индикатор прогресса",
      "Звуковые уведомления",
      "Плавающее окно always-on-top",
      "Настройка времени двойным кликом",
      "Готовый Windows .exe без установки"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/timer/main/screenshot.png",
    githubUrl: "https://github.com/milleran41/timer",
    downloadUrl: "https://github.com/milleran41/timer/raw/main/dist/timer.exe",
    qrImage: "assets/qr/timer.png",
    qrTarget: "https://milleran41.github.io/codewerk/#timer"
  },
  {
    id: "mixlab",
    title: "MixLab",
    status: "published",
    description:
      "Офлайн-инструмент для художников, дизайнеров и мастеров: выбор цвета с изображения и расчёт рецепта смешивания реальных красок по RYB-модели.",
    features: [
      "Выбор цвета с изображения",
      "Пипетка и 10x увеличитель",
      "Рецепты смешивания пигментов",
      "Ручной миксер цветов",
      "12 языков интерфейса"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/MixLab/main/src/assets/screenshot.png",
    githubUrl: "https://github.com/milleran41/MixLab",
    downloadUrl: "https://github.com/milleran41/MixLab/raw/main/MixLab.exe",
    qrImage: "assets/qr/mixlab.png",
    qrTarget: "https://milleran41.github.io/codewerk/#mixlab"
  },
  {
    id: "calendar-germany",
    title: "Kalender Deutschland",
    status: "published",
    description:
      "Chrome-расширение с немецким календарём, праздниками по федеральным землям, интерактивной картой Германии и историческим разделом.",
    features: [
      "Календарь Германии с национальными и региональными праздниками",
      "Выбор федеральной земли",
      "Интерактивная карта Германии",
      "Исторический раздел с 16 периодами",
      "Многоязычные исторические тексты"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/kalender-deutschland/main/assets/screenshots/calendar.png",
    githubUrl: "https://github.com/milleran41/kalender-deutschland",
    downloadUrl: "https://github.com/milleran41/kalender-deutschland/archive/refs/heads/main.zip",
    qrImage: "assets/qr/calendar-germany.png",
    qrTarget: "https://milleran41.github.io/codewerk/#calendar-germany",
    installTitle: "Как установить Kalender Deutschland в Chrome",
    installSteps: [
      "Скачайте архив и распакуйте его в удобную папку.",
      "После распаковки откройте папку kalender-deutschland-main. Внутри должен быть файл manifest.json.",
      "Откройте Chrome и перейдите по адресу chrome://extensions/.",
      "Включите переключатель Режим разработчика в правом верхнем углу.",
      "Нажмите Загрузить распакованное расширение.",
      "Выберите папку kalender-deutschland-main, а не сам ZIP-файл.",
      "После установки значок расширения появится в Chrome. Если вы меняете файлы, нажмите Reload на карточке расширения."
    ]
  },
  {
    id: "link-manager",
    title: "Linkora",
    status: "published",
    description:
      "Бесплатный офлайн-менеджер ссылок без рекламы, трекинга и облачного аккаунта. Ссылки сохраняются локально и остаются под вашим контролем.",
    features: [
      "Категории и избранное",
      "Drag and drop между категориями",
      "Скриншоты, описания и hover-превью",
      "Поиск, импорт и экспорт JSON",
      "Веб-версия и портативная Windows-версия"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/linkora/main/assets/linkora-preview.jpg",
    githubUrl: "https://github.com/milleran41/linkora",
    downloadUrl: "https://raw.githubusercontent.com/milleran41/linkora/main/downloads/Linkora.exe",
    qrImage: "assets/qr/link-manager.png",
    qrTarget: "https://milleran41.github.io/codewerk/#link-manager"
  },
  {
    id: "linkvault",
    title: "LinkVault",
    status: "published",
    description:
      "Простое браузерное приложение для сохранения ссылок, заметок и скриншотов в локальной таблице без установки, сервера и аккаунта.",
    features: [
      "Сохранение ссылок, описаний и скриншотов",
      "Страницы и категории",
      "Подсветка дубликатов",
      "Локальное хранение через IndexedDB",
      "JSON-резервные копии"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/MyLinks/main/assets/screenshot.png",
    githubUrl: "https://github.com/milleran41/MyLinks",
    downloadUrl: "https://github.com/milleran41/MyLinks/raw/main/LinkVault.zip",
    qrImage: "assets/qr/linkvault.png",
    qrTarget: "https://milleran41.github.io/codewerk/#linkvault"
  }
];

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const buildImage = (src, alt, fallbackText, className) => {
  const wrapper = createElement("div", className);

  if (!src) {
    wrapper.append(createElement("div", className === "qr-wrap" ? "qr-placeholder" : "image-placeholder", fallbackText));
    return wrapper;
  }

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    wrapper.replaceChildren(createElement("div", className === "qr-wrap" ? "qr-placeholder" : "image-placeholder", fallbackText));
  });

  wrapper.append(image);
  return wrapper;
};

const isDirectDownload = (url) => /\.(exe|zip|msi|dmg|pkg|appimage)(\?|#|$)/i.test(url);

const startDownload = (url) => {
  const frame = document.createElement("iframe");
  frame.hidden = true;
  frame.src = url;
  document.body.append(frame);

  window.setTimeout(() => {
    frame.remove();
  }, 60000);
};

const getProjectPageUrl = (projectId) => {
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = projectId;
  return pageUrl.toString();
};

const getQrTargetText = (project) => {
  if (project.qrTarget && !project.qrTarget.includes("REPOSITORY")) {
    return project.qrTarget;
  }

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    return getProjectPageUrl(project.id);
  }

  return `После публикации сайта: https://milleran41.github.io/ИМЯ-РЕПОЗИТОРИЯ/#${project.id}`;
};

const getRegisteredEmail = () => localStorage.getItem(desktopEmailStorageKey) || "";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const updateEmailStatus = () => {
  const email = getRegisteredEmail();
  if (userEmail) userEmail.value = email;
  if (!emailStatus) return;

  emailStatus.textContent = email
    ? `Сохранён email для отправки ссылок: ${email}`
    : "Email хранится только в вашем браузере.";
};

const focusEmailRegistration = () => {
  document.querySelector("#email-registration")?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => userEmail?.focus(), 450);
  if (emailStatus) {
    emailStatus.textContent = "Сначала введите свой email, чтобы отправить ссылку себе на компьютер.";
  }
};

const buildMailLink = (project, recipient) => {
  const projectUrl = getProjectPageUrl(project.id);
  const subject = `Открыть на компьютере: ${project.title}`;
  const body = [
    `Ссылка на программу "${project.title}":`,
    projectUrl,
    "",
    "Ссылка для скачивания:",
    project.downloadUrl || project.githubUrl,
    "",
    "Лучше открыть это письмо на компьютере, особенно если программа предназначена для Windows."
  ].join("\n");

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const openProjectInstructions = (project) => {
  const modal = document.querySelector("#projectInfoModal");
  const title = modal?.querySelector("#projectInfoModalTitle");
  const list = modal?.querySelector(".modal-list");

  if (!modal || !title || !list) return;

  title.textContent = project.installTitle || `Как установить ${project.title}`;
  list.replaceChildren();
  project.installSteps.forEach((step) => {
    list.append(createElement("li", null, step));
  });
  openModal("projectInfoModal");
};

const buildProjectCard = (project) => {
  const article = createElement("article", "project-card");
  article.id = project.id;

  const media = createElement("div", "project-media");
  media.append(
    buildImage(
      project.screenshot,
      `Скриншот программы ${project.title}`,
      "Скриншот будет добавлен позже",
      "screenshot-wrap"
    )
  );

  const content = createElement("div", "project-content");
  const topline = createElement("div", "project-topline");
  topline.append(createElement("span", "status", "Published"));

  const anchor = createElement("a", "anchor-link", `#${project.id}`);
  anchor.href = `#${project.id}`;
  anchor.setAttribute("aria-label", `Прямая ссылка на ${project.title}`);
  topline.append(anchor);

  const title = createElement("h3", null, project.title);
  const description = createElement("p", "project-description", project.description);

  const features = createElement("ul", "features");
  project.features.forEach((feature) => {
    features.append(createElement("li", null, feature));
  });

  const actions = createElement("div", "project-actions");
  const download = createElement("a", "button button-primary", "Скачать");
  download.href = project.downloadUrl || project.githubUrl;
  download.rel = "noopener";

  if (project.downloadUrl && isDirectDownload(project.downloadUrl)) {
    download.setAttribute("download", "");
    download.addEventListener("click", (event) => {
      event.preventDefault();
      startDownload(project.downloadUrl);
    });
  } else {
    download.target = "_blank";
  }

  const github = createElement("a", "button button-ghost", "Открыть на GitHub");
  github.href = project.githubUrl;
  github.target = "_blank";
  github.rel = "noopener";

  actions.append(download, github);

  if (project.installSteps?.length) {
    const install = createElement("button", "button button-ghost", "Как установить");
    install.type = "button";
    install.addEventListener("click", () => openProjectInstructions(project));
    actions.append(install);
  }

  const qrBlock = createElement("div", "qr-block");
  qrBlock.append(
    buildImage(project.qrImage, `QR-код для ${project.title}`, "QR-код будет добавлен позже", "qr-wrap")
  );

  const qrText = createElement("p", "qr-text");
  qrText.textContent = `QR-код открывает карточку программы: ${getQrTargetText(project)}`;
  qrBlock.append(qrText);

  const sendToDesktop = createElement("button", "button button-ghost send-desktop", "Открыть на компьютере");
  sendToDesktop.type = "button";
  sendToDesktop.setAttribute("aria-label", `Отправить ссылку на ${project.title} себе по email`);
  sendToDesktop.addEventListener("click", (event) => {
    event.preventDefault();
    const recipient = getRegisteredEmail();
    if (!isValidEmail(recipient)) {
      focusEmailRegistration();
      return;
    }

    window.location.href = buildMailLink(project, recipient);
  });

  content.append(topline, title, description, features, actions, qrBlock, sendToDesktop);
  article.append(media, content);

  return article;
};

const renderProjects = (projects) => {
  const publishedProjects = projects.filter((project) => project.status === "published");
  projectsGrid.replaceChildren();

  if (!publishedProjects.length) {
    projectsGrid.append(createElement("p", "noscript", "Пока нет опубликованных проектов для отображения."));
    return;
  }

  publishedProjects.forEach((project) => {
    projectsGrid.append(buildProjectCard(project));
  });

  if (window.location.hash) {
    requestAnimationFrame(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
};

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
};

const closeModal = (modal) => {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

modalOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modalOpen);
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    if (modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal.is-open").forEach(closeModal);
});

emailForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = userEmail?.value.trim() || "";

  if (!isValidEmail(email)) {
    if (emailStatus) emailStatus.textContent = "Проверьте email: похоже, в адресе есть ошибка.";
    userEmail?.focus();
    return;
  }

  localStorage.setItem(desktopEmailStorageKey, email);
  updateEmailStatus();
});

updateEmailStatus();

if (window.location.protocol === "file:") {
  renderProjects(localProjectsFallback);
} else {
  fetch("data/projects.json")
    .then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить projects.json");
      return response.json();
    })
    .then(renderProjects)
    .catch(() => {
      projectsGrid.replaceChildren(
        createElement("p", "noscript", "Не удалось загрузить список проектов. Проверьте файл data/projects.json.")
      );
    });
}
