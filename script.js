const projectsGrid = document.querySelector("#projectsGrid");
const videosSection = document.querySelector("#videos");
const videosGrid = document.querySelector("#videosGrid");
const videosDisclosure = document.querySelector(".videos-disclosure");
const year = document.querySelector("#year");
const modalOpenButtons = document.querySelectorAll("[data-modal-open]");
const modalCloseButtons = document.querySelectorAll("[data-modal-close]");
const emailPreviewText = document.querySelector("#emailPreviewText");
const copyEmailText = document.querySelector("#copyEmailText");
const downloadLinkFile = document.querySelector("#downloadLinkFile");
const shareLinkFile = document.querySelector("#shareLinkFile");
const projectReviewsTitle = document.querySelector("#projectReviewsTitle");
const projectReviewsSummary = document.querySelector(".reviews-modal-summary");
const projectReviewsList = document.querySelector(".modal-reviews-list");
const projectReviewsFeedback = document.querySelector("#projectReviewsFeedback");
const projectRatingTitle = document.querySelector("#projectRatingTitle");
const ratingChoice = document.querySelector(".rating-choice");
const ratingStatus = document.querySelector(".rating-status");
const ratingStats = document.querySelector(".rating-stats");
const ratingTotal = document.querySelector(".rating-total");
const languageButtons = document.querySelectorAll("[data-lang]");
const languageMenu = document.querySelector(".language-menu");
const currentLanguageLabel = document.querySelector("#currentLanguageLabel");
const languageStorageKey = "codewerkLanguage";
let currentLinkFile = null;
let currentProjects = [];
let currentReviews = [];
let currentRatings = [];

const supportedLanguages = ["ru", "en", "de"];
const languageLabels = {
  ru: "RU",
  en: "EN",
  de: "DE"
};
const updatesFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScnthignFLG9JhcR46n9A1GEGJGb1SC7WE9Va_hX8w3GsRFuQ/viewform";
const updatesFormProgramEntry = "entry.871189447";
const downloadRequestFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScBh9m9Ct9oWuyEBlGO4R7kI0Yfl0RQ4fDCZvy56r7PCIdzlw/viewform";
const downloadRequestProgramEntry = "entry.881234180";
const feedbackFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScKZCufK_qzJg-ICKlOyYXG8z4KMNLlm7bK7qvIQGdZY-CHtw/viewform";
const feedbackProgramEntry = "entry.853632586";
const ratingSubmitUrl = "https://script.google.com/macros/s/AKfycbxVmeb0logeKWgl7Lw8F7wDQvLyVtvgQ82GqSx15EFuF7Rmc2iBLLNSxEfL_Ke-sM0L/exec";
const ratingStoragePrefix = "codewerkRatingScore:";
const updatesProgramNames = {
  cookbook: "Taste & Trace / Кулинарная книга",
  timer: "Timer",
  mixlab: "MixLab",
  "calendar-germany": "Kalender Deutschland",
  "link-manager": "Linkora",
  linkvault: "LinkVault"
};
const browserLanguage = (navigator.language || "ru").slice(0, 2);
let currentLanguage =
  localStorage.getItem(languageStorageKey) ||
  (supportedLanguages.includes(browserLanguage) ? browserLanguage : "ru");

const ui = {
  ru: {
    navAbout: "Обо мне",
    navSupport: "Поддержать",
    navContacts: "Контакты",
    heroEyebrow: "GitHub Pages portfolio",
    heroSubtitle: "Useful apps, tools and digital projects by Andreas Miller",
    heroWindows: "Программы для Windows 10 и 11",
    requirements: "Так помечены приложения, которые работают прямо в браузере на компьютерах и мобильных устройствах: Windows, macOS и Linux.",
    emailEyebrow: "Send to desktop",
    emailTitle: "Email для ссылок",
    emailText:
      "Введите свой email один раз. Когда вы нажмёте “Открыть на компьютере”, сайт подготовит письмо на этот же адрес со ссылкой на выбранную программу.",
    emailLabel: "Ваш email",
    emailSave: "Сохранить",
    emailAutofillHint: "На телефоне браузер может предложить сохранённый Google-адрес над клавиатурой.",
    emailAutofillFocus: "Если браузер показывает сохранённые адреса, выберите нужный email из подсказки. Обычно она появляется над клавиатурой или под полем.",
    emailStatusDefault: "Email хранится только в вашем браузере.",
    emailStatusSaved: "Сохранён email для отправки ссылок: {email}",
    emailInvalid: "Проверьте email: похоже, в адресе есть ошибка.",
    emailRequired: "Сначала введите свой email, чтобы отправить ссылку себе на компьютер.",
    projectsEyebrow: "Published software",
    projectsTitle: "Мои программы",
    noProjects: "Пока нет опубликованных проектов для отображения.",
    loadError: "Не удалось загрузить список проектов. Проверьте файл data/projects.json.",
    videosEyebrow: "Video guides",
    videosTitle: "Видеообзоры",
    videosText: "Короткие YouTube-видео для программ CodeWerk: как они выглядят и как ими пользоваться.",
    videoCardEyebrow: "YouTube",
    videoDefaultText: "Короткий обзор программы и основных возможностей.",
    videoButton: "Смотреть видео",
    videosToggle: "Показать видео",
    reviewsEyebrow: "Reviews",
    reviewsTitle: "Отзывы",
    reviewsEmpty: "Пока опубликованных отзывов нет. Здесь будут показаны только отзывы, которые пользователь разрешил публиковать.",
    reviewsButton: "Отзывы ({count})",
    reviewsForTitle: "Отзывы: {title}",
    reviewsSummary: "{stars} {score} ({count})",
    reviewsSummaryEmpty: "Пока нет опубликованных отзывов для этой программы.",
    ratingEyebrow: "Rating",
    ratingTitle: "Оценки пользователей",
    ratingButton: "☆ ☆ ☆ ☆ ☆ Оценить",
    ratingForTitle: "Оценки: {title}",
    ratingSubmitHint: "Выберите количество звёзд.",
    ratingThanks: "Спасибо за оценку!",
    ratingAlreadySent: "Спасибо, оценка уже принята в этой вкладке.",
    ratingSavedToast: "Спасибо за оценку!",
    ratingTotal: "Всего оценок: {count}",
    ratingAria: "Оценить {title}",
    reviewProgramLabel: "Программа",
    reviewAnonymous: "Пользователь CodeWerk",
    closeButton: "Закрыть",
    updatesEyebrow: "Updates",
    updatesTitle: "Получать уведомления",
    updatesText:
      "Оставьте email в Google Form, чтобы получать уведомления о новых версиях и важных изменениях программ CodeWerk.",
    updatesButton: "Подписаться на обновления",
    updatesProjectButton: "Получать обновления",
    feedbackProjectButton: "Оставить отзыв",
    supportEyebrow: "Donate",
    supportTitle: "Поддержать разработчика",
    supportText: "Если мои программы оказались полезными, вы можете поддержать развитие проектов.",
    contactsEyebrow: "Contact",
    contactsTitle: "Контакты",
    footerText: "Static portfolio for GitHub Pages.",
    aboutTitle: "Коротко обо мне",
    aboutText:
      "Я создаю практичные программы и цифровые инструменты, которые помогают быстрее решать повседневные задачи: сохранять знания, работать с данными, управлять ссылками и упрощать рутину.",
    installEyebrow: "Installation",
    installTitleDefault: "Как установить",
    installTitlePrefix: "Как установить",
    emailModalEyebrow: "Send link",
    emailModalTitle: "Ссылка на компьютер",
    emailModalHelp:
      "На телефоне нажмите “Поделиться ссылкой” и выберите Gmail, почту или мессенджер. Можно также скопировать текст или сохранить TXT-файл, а на компьютере открыть ссылку Download.",
    copyText: "Скопировать текст",
    downloadTxt: "Скачать TXT",
    shareTxt: "Поделиться ссылкой",
    openGmail: "Открыть Gmail",
    openMail: "Системная почта",
    closeLabel: "Закрыть окно",
    backTopLabel: "Вернуться к началу страницы",
    published: "Published",
    directLink: "Прямая ссылка на {title}",
    screenshotAlt: "Скриншот программы {title}",
    screenshotFallback: "Скриншот будет добавлен позже",
    download: "Скачать",
    requestDownload: "Получить ссылку",
    install: "Как установить",
    openDesktop: "Открыть на компьютере",
    openDesktopAria: "Отправить ссылку на {title} себе по email",
    copied: "Скопировано",
    selected: "Выделено",
    txtDownloaded: "TXT скачан",
    sent: "Отправлено",
    textCopied: "Текст скопирован",
    failed: "Не удалось",
    projectPage: "Страница программы:",
    downloadLine: "Скачать:",
    requestDownloadLine: "Получить ссылку:",
    howToDownload: "Как скачать:",
    howToDownloadStep1: "Откройте этот файл на компьютере и используйте ссылку “Скачать” выше.",
    howToDownloadStep2: "Если ссылка не нажимается, скопируйте её в адресную строку браузера.",
    shareFileText: "Файл со ссылками для открытия на компьютере.",
    localQrHint: "После публикации сайта: https://milleran41.github.io/ИМЯ-РЕПОЗИТОРИЯ/#{id}"
  },
  en: {
    navAbout: "About",
    navSupport: "Support",
    navContacts: "Contacts",
    heroEyebrow: "GitHub Pages portfolio",
    heroSubtitle: "Useful apps, tools and digital projects by Andreas Miller",
    heroWindows: "Apps for Windows 10 and 11",
    requirements: "This marks apps that run directly in the browser on computers and mobile devices: Windows, macOS and Linux.",
    emailEyebrow: "Send to desktop",
    emailTitle: "Email for links",
    emailText:
      "Enter your email once. When you click “Open on computer”, the site prepares a message to the same address with a link to the selected app.",
    emailLabel: "Your email",
    emailSave: "Save",
    emailAutofillHint: "On a phone, the browser may suggest your saved Google email above the keyboard.",
    emailAutofillFocus: "If the browser shows saved addresses, choose the right email from the suggestion. It usually appears above the keyboard or below the field.",
    emailStatusDefault: "The email is stored only in your browser.",
    emailStatusSaved: "Saved email for sending links: {email}",
    emailInvalid: "Please check the email address. Something looks wrong.",
    emailRequired: "Enter your email first to send the link to your computer.",
    projectsEyebrow: "Published software",
    projectsTitle: "My programs",
    noProjects: "There are no published projects to show yet.",
    loadError: "Could not load the project list. Please check data/projects.json.",
    videosEyebrow: "Video guides",
    videosTitle: "Video guides",
    videosText: "Short YouTube videos for CodeWerk programs: how they look and how to use them.",
    videoCardEyebrow: "YouTube",
    videoDefaultText: "A short overview of the program and its main features.",
    videoButton: "Watch video",
    videosToggle: "Show videos",
    reviewsEyebrow: "Reviews",
    reviewsTitle: "Reviews",
    reviewsEmpty: "There are no published reviews yet. Only reviews approved by the user will appear here.",
    reviewsButton: "Reviews ({count})",
    reviewsForTitle: "Reviews: {title}",
    reviewsSummary: "{stars} {score} ({count})",
    reviewsSummaryEmpty: "There are no published reviews for this program yet.",
    ratingEyebrow: "Rating",
    ratingTitle: "User ratings",
    ratingButton: "☆ ☆ ☆ ☆ ☆ Rate",
    ratingForTitle: "Ratings: {title}",
    ratingSubmitHint: "Choose a star rating.",
    ratingThanks: "Thank you for rating!",
    ratingAlreadySent: "Thank you, this tab has already sent a rating.",
    ratingSavedToast: "Thank you for rating!",
    ratingTotal: "Total ratings: {count}",
    ratingAria: "Rate {title}",
    reviewProgramLabel: "Program",
    reviewAnonymous: "CodeWerk user",
    closeButton: "Close",
    updatesEyebrow: "Updates",
    updatesTitle: "Get update notifications",
    updatesText:
      "Leave your email in the Google Form to receive notifications about new versions and important CodeWerk changes.",
    updatesButton: "Subscribe to updates",
    updatesProjectButton: "Get updates",
    feedbackProjectButton: "Leave feedback",
    supportEyebrow: "Donate",
    supportTitle: "Support the developer",
    supportText: "If my programs are useful to you, you can support the development of these projects.",
    contactsEyebrow: "Contact",
    contactsTitle: "Contacts",
    footerText: "Static portfolio for GitHub Pages.",
    aboutTitle: "About me",
    aboutText:
      "I create practical programs and digital tools that help solve everyday tasks faster: saving knowledge, working with data, managing links and simplifying routine work.",
    installEyebrow: "Installation",
    installTitleDefault: "How to install",
    installTitlePrefix: "How to install",
    emailModalEyebrow: "Send link",
    emailModalTitle: "Link for your computer",
    emailModalHelp:
      "On your phone, tap “Share link” and choose Gmail, mail, or a messenger. You can also copy the text or save a TXT file, then open the Download link on your computer.",
    copyText: "Copy text",
    downloadTxt: "Download TXT",
    shareTxt: "Share link",
    openGmail: "Open Gmail",
    openMail: "System mail",
    closeLabel: "Close window",
    backTopLabel: "Back to top",
    published: "Published",
    directLink: "Direct link to {title}",
    screenshotAlt: "Screenshot of {title}",
    screenshotFallback: "Screenshot will be added later",
    download: "Download",
    requestDownload: "Get download link",
    install: "How to install",
    openDesktop: "Open on computer",
    openDesktopAria: "Send a link to {title} to your email",
    copied: "Copied",
    selected: "Selected",
    txtDownloaded: "TXT downloaded",
    sent: "Sent",
    textCopied: "Text copied",
    failed: "Failed",
    projectPage: "Project page:",
    downloadLine: "Download:",
    requestDownloadLine: "Get download link:",
    howToDownload: "How to download:",
    howToDownloadStep1: "Open this file on your computer and use the Download link above.",
    howToDownloadStep2: "If the link is not clickable, copy it and paste it into the browser address bar.",
    shareFileText: "File with links for opening on a computer.",
    localQrHint: "After publishing the site: https://milleran41.github.io/REPOSITORY-NAME/#{id}"
  },
  de: {
    navAbout: "Über mich",
    navSupport: "Unterstützen",
    navContacts: "Kontakt",
    heroEyebrow: "GitHub Pages Portfolio",
    heroSubtitle: "Useful apps, tools and digital projects by Andreas Miller",
    heroWindows: "Programme für Windows 10 und 11",
    requirements: "So sind Apps markiert, die direkt im Browser auf Computern und Mobilgeräten laufen: Windows, macOS und Linux.",
    emailEyebrow: "An den Computer senden",
    emailTitle: "E-Mail für Links",
    emailText:
      "Geben Sie Ihre E-Mail einmal ein. Wenn Sie “Auf dem Computer öffnen” klicken, bereitet die Seite eine Nachricht an diese Adresse mit dem Link zur ausgewählten App vor.",
    emailLabel: "Ihre E-Mail",
    emailSave: "Speichern",
    emailAutofillHint: "Auf dem Telefon kann der Browser Ihre gespeicherte Google-E-Mail über der Tastatur vorschlagen.",
    emailAutofillFocus: "Wenn der Browser gespeicherte Adressen zeigt, wählen Sie die passende E-Mail aus dem Vorschlag. Er erscheint meist über der Tastatur oder unter dem Feld.",
    emailStatusDefault: "Die E-Mail wird nur in Ihrem Browser gespeichert.",
    emailStatusSaved: "Gespeicherte E-Mail für Links: {email}",
    emailInvalid: "Bitte prüfen Sie die E-Mail-Adresse. Sie sieht nicht korrekt aus.",
    emailRequired: "Geben Sie zuerst Ihre E-Mail ein, um den Link an Ihren Computer zu senden.",
    projectsEyebrow: "Veröffentlichte Software",
    projectsTitle: "Meine Programme",
    noProjects: "Es gibt noch keine veröffentlichten Projekte zum Anzeigen.",
    loadError: "Die Projektliste konnte nicht geladen werden. Bitte prüfen Sie data/projects.json.",
    videosEyebrow: "Video guides",
    videosTitle: "Videoübersichten",
    videosText: "Kurze YouTube-Videos zu CodeWerk-Programmen: wie sie aussehen und wie man sie benutzt.",
    videoCardEyebrow: "YouTube",
    videoDefaultText: "Ein kurzer Überblick über das Programm und die wichtigsten Funktionen.",
    videoButton: "Video ansehen",
    videosToggle: "Videos anzeigen",
    reviewsEyebrow: "Bewertungen",
    reviewsTitle: "Bewertungen",
    reviewsEmpty: "Es gibt noch keine veröffentlichten Bewertungen. Hier erscheinen nur Bewertungen, die zur Veröffentlichung freigegeben wurden.",
    reviewsButton: "Bewertungen ({count})",
    reviewsForTitle: "Bewertungen: {title}",
    reviewsSummary: "{stars} {score} ({count})",
    reviewsSummaryEmpty: "Für dieses Programm gibt es noch keine veröffentlichten Bewertungen.",
    ratingEyebrow: "Rating",
    ratingTitle: "Nutzerbewertungen",
    ratingButton: "☆ ☆ ☆ ☆ ☆ Bewerten",
    ratingForTitle: "Bewertungen: {title}",
    ratingSubmitHint: "Wählen Sie die Anzahl der Sterne.",
    ratingThanks: "Danke für Ihre Bewertung!",
    ratingAlreadySent: "Danke, in diesem Tab wurde bereits bewertet.",
    ratingSavedToast: "Danke für Ihre Bewertung!",
    ratingTotal: "Bewertungen insgesamt: {count}",
    ratingAria: "{title} bewerten",
    reviewProgramLabel: "Programm",
    reviewAnonymous: "CodeWerk-Nutzer",
    closeButton: "Schließen",
    updatesEyebrow: "Updates",
    updatesTitle: "Update-Benachrichtigungen",
    updatesText:
      "Hinterlassen Sie Ihre E-Mail im Google-Formular, um Benachrichtigungen über neue Versionen und wichtige Änderungen bei CodeWerk zu erhalten.",
    updatesButton: "Updates abonnieren",
    updatesProjectButton: "Updates erhalten",
    feedbackProjectButton: "Feedback geben",
    supportEyebrow: "Spenden",
    supportTitle: "Entwickler unterstützen",
    supportText: "Wenn meine Programme nützlich sind, können Sie die Weiterentwicklung unterstützen.",
    contactsEyebrow: "Kontakt",
    contactsTitle: "Kontakt",
    footerText: "Statisches Portfolio für GitHub Pages.",
    aboutTitle: "Kurz über mich",
    aboutText:
      "Ich entwickle praktische Programme und digitale Werkzeuge, die alltägliche Aufgaben schneller lösen: Wissen speichern, mit Daten arbeiten, Links verwalten und Routinearbeit vereinfachen.",
    installEyebrow: "Installation",
    installTitleDefault: "Installation",
    installTitlePrefix: "Installation von",
    emailModalEyebrow: "Link senden",
    emailModalTitle: "Link für den Computer",
    emailModalHelp:
      "Tippen Sie am Telefon auf “Link teilen” und wählen Sie Gmail, Mail oder einen Messenger. Sie können den Text auch kopieren oder als TXT speichern und am Computer den Download-Link öffnen.",
    copyText: "Text kopieren",
    downloadTxt: "TXT herunterladen",
    shareTxt: "Link teilen",
    openGmail: "Gmail öffnen",
    openMail: "System-Mail",
    closeLabel: "Fenster schließen",
    backTopLabel: "Zurück zum Anfang",
    published: "Veröffentlicht",
    directLink: "Direkter Link zu {title}",
    screenshotAlt: "Screenshot von {title}",
    screenshotFallback: "Screenshot wird später hinzugefügt",
    download: "Herunterladen",
    requestDownload: "Download-Link erhalten",
    install: "Installation",
    openDesktop: "Auf dem Computer öffnen",
    openDesktopAria: "Link zu {title} per E-Mail senden",
    copied: "Kopiert",
    selected: "Markiert",
    txtDownloaded: "TXT heruntergeladen",
    sent: "Gesendet",
    textCopied: "Text kopiert",
    failed: "Fehlgeschlagen",
    projectPage: "Projektseite:",
    downloadLine: "Download:",
    requestDownloadLine: "Download-Link erhalten:",
    howToDownload: "So laden Sie herunter:",
    howToDownloadStep1: "Öffnen Sie diese Datei auf dem Computer und verwenden Sie den Download-Link oben.",
    howToDownloadStep2: "Wenn der Link nicht klickbar ist, kopieren Sie ihn in die Adressleiste des Browsers.",
    shareFileText: "Datei mit Links zum Öffnen auf dem Computer.",
    localQrHint: "Nach der Veröffentlichung: https://milleran41.github.io/REPOSITORY-NAME/#{id}"
  }
};

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
    downloadMode: "request",
    downloadUrl: "https://github.com/milleran41/taste-and-trace-download/releases/download/v0.0.0/Taste.Trace-Portable-0.0.0-x64.exe",
    qrImage: "assets/qr/cookbook.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#cookbook"
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
    downloadMode: "direct",
    downloadUrl: "https://github.com/milleran41/timer/raw/main/dist/timer.exe",
    qrImage: "assets/qr/timer.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#timer",
    videoUrl: "https://www.youtube.com/watch?v=ZANqTWq2ok0",
    videoDescription: "A short FineTimer overview: floating window, start, pause, and time adjustment."
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
    downloadMode: "request",
    downloadUrl: "https://github.com/milleran41/MixLab/raw/main/MixLab.exe",
    qrImage: "assets/qr/mixlab.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#mixlab"
  },
  {
    id: "calendar-germany",
    title: "Kalender Deutschland",
    status: "published",
    description:
      "Chrome-расширение с немецким календарём, праздниками по федеральным землям, интерактивной картой Германии и историческим разделом.",
    highlightTerms: ["Chrome-расширение"],
    features: [
      "Календарь Германии с национальными и региональными праздниками",
      "Выбор федеральной земли",
      "Интерактивная карта Германии",
      "Исторический раздел с 16 периодами",
      "Многоязычные исторические тексты"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/kalender-deutschland/main/assets/screenshots/calendar.png?v=20260712-2",
    githubUrl: "https://github.com/milleran41/kalender-deutschland",
    downloadMode: "direct",
    downloadUrl: "https://github.com/milleran41/kalender-deutschland/archive/refs/heads/main.zip",
    qrImage: "assets/qr/calendar-germany.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#calendar-germany",
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
    downloadMode: "direct",
    downloadUrl: "https://raw.githubusercontent.com/milleran41/linkora/main/downloads/Linkora.exe",
    qrImage: "assets/qr/link-manager.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#link-manager"
  },
  {
    id: "linkvault",
    title: "LinkVault",
    status: "published",
    description:
      "Простое браузерное приложение для сохранения ссылок, заметок и скриншотов в локальной таблице без установки, сервера и аккаунта.",
    crossPlatform: true,
    platform: "Windows, macOS, Linux — современный браузер",
    features: [
      "Сохранение ссылок, описаний и скриншотов",
      "Страницы и категории",
      "Подсветка дубликатов",
      "Локальное хранение через IndexedDB",
      "JSON-резервные копии"
    ],
    screenshot: "https://raw.githubusercontent.com/milleran41/MyLinks/main/assets/screenshot.png",
    githubUrl: "https://github.com/milleran41/MyLinks",
    downloadMode: "direct",
    downloadUrl: "https://github.com/milleran41/MyLinks/raw/main/LinkVault.zip",
    qrImage: "assets/qr/linkvault.png",
    qrTarget: "https://milleran41.github.io/codewerk/?v=20260709-4#linkvault"
  }
];

const localReviewsFallback = [];
const localRatingsFallback = [];

const projectTranslations = {
  en: {
    cookbook: {
      title: "Taste & Trace / Cookbook",
      description:
        "A Windows app for keeping a personal cookbook: recipes, categories, notes, photos and cooking details in one place.",
      features: [
        "Personal recipe database",
        "Categories, notes and photos",
        "Cooking details storage",
        "Portable Windows build",
        "Prepared for future development"
      ]
    },
    timer: {
      title: "Timer",
      description:
        "A compact desktop timer for Windows with a circular progress indicator, sound notifications and a floating always-on-top window.",
      features: [
        "Circular progress indicator",
        "Sound notifications",
        "Always-on-top floating window",
        "Double-click time adjustment",
        "Ready-to-use Windows .exe without installation"
      ]
    },
    mixlab: {
      title: "MixLab",
      description:
        "An offline tool for artists, designers and makers: pick a color from an image and calculate a real-paint mixing recipe using the RYB model.",
      features: [
        "Pick colors from an image",
        "Eyedropper and 10x magnifier",
        "Pigment mixing recipes",
        "Manual color mixer",
        "Interface in 12 languages"
      ]
    },
    "calendar-germany": {
      title: "Kalender Deutschland",
      description:
        "A Chrome extension with a German calendar, federal-state holidays, an interactive Germany map and a historical section.",
      highlightTerms: ["Chrome extension"],
      features: [
        "German calendar with national and regional holidays",
        "Federal state selection",
        "Interactive map of Germany",
        "Historical section with 16 periods",
        "Multilingual historical texts"
      ],
      installTitle: "How to install Kalender Deutschland in Chrome",
      installSteps: [
        "Download the archive and unpack it into a convenient folder.",
        "Open the unpacked kalender-deutschland-main folder. It must contain manifest.json.",
        "Open Chrome and go to chrome://extensions/.",
        "Enable Developer mode in the top right corner.",
        "Click Load unpacked.",
        "Select the kalender-deutschland-main folder, not the ZIP file.",
        "The extension icon will appear in Chrome. If you change files, click Reload on the extension card."
      ]
    },
    "link-manager": {
      title: "Linkora",
      description:
        "A free offline link manager without ads, tracking or a cloud account. Your links are stored locally and remain under your control.",
      features: [
        "Categories and favorites",
        "Drag and drop between categories",
        "Screenshots, descriptions and hover previews",
        "Search, JSON import and export",
        "Web version and portable Windows version"
      ]
    },
    linkvault: {
      title: "LinkVault",
      description:
        "A simple browser app for saving links, notes and screenshots in a local table without installation, server or account.",
      platform: "Windows, macOS, Linux — modern browser",
      features: [
        "Save links, descriptions and screenshots",
        "Pages and categories",
        "Duplicate highlighting",
        "Local storage with IndexedDB",
        "JSON backups"
      ]
    },
    transport: {
      title: "Transport",
      description: "Add the README description when the project is published on GitHub.",
      features: []
    }
  },
  de: {
    cookbook: {
      title: "Taste & Trace / Kochbuch",
      description:
        "Eine Windows-App für ein persönliches Kochbuch: Rezepte, Kategorien, Notizen, Fotos und Zubereitungsdetails an einem Ort.",
      features: [
        "Persönliche Rezeptdatenbank",
        "Kategorien, Notizen und Fotos",
        "Speicherung von Zubereitungsdetails",
        "Portable Windows-Version",
        "Für die weitere Entwicklung vorbereitet"
      ]
    },
    timer: {
      title: "Timer",
      description:
        "Ein kompakter Desktop-Timer für Windows mit rundem Fortschrittsindikator, akustischen Benachrichtigungen und einem schwebenden Always-on-top-Fenster.",
      features: [
        "Runder Fortschrittsindikator",
        "Akustische Benachrichtigungen",
        "Schwebendes Always-on-top-Fenster",
        "Zeiteinstellung per Doppelklick",
        "Fertige Windows-.exe ohne Installation"
      ]
    },
    mixlab: {
      title: "MixLab",
      description:
        "Ein Offline-Werkzeug für Künstler, Designer und Handwerker: Farbe aus einem Bild auswählen und ein Mischrezept für echte Farben nach dem RYB-Modell berechnen.",
      features: [
        "Farben aus einem Bild auswählen",
        "Pipette und 10-fache Lupe",
        "Mischrezepte für Pigmente",
        "Manueller Farbmischer",
        "Oberfläche in 12 Sprachen"
      ]
    },
    "calendar-germany": {
      title: "Kalender Deutschland",
      description:
        "Eine Chrome-Erweiterung mit deutschem Kalender, Feiertagen nach Bundesländern, interaktiver Deutschlandkarte und historischem Bereich.",
      highlightTerms: ["Chrome-Erweiterung"],
      features: [
        "Deutschlandkalender mit nationalen und regionalen Feiertagen",
        "Auswahl des Bundeslandes",
        "Interaktive Deutschlandkarte",
        "Historischer Bereich mit 16 Zeitperioden",
        "Mehrsprachige historische Texte"
      ],
      installTitle: "Installation von Kalender Deutschland in Chrome",
      installSteps: [
        "Laden Sie das Archiv herunter und entpacken Sie es in einen passenden Ordner.",
        "Öffnen Sie den entpackten Ordner kalender-deutschland-main. Darin muss die Datei manifest.json liegen.",
        "Öffnen Sie Chrome und gehen Sie zu chrome://extensions/.",
        "Aktivieren Sie oben rechts den Entwicklermodus.",
        "Klicken Sie auf Entpackte Erweiterung laden.",
        "Wählen Sie den Ordner kalender-deutschland-main aus, nicht die ZIP-Datei.",
        "Das Erweiterungssymbol erscheint in Chrome. Wenn Sie Dateien ändern, klicken Sie auf der Erweiterungskarte auf Reload."
      ]
    },
    "link-manager": {
      title: "Linkora",
      description:
        "Ein kostenloser Offline-Linkmanager ohne Werbung, Tracking oder Cloud-Konto. Die Links werden lokal gespeichert und bleiben unter Ihrer Kontrolle.",
      features: [
        "Kategorien und Favoriten",
        "Drag and Drop zwischen Kategorien",
        "Screenshots, Beschreibungen und Hover-Vorschau",
        "Suche, JSON-Import und -Export",
        "Webversion und portable Windows-Version"
      ]
    },
    linkvault: {
      title: "LinkVault",
      description:
        "Eine einfache Browser-App zum Speichern von Links, Notizen und Screenshots in einer lokalen Tabelle ohne Installation, Server oder Konto.",
      platform: "Windows, macOS, Linux — moderner Browser",
      features: [
        "Links, Beschreibungen und Screenshots speichern",
        "Seiten und Kategorien",
        "Hervorhebung von Duplikaten",
        "Lokale Speicherung mit IndexedDB",
        "JSON-Sicherungen"
      ]
    },
    transport: {
      title: "Transport",
      description: "Fügen Sie die README-Beschreibung hinzu, sobald das Projekt auf GitHub veröffentlicht ist.",
      features: []
    }
  }
};

const formatText = (value, replacements = {}) =>
  Object.entries(replacements).reduce((text, [key, replacement]) => {
    return text.replaceAll(`{${key}}`, replacement);
  }, value || "");

const t = (key, replacements) => {
  const value = ui[currentLanguage]?.[key] || ui.ru[key] || key;
  return formatText(value, replacements);
};

const translateProject = (project) => {
  const copy = projectTranslations[currentLanguage]?.[project.id];
  if (!copy) return project;
  return { ...project, ...copy };
};

const applyStaticTranslations = () => {
  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (currentLanguageLabel) {
    currentLanguageLabel.textContent = languageLabels[currentLanguage] || currentLanguage.toUpperCase();
  }

};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

const buildImage = (src, alt, fallbackText, className) => {
  const wrapper = createElement("div", className);

  if (!src) {
    wrapper.append(createElement("div", "image-placeholder", fallbackText));
    return wrapper;
  }

  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    wrapper.replaceChildren(createElement("div", "image-placeholder", fallbackText));
  });

  wrapper.append(image);
  return wrapper;
};

const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.searchParams.has("v")) return parsed.searchParams.get("v");
    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
    return embedMatch?.[1] || "";
  } catch {
    return "";
  }
};

const buildVideoCard = (project) => {
  const article = createElement("article", "video-card");
  const videoId = getYouTubeId(project.videoUrl);

  const thumb = createElement("a", "video-thumb");
  thumb.href = project.videoUrl;
  thumb.target = "_blank";
  thumb.rel = "noopener";

  if (videoId) {
    const image = document.createElement("img");
    image.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    image.alt = `YouTube: ${project.title}`;
    image.loading = "lazy";
    thumb.append(image);
  } else {
    thumb.append(createElement("div", "image-placeholder", project.title));
  }

  thumb.append(createElement("span", "video-play", "▶"));

  const descriptionText = project.videoDescription || t("videoDefaultText");
  const description = createElement("p", "video-description", descriptionText);
  description.title = descriptionText;

  const content = createElement("div", "video-content");
  content.append(
    createElement("p", "eyebrow", t("videoCardEyebrow")),
    createElement("h3", null, project.title),
    description
  );

  const actions = createElement("div", "video-actions");
  const button = createElement("a", "button button-primary", t("videoButton"));
  button.href = project.videoUrl;
  button.target = "_blank";
  button.rel = "noopener";
  actions.append(button);
  content.append(actions);

  article.append(thumb, content);
  return article;
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

const buildEmailBody = (project) => {
  const projectUrl = getProjectPageUrl(project.id);
  const isRequestDownload = project.downloadMode === "request";
  return [
    project.title,
    "",
    t("projectPage"),
    projectUrl,
    "",
    isRequestDownload ? t("requestDownloadLine") : t("downloadLine"),
    isRequestDownload ? buildDownloadRequestLink(project) : project.downloadUrl || project.githubUrl,
    "",
    t("howToDownload"),
    t("howToDownloadStep1"),
    t("howToDownloadStep2")
  ].join("\n");
};

const appendHighlightedText = (element, text, terms = []) => {
  if (!terms.length) {
    element.textContent = text;
    return;
  }

  const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "gi");
  const parts = String(text || "").split(pattern);

  parts.forEach((part) => {
    if (!part) return;
    const isHighlight = terms.some((term) => part.toLowerCase() === term.toLowerCase());
    element.append(isHighlight ? createElement("span", "description-highlight", part) : document.createTextNode(part));
  });
};

const getSafeFileName = (title) =>
  `${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "codewerk"}-links.txt`;

const buildUpdatesLink = (project) => {
  const url = new URL(updatesFormUrl);
  const programName = updatesProgramNames[project.id] || project.title;
  url.searchParams.set("usp", "pp_url");
  url.searchParams.set(updatesFormProgramEntry, programName);
  return url.toString();
};

const buildDownloadRequestLink = (project) => {
  const url = new URL(downloadRequestFormUrl);
  const programName = updatesProgramNames[project.id] || project.title;
  url.searchParams.set("usp", "pp_url");
  url.searchParams.set(downloadRequestProgramEntry, programName);
  return url.toString();
};

const buildFeedbackLink = (project) => {
  const url = new URL(feedbackFormUrl);
  const programName = updatesProgramNames[project.id] || project.title;
  url.searchParams.set("usp", "pp_url");
  url.searchParams.set(feedbackProgramEntry, programName);
  return url.toString();
};

const openEmailPreview = (project) => {
  if (!emailPreviewText) return;

  const body = buildEmailBody(project);
  emailPreviewText.value = body;
  currentLinkFile = {
    name: getSafeFileName(project.title),
    title: `CodeWerk: ${project.title}`,
    text: `${body}\n`
  };
  copyEmailText.textContent = t("copyText");
  if (downloadLinkFile) downloadLinkFile.textContent = t("downloadTxt");
  if (shareLinkFile) shareLinkFile.textContent = t("shareTxt");
  openModal("emailPreviewModal");
};

const openProjectInstructions = (project) => {
  const modal = document.querySelector("#projectInfoModal");
  const title = modal?.querySelector("#projectInfoModalTitle");
  const list = modal?.querySelector(".modal-list");

  if (!modal || !title || !list) return;

  title.textContent = project.installTitle || `${t("installTitlePrefix")} ${project.title}`;
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
      t("screenshotAlt", { title: project.title }),
      t("screenshotFallback"),
      "screenshot-wrap"
    )
  );

  const content = createElement("div", "project-content");
  const topline = createElement("div", "project-topline");
  topline.append(createElement("span", "status", t("published")));

  const title = createElement("h3", null);
  title.append(document.createTextNode(project.title));
  if (project.crossPlatform) {
    const platformIcon = createElement("span", "platform-icon", "OS");
    platformIcon.title = project.platform || "Cross-platform";
    platformIcon.setAttribute("aria-label", project.platform || "Cross-platform");
    title.append(platformIcon);
  }
  const projectReviews = getPublishedReviewsForProject(project);
  if (projectReviews.length) {
    const ratingSummary = createElement("span", "project-rating", buildReviewsSummary(projectReviews));
    title.append(ratingSummary);
  }
  const description = createElement("p", "project-description");
  appendHighlightedText(description, project.description, project.highlightTerms);
  const platform = project.platform ? createElement("p", "project-platform", project.platform) : null;

  const features = createElement("ul", "features");
  project.features.forEach((feature) => {
    features.append(createElement("li", null, feature));
  });

  const mediaActions = createElement("div", "media-actions");
  const contentActions = createElement("div", "project-actions feedback-actions");
  const isRequestDownload = project.downloadMode === "request";
  const download = createElement("a", "button button-primary", isRequestDownload ? t("requestDownload") : t("download"));
  download.classList.add(isRequestDownload ? "request-download" : "direct-download");
  download.href = isRequestDownload ? buildDownloadRequestLink(project) : project.downloadUrl || project.githubUrl;
  download.rel = "noopener";

  if (isRequestDownload) {
    download.target = "_blank";
  } else if (project.downloadUrl && isDirectDownload(project.downloadUrl)) {
    download.setAttribute("download", "");
    download.addEventListener("click", (event) => {
      event.preventDefault();
      startDownload(project.downloadUrl);
    });
  } else {
    download.target = "_blank";
  }

  const updates = createElement("a", "button button-ghost", t("updatesProjectButton"));
  updates.href = buildUpdatesLink(project);
  updates.target = "_blank";
  updates.rel = "noopener";

  const feedback = createElement("a", "button button-ghost feedback-button", t("feedbackProjectButton"));
  feedback.href = buildFeedbackLink(project);
  feedback.target = "_blank";
  feedback.rel = "noopener";

  const reviews = createElement("button", "button button-ghost reviews-button", t("reviewsButton", { count: projectReviews.length }));
  reviews.type = "button";
  reviews.addEventListener("click", () => openProjectReviews(project));

  mediaActions.append(download, updates);
  contentActions.append(feedback, reviews);

  if (project.installSteps?.length) {
    const install = createElement("button", "button button-ghost", t("install"));
    install.type = "button";
    install.addEventListener("click", () => openProjectInstructions(project));
    contentActions.append(install);
  }

  const sendToDesktop = createElement("button", "button button-ghost send-desktop", t("openDesktop"));
  sendToDesktop.type = "button";
  sendToDesktop.setAttribute("aria-label", t("openDesktopAria", { title: project.title }));
  sendToDesktop.addEventListener("click", (event) => {
    event.preventDefault();
    openEmailPreview(project);
  });

  const quickRating = createElement("button", "rating-trigger", t("ratingButton"));
  quickRating.type = "button";
  quickRating.setAttribute("aria-label", t("ratingAria", { title: project.title }));
  quickRating.addEventListener("click", () => openProjectRating(project));
  quickRating.addEventListener("mouseenter", () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      openProjectRating(project);
    }
  });

  mediaActions.append(sendToDesktop, quickRating);

  media.append(mediaActions);
  content.append(topline, title, ...(platform ? [platform] : []), description, features, contentActions);
  article.append(media, content);

  return article;
};

const isReviewPublished = (review) =>
  review?.published === true || review?.status === "published";

const normalizeReviewKey = (value) => String(value || "").trim().toLowerCase();

const getProjectReviewKeys = (project) =>
  [project.id, project.title, updatesProgramNames[project.id]]
    .filter(Boolean)
    .map(normalizeReviewKey);

const getPublishedReviewsForProject = (project) => {
  const keys = getProjectReviewKeys(project);
  return currentReviews.filter((review) => {
    if (!isReviewPublished(review)) return false;
    const reviewKeys = [
      review.projectId,
      review.programId,
      review.program,
      review.title
    ].filter(Boolean).map(normalizeReviewKey);
    return reviewKeys.some((key) => keys.includes(key));
  });
};

const getReviewScore = (review) => {
  const raw = review.score ?? review.ratingValue ?? review.stars ?? review.rating;
  if (typeof raw === "number") return Math.max(1, Math.min(5, raw));

  const text = String(raw || "").trim().toLowerCase();
  const numeric = Number.parseFloat(text.replace(",", "."));
  if (Number.isFinite(numeric)) return Math.max(1, Math.min(5, numeric));

  if (text.includes("⭐⭐⭐⭐⭐")) return 5;
  if (text.includes("⭐⭐⭐⭐")) return 4;
  if (text.includes("⭐⭐⭐")) return 3;
  if (text.includes("⭐⭐")) return 2;
  if (text.includes("⭐")) return 1;
  if (text.includes("отлич") || text.includes("excellent") || text.includes("sehr gut")) return 5;
  if (text.includes("хорош") || text.includes("good") || text.includes("gut")) return 4;
  if (text.includes("норм") || text.includes("normal") || text.includes("okay")) return 3;
  if (text.includes("проблем") || text.includes("problem")) return 2;
  return null;
};

const getAverageScore = (reviews) => {
  const scores = reviews.map(getReviewScore).filter((score) => Number.isFinite(score));
  if (!scores.length) return null;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

const renderStars = (score) => {
  if (!Number.isFinite(score)) return "☆☆☆☆☆";
  const rounded = Math.round(score);
  return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
};

const getPublicReviewAuthor = (review) => {
  const author = String(review.author || review.name || "").trim();
  if (!author || author.includes("@")) return t("reviewAnonymous");
  return author;
};

const buildReviewCard = (review) => {
  const card = createElement("article", "review-card");
  const meta = createElement("div", "review-meta");
  const score = getReviewScore(review);
  const rating = createElement("strong", null, Number.isFinite(score) ? renderStars(score) : review.rating || "");
  if (rating.textContent) meta.append(rating);

  const text = createElement("p", "review-text", review.text || review.feedback || "");
  const author = createElement("p", "review-author", getPublicReviewAuthor(review));

  card.append(meta, text, author);
  return card;
};

const buildReviewsSummary = (reviews) => {
  const average = getAverageScore(reviews);
  if (!Number.isFinite(average)) return t("reviewsSummaryEmpty");
  return t("reviewsSummary", {
    stars: renderStars(average),
    score: average.toFixed(1),
    count: reviews.length
  });
};

const openProjectReviews = (project) => {
  const reviews = getPublishedReviewsForProject(project);
  if (!projectReviewsTitle || !projectReviewsSummary || !projectReviewsList || !projectReviewsFeedback) return;

  projectReviewsTitle.textContent = t("reviewsForTitle", { title: project.title });
  projectReviewsSummary.textContent = buildReviewsSummary(reviews);
  projectReviewsFeedback.href = buildFeedbackLink(project);
  projectReviewsList.replaceChildren();

  if (!reviews.length) {
    projectReviewsList.append(createElement("p", "reviews-empty", t("reviewsSummaryEmpty")));
  } else {
    reviews.forEach((review) => {
      projectReviewsList.append(buildReviewCard(review));
    });
  }

  openModal("projectReviewsModal");
};

const getRatingStorageKey = (project) => `${ratingStoragePrefix}${project.id}`;

const getSessionRating = (project) => {
  try {
    const score = Number(sessionStorage.getItem(getRatingStorageKey(project)));
    return Number.isFinite(score) && score >= 1 && score <= 5 ? Math.round(score) : null;
  } catch {
    return null;
  }
};

const hasRatedThisSession = (project) => {
  return Number.isFinite(getSessionRating(project));
};

const rememberRatingThisSession = (project, score) => {
  try {
    sessionStorage.setItem(getRatingStorageKey(project), String(score));
  } catch {
    // Session storage is optional; voting still works if the browser blocks it.
  }
};

const getRatingProjectKeys = (project) => getProjectReviewKeys(project);

const getRatingScore = (rating) => {
  const raw = rating.score ?? rating.rating ?? rating.value;
  const score = Number(raw);
  return Number.isFinite(score) ? Math.max(1, Math.min(5, Math.round(score))) : null;
};

const getRatingCountsForProject = (project) => {
  const keys = getRatingProjectKeys(project);
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  currentRatings.forEach((rating) => {
    const ratingKeys = [
      rating.projectId,
      rating.programId,
      rating.program,
      rating.title
    ].filter(Boolean).map(normalizeReviewKey);

    if (!ratingKeys.some((key) => keys.includes(key))) return;

    if (rating.counts && typeof rating.counts === "object") {
      [1, 2, 3, 4, 5].forEach((score) => {
        counts[score] += Number(rating.counts[String(score)] || rating.counts[score] || 0);
      });
      return;
    }

    const score = getRatingScore(rating);
    if (score) counts[score] += 1;
  });

  const sessionScore = getSessionRating(project);
  if (sessionScore) counts[sessionScore] += 1;

  return counts;
};

const addLocalRating = (project, score) => {
  let rating = currentRatings.find((item) =>
    getRatingProjectKeys(project).includes(normalizeReviewKey(item.projectId || item.programId || item.program || item.title))
  );

  if (!rating) {
    rating = { projectId: project.id, program: updatesProgramNames[project.id] || project.title, counts: {} };
    currentRatings.push(rating);
  }

  rating.counts = rating.counts || {};
  rating.counts[String(score)] = Number(rating.counts[String(score)] || 0) + 1;
};

const getRatingStarWord = (score) => {
  if (currentLanguage === "ru") {
    if (score === 1) return "звезда";
    if (score >= 2 && score <= 4) return "звезды";
    return "звёзд";
  }
  if (currentLanguage === "de") return score === 1 ? "Stern" : "Sterne";
  return score === 1 ? "star" : "stars";
};

const renderRatingStats = (project) => {
  if (!ratingStats || !ratingTotal) return;

  const counts = getRatingCountsForProject(project);
  const maxCount = Math.max(...Object.values(counts), 1);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  ratingStats.replaceChildren();
  [5, 4, 3, 2, 1].forEach((score) => {
    const row = createElement("div", "rating-stat-row");
    const label = createElement("span", "rating-stat-label", `${score} ${getRatingStarWord(score)}`);
    const bar = createElement("span", "rating-stat-bar");
    const fill = createElement("span");
    fill.style.width = `${(counts[score] / maxCount) * 100}%`;
    const count = createElement("strong", null, String(counts[score]));

    bar.append(fill);
    row.append(label, bar, count);
    ratingStats.append(row);
  });

  ratingTotal.textContent = t("ratingTotal", { count: total });
};

const setRatingChoiceState = (score) => {
  ratingChoice?.querySelectorAll(".rating-star").forEach((button) => {
    const buttonScore = Number(button.dataset.score);
    button.classList.toggle("is-selected", buttonScore <= score);
  });
};

const showRatingToast = (message = t("ratingSavedToast")) => {
  const oldToast = document.querySelector(".rating-toast");
  oldToast?.remove();

  const toast = createElement("div", "rating-toast", message);
  document.body.append(toast);

  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 240);
  }, 2300);
};

const submitProjectRating = (project, score) => {
  if (!project || hasRatedThisSession(project)) {
    if (ratingStatus) ratingStatus.textContent = t("ratingAlreadySent");
    showRatingToast(t("ratingAlreadySent"));
    return;
  }

  rememberRatingThisSession(project, score);
  renderRatingStats(project);
  setRatingChoiceState(score);
  if (ratingStatus) ratingStatus.textContent = t("ratingThanks");
  showRatingToast();

  window.setTimeout(() => {
    const modal = document.querySelector("#projectRatingModal.is-open");
    if (modal) closeModal(modal);
  }, 850);

  if (!ratingSubmitUrl) return;

  const payload = {
    date: new Date().toISOString(),
    projectId: project.id,
    program: updatesProgramNames[project.id] || project.title,
    rating: score
  };

  fetch(ratingSubmitUrl, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  }).catch(() => {
    // The visitor should not see a technical error if Google is slow or unavailable.
  });
};

const openProjectRating = (project) => {
  if (!projectRatingTitle || !ratingChoice || !ratingStatus || !ratingStats || !ratingTotal) return;

  projectRatingTitle.textContent = t("ratingForTitle", { title: project.title });
  ratingChoice.replaceChildren();

  const alreadyRated = hasRatedThisSession(project);
  [1, 2, 3, 4, 5].forEach((score) => {
    const star = createElement("button", "rating-star", "★");
    star.type = "button";
    star.dataset.score = String(score);
    star.setAttribute("aria-label", `${score} ${getRatingStarWord(score)}`);
    star.disabled = alreadyRated;
    star.addEventListener("click", () => submitProjectRating(project, score));
    star.addEventListener("mouseenter", () => setRatingChoiceState(score));
    star.addEventListener("focus", () => setRatingChoiceState(score));
    ratingChoice.append(star);
  });

  ratingChoice.addEventListener("mouseleave", () => setRatingChoiceState(0), { once: true });
  ratingStatus.textContent = alreadyRated ? t("ratingAlreadySent") : t("ratingSubmitHint");
  renderRatingStats(project);
  openModal("projectRatingModal");

  const modal = document.querySelector("#projectRatingModal");
  const dialog = modal?.querySelector(".rating-dialog");
  if (dialog && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    dialog.onmouseleave = () => {
      if (modal.classList.contains("is-open")) closeModal(modal);
    };
  }
};

const setReviews = (reviews) => {
  currentReviews = reviews;
  if (currentProjects.length) renderProjects(currentProjects);
};

const setRatings = (ratings) => {
  currentRatings = Array.isArray(ratings) ? ratings : [];
};

const renderProjects = (projects) => {
  currentProjects = projects;
  const publishedProjects = projects.filter((project) => project.status === "published").map(translateProject);
  projectsGrid.replaceChildren();
  renderVideos(publishedProjects);

  if (!publishedProjects.length) {
    projectsGrid.append(createElement("p", "noscript", t("noProjects")));
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

const renderVideos = (projects) => {
  if (!videosSection || !videosGrid) return;

  const videoProjects = projects.filter((project) => project.videoUrl);
  videosGrid.replaceChildren();

  if (!videoProjects.length) {
    videosSection.hidden = true;
    return;
  }

  videoProjects.forEach((project) => {
    videosGrid.append(buildVideoCard(project));
  });

  videosSection.hidden = false;
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

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.lang;
    if (!supportedLanguages.includes(language)) return;

    currentLanguage = language;
    localStorage.setItem(languageStorageKey, currentLanguage);
    applyStaticTranslations();
    if (currentProjects.length) renderProjects(currentProjects);
    languageMenu?.removeAttribute("open");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  document.querySelectorAll(".modal.is-open").forEach(closeModal);
});

document.addEventListener("click", (event) => {
  if (!videosDisclosure?.open) return;
  if (videosDisclosure.contains(event.target)) return;
  videosDisclosure.open = false;
});

applyStaticTranslations();

copyEmailText?.addEventListener("click", async () => {
  if (!emailPreviewText) return;

  try {
    await navigator.clipboard.writeText(emailPreviewText.value);
    copyEmailText.textContent = t("copied");
  } catch {
    emailPreviewText.select();
    copyEmailText.textContent = t("selected");
  }
});

downloadLinkFile?.addEventListener("click", () => {
  if (!currentLinkFile) return;

  const blob = new Blob([currentLinkFile.text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = currentLinkFile.name;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  downloadLinkFile.textContent = t("txtDownloaded");
});

shareLinkFile?.addEventListener("click", async () => {
  if (!currentLinkFile) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: currentLinkFile.title,
        text: currentLinkFile.text
      });
      shareLinkFile.textContent = t("sent");
      return;
    }

    await navigator.clipboard.writeText(currentLinkFile.text);
    shareLinkFile.textContent = t("textCopied");
  } catch (error) {
    if (error.name === "AbortError") return;
    shareLinkFile.textContent = t("failed");
  }
});

if (window.location.protocol === "file:") {
  renderProjects(localProjectsFallback);
  setReviews(localReviewsFallback);
  setRatings(localRatingsFallback);
} else {
  fetch("data/projects.json?v=20260716-3")
    .then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить projects.json");
      return response.json();
    })
    .then(renderProjects)
    .catch(() => {
      projectsGrid.replaceChildren(
        createElement("p", "noscript", t("loadError"))
      );
    });

  fetch("data/reviews.json?v=20260712-1")
    .then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить reviews.json");
      return response.json();
    })
    .then(setReviews)
    .catch(() => setReviews([]));

  fetch("data/ratings.json?v=20260713-1")
    .then((response) => {
      if (!response.ok) throw new Error("Не удалось загрузить ratings.json");
      return response.json();
    })
    .then(setRatings)
    .catch(() => setRatings([]));
}
