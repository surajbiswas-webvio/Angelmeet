export const appLocators = {
  email: 'input[placeholder="Enter your email"]',
  password: 'input[placeholder="Enter your password"]',
  login: 'button:has-text("Login")',
  newMeeting: 'button:has-text("New Meeting")',
  joinInput: 'input[placeholder="Enter code or link"]',
  join: 'button:has-text("Join")',
  profile: 'button:has(img[alt="profile"])',
  allMeetings: 'a[href="/conference-view-list"]',
  aiNotetaker: 'a[href="/notetaker-dashboard"]'
} as const;
