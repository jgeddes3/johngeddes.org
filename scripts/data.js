// Verified against linkedin.com/in/therealjohngeddes (experience detail page,
// read 2026-08-01) — titles, employment type, locations and dates come from
// there, per the decision to treat LinkedIn as the source of truth.
const CONTACT = {
  name: 'John Geddes',
  line: 'Chicago, IL 60618 · (612) 790-3691 · johngeddes@pm.me · johngeddes.org · linkedin.com/in/therealjohngeddes',
};

const EDUCATION = {
  school: 'Loyola University Chicago',
  detail: 'Bachelor of Science, Computer Science · Minor in Philosophy · 2019–2023',
  note: 'Student Government representative for the Computer Science department.',
};

// One canonical record per role. Each resume picks the bullet set it needs, so
// no two versions can drift apart on dates, titles or employers.
const ROLES = {
  tag: {
    company: 'TAG — The Aspen Group', title: 'Senior Executive Desktop Support Engineer',
    dates: 'September 2025 – Present', place: 'Chicago, IL',
    av: [
      'Lead the modernisation of enterprise AV across the company, standardising on a Logitech ecosystem and deploying Q-SYS, Crestron, Biamp and Shure to bring failing rooms back to reliable service.',
      'Act as senior technical lead on the AV engineering team: set priorities, coordinate project execution, and train junior staff on escalation paths and system standards.',
      'Support the full C-Suite directly, resolving AV, endpoint and connectivity problems fast enough that executive operations do not stop.',
    ],
    exec: [
      'Sole technical support for the full C-Suite and senior leadership, covering AV, endpoint and connectivity issues under time pressure and in front of an audience.',
      'Administer endpoint and device management across JAMF, ServiceNow, Microsoft Intune and Azure Active Directory, keeping provisioning and compliance consistent enterprise-wide.',
      'Lead the AV modernisation programme on a Logitech ecosystem with Q-SYS, Crestron, Biamp and Shure.',
    ],
    mgmt: [
      'Senior technical lead on the AV engineering team: own priorities, coordinate project execution across sites, and mentor junior engineers on escalation procedure and system standards.',
      'Drove the enterprise AV modernisation programme end to end, from platform selection through deployment.',
      'Built and shipped an internal asset-management platform that replaced a manual spreadsheet process for the IT team.',
    ],
    dev: [
      'Designed and built an internal device-lifecycle platform on top of the Snipe-IT REST API: a React 19 and TypeScript front end, an Express gateway adding Entra ID single sign-on, role-based access and a pooled service-token layer, and a PostgreSQL service that reconciles eleven vendor APIs into one record per machine.',
      'Added a reconciliation engine that raises and auto-closes flags where systems disagree, with every check gated on how recently its source last synced.',
      'Administer JAMF, ServiceNow, Microsoft Intune and Azure Active Directory across the enterprise.',
    ],
  },
  discover: {
    company: 'Discover', title: 'Audio Visual Specialist II',
    dates: 'February 2025 – September 2025', place: 'Chicago, IL',
    av: [
      'Ran break/fix support across an enterprise Microsoft Teams estate, troubleshooting Cisco hardware and Lenovo ThinkPad systems.',
      'Installed and programmed Crestron, Q-SYS and Biamp systems, and the networking behind them, across conference and collaboration spaces.',
      'Managed equipment health proactively through Crestron Toolbox, Q-SYS Designer and Biamp Tesira rather than waiting for tickets.',
    ],
    exec: [
      'Ran break/fix support across an enterprise Microsoft Teams estate, troubleshooting Cisco and Lenovo hardware to keep meetings running.',
      'Built a room-check application and an inventory tool in Power Apps, Power Automate and Power BI, turning a manual round into a dashboard.',
    ],
    mgmt: [
      'Led and mentored a team of five Level 1 technicians, setting troubleshooting practice and guiding system optimisation work.',
      'Owned break/fix across the enterprise Teams estate, coordinating priorities against installation and programming projects.',
      'Built custom corporate tooling in Power Apps, Power Automate and Power BI, including a room-check app and an inventory solution.',
    ],
    dev: [
      'Built a dynamic room-check application and an inventory management tool using Power Apps, Power Automate and Power BI, replacing a manual process and feeding a reporting dashboard.',
      'Led and mentored a team of five Level 1 technicians.',
    ],
  },
  abbott: {
    company: 'Abbott', title: 'Audio Visual Technician Tier 2',
    dates: 'October 2024 – February 2025', place: 'North Chicago, IL',
    av: [
      'Optimised conference-room workflows in a Cisco ecosystem, integrating Biamp, QSC, Shure, Sennheiser, ClickShare and ClearOne components.',
      'Monitored estate health through Crestron XiO, Crestron Toolbox, Q-SYS Designer, Vyopta, ThousandEyes and Webex Control Hub, addressing performance issues before they were reported.',
      'Tracked AV assets against the ServiceNow CMDB to keep inventory records accurate.',
    ],
    exec: [
      'Kept a Cisco conference-room estate running, integrating Biamp, QSC, Shure, Sennheiser, ClickShare and ClearOne components.',
      'Configured and integrated Accruent EMS to streamline event scheduling for stakeholders.',
    ],
    mgmt: [
      'Configured and integrated Accruent EMS, coordinating with stakeholders to reshape event scheduling around how teams actually booked rooms.',
      'Tracked AV assets against the ServiceNow CMDB, improving the accuracy of enterprise inventory records.',
    ],
    dev: [
      'Built a Power Apps solution for room checks and wired its operational data into a Power BI dashboard.',
    ],
  },
  kirkland: {
    company: 'Kirkland & Ellis', title: 'AV Support Specialist',
    dates: 'March 2024 – June 2024', place: 'Chicago, IL',
    av: [
      'Configured Cisco and Crestron systems with Shure microphones across the firm’s conference spaces.',
      'Set up and coordinated rooms for client meetings across Zoom, Microsoft Teams and WebEx.',
    ],
    exec: [
      'Set up and coordinated conference rooms for client meetings at a firm where a failed call is a billable-hour problem, supporting Zoom, Teams and WebEx.',
      'Ran demonstrations of new office and Excel features for staff, improving adoption.',
    ],
    mgmt: [
      'Coordinated conference-room setup for client meetings across Zoom, Teams and WebEx.',
      'Ran feature demonstrations for staff to improve adoption of new office tooling.',
    ],
    dev: [
      'Wrote VBA macros to automate data transfers and room testing in Excel, removing a manual step that was a regular source of errors.',
    ],
  },
  loyola: {
    company: 'Loyola University Chicago', title: 'Audio Visual Technician',
    dates: 'January 2021 – May 2023', place: 'Chicago, IL · Part-time',
    av: [
      'Ran AV for internal and external campus events, operating and maintaining analog equipment, mixers, Crestron systems and projectors.',
      'Partnered with IT Services on equipment maintenance and upgrades across campus.',
      'Configured and troubleshot Microsoft Teams and Zoom for campus-wide video conferencing.',
    ],
    exec: [
      'Ran AV for internal and external campus events, including troubleshooting live during them.',
    ],
    mgmt: [
      'Ran AV for internal and external campus events, coordinating with IT Services on maintenance and upgrade work.',
    ],
    dev: [
      'Operated and maintained campus AV systems while completing a Computer Science degree.',
    ],
  },
  brag: {
    company: 'Brag House', title: 'Computer Science Intern',
    dates: 'January 2022 – May 2022', place: 'Part-time',
    dev: [
      'Worked with the development team in React.js, React Native, CSS and HTML on the front end of the company’s iOS app and website.',
      'Designed and implemented the Brago game inside the iOS app.',
      'Redesigned the app in Figma to the modern look the company wanted.',
      'Trained in Kotlin and Django to support the back-end developer, and ran user-testing sessions whose feedback drove UI changes.',
    ],
    av: [], exec: [], mgmt: [],
  },
  tlc: {
    company: 'TLC MilliMeter Wave Products', title: 'Software Intern',
    dates: 'January 2020 – August 2020', place: 'Minneapolis, MN',
    dev: [
      'Moved the company off a primitive on-site code repository to cloud-hosted Bitbucket, then trained staff on git so the migration actually held.',
      'Helped design a COVID-19 detection radar in CAD, using millimetre waves.',
      'Flew drones for a collaboration with the US Air Force on a radar system for identifying hostile drones.',
    ],
    av: [], exec: [], mgmt: [],
  },
};

// johngeddes.org is deliberately not listed — the URL is already in the contact
// line, and the page space buys a fuller description of the two that matter.
const PROJECTS = [
  { name: 'Cipher Tracker', link: 'cipher-app.org',
    text: 'React Native and Expo habit tracker for iOS and Android. Every entry is encrypted on the device with AES-256-CTR under a PBKDF2-derived key, so the server only ever holds ciphertext and there is deliberately no password reset. 548 passing unit tests.' },
  { name: 'Rambler Registrar', link: 'github.com/jgeddes3/RamblerRegistrar',
    text: 'Course scheduler for Loyola students. A bounded depth-first search builds every conflict-free timetable from up to eight courses and scores each 0–100 against a published penalty model that knows the walk time between real campus buildings.' },
];

const SKILLS = [
  ['Languages', 'TypeScript, JavaScript, Python, SQL, HTML, CSS, VBA'],
  ['Frameworks', 'React, React Native, Expo, Node.js, Express, Vite, Tailwind CSS'],
  ['Data', 'PostgreSQL, SQLite, Cloud Firestore, MongoDB, Power BI'],
  ['Platforms', 'Microsoft Entra ID, Firebase, Docker, nginx, PM2, Git, Bitbucket'],
  ['Enterprise', 'JAMF, ServiceNow, Microsoft Intune, Azure Active Directory, Power Apps'],
];

module.exports = { CONTACT, EDUCATION, ROLES, PROJECTS, SKILLS };
