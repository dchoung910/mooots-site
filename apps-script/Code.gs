/**
 * Mooots waitlist: receives signups from mooots.app and adds them to this sheet.
 *
 * Setup (once): see README.md in the mooots-site repo. In short, paste this
 * into Extensions > Apps Script on the waitlist sheet, then
 * Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone),
 * and put the web app URL in assets/waitlist.js.
 */

var SHEET_NAME = 'Waitlist';
var HEADERS = ['Joined (UTC)', 'Phone', 'Source', 'Consent wording', 'Status'];

function doPost(e) {
  var p = (e && e.parameter) || {};

  // Bots fill the hidden "website" field; people never see it.
  if (p.website) return done();

  var d = String(p.phone || '').replace(/\D/g, '');
  if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
  if (d.length !== 10) return done();
  var phone = '+1' + d;
  var consent = String(p.consent || '').slice(0, 1000);
  // Which link they came from (e.g. "tiktok"), set by the bio link tag.
  var source = String(p.source || 'direct').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30) || 'direct';

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    // Skip numbers already on the list.
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getDisplayValues();
      for (var i = 0; i < existing.length; i++) {
        if (existing[i][0] === phone) return done();
      }
    }
    // The leading apostrophe keeps Sheets from turning "+1..." into a number.
    sheet.appendRow([new Date().toISOString(), "'" + phone, source, consent, 'Waiting']);
  } finally {
    lock.releaseLock();
  }
  return done();
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function done() {
  return ContentService.createTextOutput('ok');
}
