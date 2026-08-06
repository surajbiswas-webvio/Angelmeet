import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const out = 'outputs/angelmeet-qa';
const cases = [
  ['AM-001','Authentication','Login with valid credentials','P0','Critical','Active account','Enter valid email and password; select Login','Valid account','Dashboard loads; authenticated navigation is visible','Automated','Yes','Yes','Yes','Positive','Smoke baseline'],
  ['AM-002','Authentication','Reject invalid password','P0','High','Login page open','Enter valid email and invalid password; select Login','Invalid password','Clear error is shown; session is not created','Planned','Yes','Yes','Yes','Negative','Avoid account lockout'],
  ['AM-003','Authentication','Require email and password','P1','Medium','Login page open','Submit empty fields','Empty values','Required-field validation is displayed','Planned','No','Yes','Yes','Negative','Client/server validation'],
  ['AM-004','Authentication','Logout ends session','P0','High','Authenticated user','Open profile; select Logout; revisit protected URL','Authenticated session','User is redirected to login and protected page is inaccessible','Automated','Yes','Yes','Yes','Positive','Storage-state isolation'],
  ['AM-005','Session','Expire/clear session','P1','High','Authenticated user','Clear session; navigate to protected route','Expired session','Redirect to login with no sensitive data exposed','Planned','No','Yes','No','Negative','API-assisted'],
  ['AM-006','Dashboard','Authenticated dashboard content','P0','High','Authenticated user','Open dashboard','N/A','Meeting launcher, join field, calendar and navigation render','Automated','Yes','Yes','Yes','Positive','Role-based assertions'],
  ['AM-007','Join Meeting','Reject empty meeting link','P0','Medium','Authenticated user','Select Join with blank input','Blank','Toast says Please enter meeting URL','Automated','Yes','Yes','Yes','Negative','Observed 2026-08-05'],
  ['AM-008','Join Meeting','Join with valid meeting URL','P0','Critical','Valid active meeting and second user','Paste URL; select Join','Meeting URL','Pre-join or meeting room opens','Planned','Yes','Yes','Yes','Positive','Requires disposable meeting'],
  ['AM-009','Join Meeting','Reject malformed meeting link','P1','Medium','Authenticated user','Enter malformed URL; select Join','Invalid URL','Validation prevents navigation and provides helpful message','Planned','No','Yes','Yes','Negative','Boundary formats'],
  ['AM-010','Create Meeting','Open instant/scheduled choices','P0','High','Authenticated user','Open New Meeting','N/A','Instant and scheduled options are visible','Automated','Yes','Yes','Yes','Positive','No creation side effect'],
  ['AM-011','Create Meeting','Create public instant meeting','P0','Critical','Authenticated user','Choose instant meeting and submit','Public','Room opens and shareable join link is generated','Planned','Yes','Yes','No','Positive','Use test account/cleanup'],
  ['AM-012','Schedule Meeting','Required fields validation','P1','Medium','Authenticated user','Open schedule form; submit blank','Blank','Field validation explains required inputs','Planned','No','Yes','Yes','Negative','No persisted meeting'],
  ['AM-013','Schedule Meeting','Schedule future private meeting','P0','High','Authenticated user','Enter future date/time/privacy; save','Future datetime','Meeting appears in All Meetings and calendar','Planned','Yes','Yes','No','Positive','Cleanup required'],
  ['AM-014','Schedule Meeting','Reject past date/time','P1','Medium','Schedule form open','Set past schedule; save','Past datetime','Validation blocks save','Planned','No','Yes','Yes','Negative','Timezone-aware'],
  ['AM-015','All Meetings','Search meetings','P1','Medium','At least two meetings','Search by title/code','Known title','Only matching meetings display','Planned','No','Yes','Yes','Positive','Seeded data'],
  ['AM-016','All Meetings','Filter, sort and pagination','P1','Medium','Meeting history exists','Apply status/type/sort/page filters','Various filters','Results reflect selection and page counts remain valid','Planned','No','Yes','No','Positive','Contract/API assertions'],
  ['AM-017','AI Notetaker','Empty-state pagination','P1','Low','Account with no notes','Open AI Notetaker','N/A','Empty state shows 0 entries without NaN values','Planned','No','Yes','No','Negative','Bug AM-BUG-001'],
  ['AM-018','AI Notetaker','View notes/transcript/summary','P1','High','Completed recorded meeting','Open note record','Generated note','Transcript and summary are readable and scoped to meeting','Planned','No','Yes','No','Positive','Requires AI processing'],
  ['AM-019','Meeting Room','Camera toggle','P0','High','Two-user test meeting','Toggle camera','Camera permission granted','Video state changes only for local participant','Planned','Yes','Yes','No','Positive','Fake media in CI'],
  ['AM-020','Meeting Room','Microphone toggle','P0','High','Two-user test meeting','Toggle microphone','Microphone permission granted','Audio state changes and indicator updates','Planned','Yes','Yes','No','Positive','Fake media in CI'],
  ['AM-021','Meeting Room','Device selection','P1','Medium','Test media devices available','Open device settings; choose each device','Enumerated devices','Chosen device persists for meeting','Planned','No','Yes','No','Positive','Chromium flags in CI'],
  ['AM-022','Chat','Send and receive chat','P0','High','Two-user test meeting','Send text; verify second participant','Text including emoji','Message appears once, timestamped, to both participants','Planned','Yes','Yes','No','Positive','WebSocket assertion'],
  ['AM-023','Participants','Participant list and raise hand','P1','Medium','Two-user test meeting','Open participants; raise/lower hand','N/A','Roster and hand state synchronize','Planned','No','Yes','No','Positive','Cross-context'],
  ['AM-024','Invite','Copy/share invitation','P1','Medium','Meeting room open','Open Invite; copy link','Join link','Correct link is copied/rendered without exposing secrets','Planned','No','Yes','No','Positive','Clipboard-safe test'],
  ['AM-025','Screen Share','Share screen lifecycle','P1','High','Two-user test meeting','Start then stop sharing','Fake display media','Remote view and local indicator start/stop cleanly','Planned','No','Yes','No','Positive','Chromium fake display'],
  ['AM-026','Whiteboard','Collaborative drawing','P2','Medium','Two-user test meeting','Draw, undo, clear, verify remote','Stroke data','Both views synchronize and controls apply correctly','Planned','No','Yes','No','Positive','Canvas helpers'],
  ['AM-027','Recording','Recording lifecycle and consent','P1','High','Authorized recording meeting','Start/stop recording','Consent enabled','Consent is visible; recording status and artifact are accurate','Planned','No','Yes','No','Positive','External storage contract'],
  ['AM-028','Waiting Room','Admit/reject participant','P1','High','Waiting room enabled','Join as guest; host admits/rejects','Guest user','Guest remains isolated until admitted; rejection is clear','Planned','No','Yes','No','Positive','Two identities'],
  ['AM-029','Meeting Settings','Privacy and meeting type','P1','High','Meeting owner','Change public/private/webinar setting','Each type','Access rules update and unauthorized entry is denied','Planned','No','Yes','No','Positive','Security-sensitive'],
  ['AM-030','Profile','View profile data','P2','Low','Authenticated user','Open My Profile','N/A','Name, email, locale/timezone display accurately','Automated','No','Yes','Yes','Positive','Observed fields'],
  ['AM-031','Profile','Change-password validation','P1','High','Authenticated user','Open Change Password; mismatch new/confirm','Mismatched values','Update is blocked with clear validation','Planned','No','Yes','Yes','Negative','Never modify shared credential'],
  ['AM-032','Security','Unauthorized deep links','P0','Critical','Unauthenticated browser','Open protected routes directly','/conference-view-list; /notetaker-dashboard','Redirect/login and no protected content rendered','Planned','Yes','Yes','No','Negative','Independent context'],
  ['AM-033','Accessibility','Keyboard and accessible names','P1','Medium','Key pages loaded','Tab through and inspect key controls','Keyboard only','Logical focus order; controls have usable accessible names','Planned','No','Yes','No','Positive','axe integration recommended'],
  ['AM-034','Responsive','Mobile dashboard/meeting room','P1','Medium','Authenticated user','Run at 375x812 and 768x1024','Viewport sizes','No horizontal overflow; critical controls usable','Planned','No','Yes','No','Positive','Device projects'],
  ['AM-035','Compatibility','Chromium/Firefox/WebKit smoke','P1','High','Credentials available','Run auth/dashboard/join validation','Three browser engines','Critical smoke cases pass consistently','Planned','No','Yes','No','Positive','WebRTC limited outside Chromium']
];
const headers = ['Test Case ID','Module','Test Case Title','Priority','Severity','Preconditions','Test Steps','Test Data','Expected Result','Automation Status','Smoke','Regression','Sanity','Positive/Negative','Remarks'];
const wb = Workbook.create();
const sheet = wb.worksheets.add('Test Cases');
sheet.showGridLines = false;
sheet.getRange('A1:O1').merge(); sheet.getRange('A1').values = [['AngelMeet E2E Test Catalogue']];
sheet.getRange('A2:O2').merge(); sheet.getRange('A2').values = [['Scope: production-ready Playwright coverage design | Generated 2026-08-05']];
sheet.getRange('A4:O4').values = [headers];
sheet.getRange(`A5:O${cases.length+4}`).values = cases;
sheet.getRange('A1:O1').format = {fill:'#17365D',font:{bold:true,color:'#FFFFFF',size:16},horizontalAlignment:'center',verticalAlignment:'center'};
sheet.getRange('A2:O2').format = {fill:'#D9EAF7',font:{italic:true,color:'#17365D'},horizontalAlignment:'center'};
sheet.getRange('A4:O4').format = {fill:'#1F4E78',font:{bold:true,color:'#FFFFFF'},horizontalAlignment:'center',verticalAlignment:'center',wrapText:true,borders:{preset:'outside',style:'thin',color:'#9FBAD0'}};
sheet.getRange(`A5:O${cases.length+4}`).format = {verticalAlignment:'top',wrapText:true,borders:{preset:'inside',style:'thin',color:'#D9E2F3'}};
sheet.getRange(`A5:O${cases.length+4}`).format.rowHeight = 48;
sheet.getRange('A1:O1').format.rowHeight = 28; sheet.getRange('A2:O2').format.rowHeight = 22; sheet.getRange('A4:O4').format.rowHeight = 36;
const widths = [14,16,32,10,11,26,38,22,36,18,9,11,9,18,28];
for (let i=0;i<widths.length;i++) sheet.getRangeByIndexes(0,i,cases.length+4,1).format.columnWidth = widths[i];
sheet.freezePanes.freezeRows(4); sheet.freezePanes.freezeColumns(2);
sheet.getRange(`D5:D${cases.length+4}`).conditionalFormats.add('containsText',{text:'P0',format:{fill:'#FDE2E2',font:{bold:true,color:'#9B1C1C'}}});
sheet.getRange(`J5:J${cases.length+4}`).conditionalFormats.add('containsText',{text:'Automated',format:{fill:'#DCFCE7',font:{bold:true,color:'#166534'}}});
sheet.getRange(`J5:J${cases.length+4}`).conditionalFormats.add('containsText',{text:'Planned',format:{fill:'#FEF3C7',font:{color:'#92400E'}}});
sheet.tables.add(`A4:O${cases.length+4}`,true,'AngelMeetTestCases');
const sum = wb.worksheets.add('Coverage Summary'); sum.showGridLines = false;
sum.getRange('A1:F1').merge(); sum.getRange('A1').values=[['AngelMeet Automation Coverage Summary']];
sum.getRange('A3:B3').values=[['Metric','Value']];
sum.getRange('A4:B8').values=[['Total test cases',cases.length],['Automated',cases.filter(x=>x[9]==='Automated').length],['Planned',cases.filter(x=>x[9]==='Planned').length],['P0 critical paths',cases.filter(x=>x[3]==='P0').length],['Known defects',1]];
sum.getRange('A10:F10').values=[['Known Defect','Module','Severity','Priority','Status','Evidence']];
sum.getRange('A11:F11').values=[['AM-BUG-001','AI Notetaker','Low','P1','Open','Empty account renders “Showing NaN to NaN of 0 Entries.”']];
sum.getRange('A1:F1').format={fill:'#17365D',font:{bold:true,color:'#FFFFFF',size:16},horizontalAlignment:'center'};
sum.getRange('A3:B3').format={fill:'#1F4E78',font:{bold:true,color:'#FFFFFF'}}; sum.getRange('A10:F10').format={fill:'#1F4E78',font:{bold:true,color:'#FFFFFF'}};
sum.getRange('A3:B8').format.borders={preset:'all',style:'thin',color:'#D9E2F3'}; sum.getRange('A10:F11').format={wrapText:true,borders:{preset:'all',style:'thin',color:'#D9E2F3'}};
sum.getRange('A1:F1').format.rowHeight=28; sum.getRange('A11:F11').format.rowHeight=40;
for (const [col,w] of [['A',28],['B',20],['C',14],['D',12],['E',14],['F',60]]) sum.getRange(`${col}1:${col}11`).format.columnWidth=w;
await fs.mkdir(out,{recursive:true});
const preview = await wb.render({sheetName:'Test Cases',range:'A1:O18',scale:1.2,format:'png'}); await fs.writeFile(`${out}/test-cases-preview.png`,new Uint8Array(await preview.arrayBuffer()));
const xlsx = await SpreadsheetFile.exportXlsx(wb); await xlsx.save(`${out}/AngelMeet_E2E_Test_Cases.xlsx`);
const check = await wb.inspect({kind:'table',range:'Test Cases!A1:O9',include:'values,formulas',tableMaxRows:9,tableMaxCols:15});
console.log(check.ndjson);
