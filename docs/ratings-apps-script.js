// CodeWerk quick ratings.
// 1. Open the Google Sheet that receives CodeWerk data.
// 2. Extensions -> Apps Script.
// 3. Paste this file, set SPREADSHEET_ID, save.
// 4. Deploy -> New deployment -> Web app.
// 5. Execute as: Me. Who has access: Anyone.
// 6. Paste the Web App URL into ratingSubmitUrl in script.js.

const SPREADSHEET_ID = "PASTE_YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Оценки";

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  const rating = Number(data.rating);

  if (!data.program || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Invalid rating" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(["Дата", "Программа", "Оценка", "Project ID"]);
  }

  sheet.appendRow([
    new Date(),
    String(data.program),
    Math.round(rating),
    String(data.projectId || "")
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
