/**
 * CodeWerk download request auto-reply.
 *
 * Paste this code into the Google Sheets file connected to the
 * "CodeWerk download request" Google Form:
 * Extensions -> Apps Script.
 *
 * Recommended form setup:
 * 1. Collect email addresses in Google Forms settings.
 * 2. Add one required question: Program.
 *
 * Manual Email question is also supported as a fallback.
 */

const PROGRAM_LINKS = {
  "Taste & Trace / Кулинарная книга": {
    title: "Taste & Trace / Кулинарная книга",
    downloadUrl: "https://github.com/milleran41/taste-and-trace-download/releases/download/v0.0.0/Taste.Trace-Portable-0.0.0-x64.exe",
    pageUrl: "https://milleran41.github.io/codewerk/#cookbook"
  },
  MixLab: {
    title: "MixLab",
    downloadUrl: "https://github.com/milleran41/MixLab/raw/main/MixLab.exe",
    pageUrl: "https://milleran41.github.io/codewerk/#mixlab"
  }
};

const FROM_NAME = "CodeWerk";
const REPLY_TO = "linksaverpro.help@gmail.com";

function onFormSubmit(event) {
  const response = getResponseData_(event);
  const email = response.email;
  const programName = response.program;
  const program = PROGRAM_LINKS[programName];

  if (!email || !program) {
    notifyOwner_(response, "CodeWerk: download request needs attention");
    return;
  }

  MailApp.sendEmail({
    to: email,
    replyTo: REPLY_TO,
    name: FROM_NAME,
    subject: `CodeWerk: ссылка на скачивание ${program.title}`,
    htmlBody: buildHtmlMessage_(program),
    body: buildTextMessage_(program)
  });
}

function getResponseData_(event) {
  const namedValues = event?.namedValues || {};
  const email =
    firstValue_(namedValues.Email) ||
    firstValue_(namedValues["Email address"]) ||
    firstValue_(namedValues["Электронная почта"]) ||
    firstValue_(namedValues["Адрес электронной почты"]) ||
    findEmailInNamedValues_(namedValues);

  const program =
    firstValue_(namedValues.Program) ||
    firstValue_(namedValues["Какая программа вас интересует?"]) ||
    firstValue_(namedValues["Программа"]);

  return { email, program, namedValues };
}

function firstValue_(value) {
  return Array.isArray(value) ? String(value[0] || "").trim() : String(value || "").trim();
}

function findEmailInNamedValues_(namedValues) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const [key, value] of Object.entries(namedValues)) {
    const label = String(key).toLowerCase();
    const candidate = firstValue_(value);
    if ((label.includes("email") || label.includes("mail") || label.includes("почт")) && emailPattern.test(candidate)) {
      return candidate;
    }
  }

  for (const value of Object.values(namedValues)) {
    const candidate = firstValue_(value);
    if (emailPattern.test(candidate)) {
      return candidate;
    }
  }

  return "";
}

function buildTextMessage_(program) {
  return [
    `Здравствуйте!`,
    ``,
    `Спасибо за интерес к ${program.title}.`,
    ``,
    `Страница программы:`,
    program.pageUrl,
    ``,
    `Ссылка на скачивание:`,
    program.downloadUrl,
    ``,
    `Если Windows покажет предупреждение при запуске, это может быть связано с тем, что программа распространяется как независимая сборка без Microsoft Store.`,
    ``,
    `С уважением,`,
    `Andreas Miller / CodeWerk`
  ].join("\n");
}

function buildHtmlMessage_(program) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#202124">
      <h2 style="margin:0 0 12px">CodeWerk</h2>
      <p>Здравствуйте!</p>
      <p>Спасибо за интерес к <strong>${escapeHtml_(program.title)}</strong>.</p>
      <p>
        <a href="${program.pageUrl}" style="color:#4f7cff">Открыть страницу программы</a><br>
        <a href="${program.downloadUrl}" style="color:#4f7cff">Скачать программу</a>
      </p>
      <p style="font-size:13px;color:#5f6368">
        Если Windows покажет предупреждение при запуске, это может быть связано с тем,
        что программа распространяется как независимая сборка без Microsoft Store.
      </p>
      <p>С уважением,<br>Andreas Miller / CodeWerk</p>
    </div>
  `;
}

function notifyOwner_(response, subject) {
  MailApp.sendEmail({
    to: REPLY_TO,
    subject,
    body: [
      "Не удалось автоматически отправить ссылку.",
      "",
      `Email: ${response.email || "-"}`,
      `Program: ${response.program || "-"}`,
      "",
      JSON.stringify(response.namedValues, null, 2)
    ].join("\n")
  });
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
