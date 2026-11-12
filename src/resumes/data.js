// One source for every resume. The PDF and Word files (npm run resumes), the
// Recruiters page and the About timeline all read from here. Plain data with
// no imports, so both Vite and Node can load it.
//
// Every figure traces to John or to a case-study page on this site, and
// scripts/resumes/data.test.mjs fails if a number shows up that is not on its
// allowed list. Bullets are keyed by track: main, av, asset, lead, software.

export const CONTACT = {
  name: 'John Geddes',
  location: 'Chicago, IL 60618',
  phone: '(612) 790-3691',
  email: 'johngeddes@pm.me',
  site: 'johngeddes.org',
  linkedin: 'linkedin.com/in/therealjohngeddes',
  github: 'github.com/jgeddes3',
};

export const EDUCATION = {
  school: 'Loyola University Chicago',
  degree: 'Bachelor of Science in Computer Science, Minor in Philosophy',
  dates: '2019 to 2023',
  note: 'Student Government representative for the Computer Science department.',
};

export const JOBS = {
  tag: {
    title: 'Senior Desktop Support Engineer',
    company: 'The Aspen Group (TAG)',
    place: 'Chicago, IL',
    start: '2025-09',
    end: null,
    bullets: {
      main: [
        'Upgraded four 20+ person meeting rooms to Neat and rebuilt the boardroom from Crestron and Q-SYS to Neat and Q-SYS with 360-degree cameras.',
        'Repaired and upgraded six divisible Q-SYS and Crestron training rooms that hold 120+ people.',
        'Support 88+ Logitech meeting rooms across the TAG network and handle AV and endpoint problems for the C-Suite directly.',
        'Built Census, a React and TypeScript asset platform on Snipe-IT that reconciles 14 outside systems across 48,243 assets and is used by 36 people each week.',
        'Designed the onboarding, shipping, returns and chargeback processes Census runs, giving the team back about 314 hours a month.',
        "Train TAG's five-person IT team in AV and administer Microsoft Intune, Jamf, ServiceNow and Entra ID.",
      ],
      av: [
        'Upgraded four 20+ person meeting rooms to Neat and moved the boardroom from Crestron and Q-SYS to a full Neat and Q-SYS system with 360-degree cameras.',
        'Repaired and upgraded six divisible Q-SYS and Crestron training rooms that hold 120+ people.',
        'Support 88+ Logitech meeting rooms across the TAG network as one half of a two-person AV team.',
        'Handle AV, endpoint and connectivity problems for the C-Suite directly, often while the meeting waits.',
        'Train the five-person IT team in AV systems, room standards and escalation paths.',
      ],
      asset: [
        "Designed TAG's asset processes for onboarding, shipping, returns and monthly chargebacks, then built Census on Snipe-IT to run them.",
        'Cataloged all 48,243 assets into one record per device, reconciled each night against 14 systems including Intune, Jamf, CrowdStrike and ServiceNow.',
        'Automated routine asset work that gives the team back about 314 hours a month, using per-task times the team agreed on.',
        'Onboarded 910 assets in the first two weeks straight from SHI orders, with FedEx labels created from each checkout.',
        'Built nightly checks that raise, route and auto-close flags wherever two systems disagree about a device.',
        'Rolled Census out to the 36 people who use it each week; 11,942 asset changes went through it in October 2026.',
      ],
      lead: [
        "Train and technically lead TAG's five-person IT team in AV, covering room standards, escalation and first-line fixes.",
        'Ran the room upgrades: four Neat meeting rooms, a Neat and Q-SYS boardroom, and six divisible training rooms for 120+ people.',
        'Designed the IT asset processes and built Census, now used by 36 people each week and giving back about 314 hours a month.',
        'Support the C-Suite and executive leadership directly on AV, endpoints and connectivity.',
      ],
      software: [
        'Built Census, a React 19 and TypeScript platform on Snipe-IT with an Express gateway, MySQL on Cloud SQL and scheduled jobs on Google Cloud Run.',
        'Integrated 14 outside systems, including Intune, Jamf, ServiceNow and FedEx, into one record per device across 48,243 assets.',
        'Added Microsoft Entra ID sign-in so every change in Snipe-IT is written as the person who made it.',
        'Moved 41 read surfaces from the Snipe-IT API to SQL, taking a year of history from 19.5 minutes to 1.3 seconds.',
        'Took SonarQube blocker and critical findings from 43 to zero, with 716 test files run on every GitLab push.',
      ],
    },
  },
  discover: {
    title: 'Audio Visual Specialist II',
    company: 'Discover',
    place: 'Chicago, IL',
    start: '2025-02',
    end: '2025-09',
    bullets: {
      main: [
        'Supported 568+ meeting rooms across six locations in the US and abroad on an enterprise Microsoft Teams estate.',
        'Led and mentored a team of five Level 1 technicians, setting troubleshooting practice for the group.',
        'Installed and programmed Crestron, Q-SYS and Biamp systems and the networking behind them.',
        'Built a room-check app and an inventory tool in Power Apps, Power Automate and Power BI, replacing a manual round.',
      ],
      av: [
        'Supported 568+ meeting rooms across six locations in the US and abroad on an enterprise Microsoft Teams estate.',
        'Installed and programmed Crestron, Q-SYS and Biamp systems and the networking behind them.',
        'Monitored equipment health in Crestron Toolbox, Q-SYS Designer and Biamp Tesira instead of waiting for tickets.',
      ],
      asset: [
        'Built a room-check app and an inventory tool in Power Apps, Power Automate and Power BI, replacing a manual round with a dashboard.',
        'Supported 568+ meeting rooms across six locations in the US and abroad.',
        'Led and mentored a team of five Level 1 technicians, setting troubleshooting practice for the group.',
      ],
      lead: [
        'Led and mentored a team of five Level 1 technicians, setting troubleshooting practice for the group.',
        'Balanced break/fix across 568+ meeting rooms at six locations against installation and programming projects.',
        'Built a room-check app and an inventory tool in Power Apps and Power BI for the team to work from.',
      ],
    },
  },
  abbott: {
    title: 'Audio Visual Technician Tier 2',
    company: 'Abbott',
    place: 'North Chicago, IL',
    start: '2024-10',
    end: '2025-02',
    bullets: {
      main: [
        'Serviced 160+ meeting rooms across five Chicago-area sites in a Cisco ecosystem with Biamp, QSC, Shure and ClickShare.',
        'Monitored room health in Crestron XiO, Q-SYS Designer, Vyopta and ThousandEyes to catch faults before users reported them.',
        'Tracked AV assets against the ServiceNow CMDB to keep enterprise inventory records accurate.',
      ],
      av: [
        'Serviced 160+ meeting rooms across five Chicago-area sites in a Cisco ecosystem with Biamp, QSC, Shure, Sennheiser and ClearOne.',
        'Monitored room health in Crestron XiO, Vyopta, ThousandEyes and Webex Control Hub to catch faults before users reported them.',
      ],
      asset: [
        'Tracked AV assets across five Chicago-area sites against the ServiceNow CMDB to keep inventory records accurate.',
        'Created a Power Apps room-check solution that fed operational data to a Power BI dashboard.',
      ],
      lead: [
        'Configured and integrated Accruent EMS, working with stakeholders to fit event scheduling to how teams booked rooms.',
        'Serviced 160+ meeting rooms across five Chicago-area sites and kept AV assets current in the ServiceNow CMDB.',
      ],
    },
  },
  kirkland: {
    title: 'AV Support Specialist',
    company: 'Kirkland & Ellis',
    place: 'Chicago, IL',
    start: '2024-03',
    end: '2024-06',
    bullets: {
      main: [
        'Configured Cisco and Crestron systems with Shure microphones across about 144 meeting rooms in a single building.',
        'Wrote VBA macros in Excel to automate data transfers and room testing, removing a manual step that caused errors.',
      ],
      av: [
        'Configured Cisco and Crestron systems with Shure microphones across about 144 meeting rooms in a single building.',
        'Set up rooms for client meetings on Zoom, Microsoft Teams and Webex at a firm that bills by the hour.',
      ],
      asset: [
        'Wrote VBA macros in Excel to automate data transfers and room testing, removing a manual step that caused errors.',
      ],
      lead: [
        'Led demonstrations of new Office and Excel features for staff, which raised adoption of the new tools.',
      ],
    },
  },
  loyola: {
    title: 'Audio Visual Technician',
    company: 'Loyola University Chicago',
    place: 'Chicago, IL',
    type: 'Part-time',
    start: '2021-01',
    end: '2023-05',
    bullets: {
      main: [
        'Ran AV for about six to seven campus events a week on analog mixers, Crestron systems and projectors.',
        'Configured and supported Microsoft Teams and Zoom for campus video conferencing with IT Services.',
      ],
      av: [
        'Ran AV for about six to seven campus events a week on analog mixers, Crestron systems and projectors.',
        'Worked with IT Services on equipment maintenance and upgrades, and supported Teams and Zoom across campus.',
      ],
      asset: [
        'Maintained campus AV equipment with IT Services while running about six to seven events a week.',
      ],
      lead: [
        'Ran AV for about six to seven campus events a week, coordinating with IT Services on maintenance and upgrades.',
      ],
    },
  },
  brag: {
    title: 'Computer Science Intern',
    company: 'Brag House',
    place: '',
    type: 'Part-time',
    start: '2022-01',
    end: '2022-05',
    bullets: {
      main: [
        "Developed front-end features for the company's iOS app and website in React Native, React, HTML and CSS.",
        "Designed and implemented the Brago game inside the iOS app, then redesigned the app's look in Figma.",
      ],
      software: [
        "Developed front-end features for the company's iOS app and website in React Native, React, HTML and CSS.",
        "Designed and implemented the Brago game inside the iOS app, then redesigned the app's look in Figma.",
        'Ran user-testing sessions whose feedback drove UI changes.',
      ],
    },
  },
  tlc: {
    title: 'Software Intern',
    company: 'TLC MilliMeter Wave Products',
    place: 'Minneapolis, MN',
    start: '2020-01',
    end: '2020-08',
    bullets: {
      main: [
        'Moved the company from an on-site code repository to Bitbucket and trained staff on git so the switch held.',
        'Flew drones for a US Air Force collaboration on a radar system for identifying hostile drones.',
      ],
      software: [
        'Moved the company from an on-site code repository to Bitbucket and trained staff on git so the switch held.',
        'Flew drones for a US Air Force collaboration on a radar system for identifying hostile drones.',
      ],
    },
  },
};

export const PROJECTS = {
  cipher: {
    name: 'Cipher Tracker',
    link: 'cipher-app.org',
    text: 'React Native app for iOS and Android that encrypts every entry on the phone with AES-256, so the server only holds ciphertext. Lock-screen timers in Swift and Kotlin, 3,822 passing tests. In App Store preparation.',
  },
  rambler: {
    name: 'Rambler Registrar',
    link: 'github.com/jgeddes3/RamblerRegistrar',
    text: 'Course scheduler for Loyola students on Expo, Express and Puppeteer. Builds every conflict-free timetable from up to eight courses and scores each one, walk time between buildings included. Covers 2,082 courses.',
  },
  papertrail: {
    name: 'Paper Trail',
    link: 'papertrail.company',
    text: 'Budgeting tool that runs only in the browser. Reads PDF, CSV and OFX statements, encrypts them in IndexedDB with AES-GCM, and makes no network requests. 102 tests.',
  },
};

export const TRACKS = [
  {
    key: 'main',
    label: 'Main Resume',
    headline: 'AV and Software Engineer',
    file: 'John_Geddes_Resume',
    pages: 2,
    summary: 'AV and software engineer with five years of AV work and a Computer Science degree. Supports 88+ Logitech rooms at The Aspen Group and built Census, the asset platform its IT team uses every day.',
    skills: [
      ['AV', 'Q-SYS, Crestron, Neat, Logitech, Biamp Tesira, Shure, Cisco, Microsoft Teams, Zoom, Webex'],
      ['IT and endpoints', 'Microsoft Intune, Jamf, Microsoft Entra ID (Azure Active Directory), ServiceNow, Snipe-IT'],
      ['Software', 'TypeScript, JavaScript, React, React Native, Expo, Node.js, Express, SQL'],
      ['Cloud and data', 'Google Cloud Run, Cloud SQL (MySQL), Firebase, Firestore, Docker, GitLab CI'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola', 'brag', 'tlc'],
    shortJobs: [],
    projects: ['cipher', 'rambler', 'papertrail'],
    eduNote: true,
    github: false,
    note: 'The full picture on two pages, for roles that want AV and software together.',
    figures: [
      ['88+', 'Logitech rooms supported at TAG'],
      ['48,243', 'assets cataloged in Census'],
      ['568+', 'rooms covered at Discover'],
      ['3,822', 'tests behind Cipher Tracker'],
    ],
  },
  {
    key: 'av',
    label: 'AV Engineer',
    headline: 'AV Engineer',
    file: 'John_Geddes_Resume_AV_Engineer',
    pages: 1,
    summary: 'AV engineer with five years in corporate, legal, healthcare and university environments, from 20-person meeting rooms to training rooms that seat 120+. Supports 88+ Logitech rooms at The Aspen Group.',
    skills: [
      ['DSP and control', 'Q-SYS, Q-SYS Designer, Crestron, Crestron Toolbox, Crestron XiO, Biamp Tesira'],
      ['Video conferencing', 'Neat, Logitech, Cisco, Microsoft Teams, Zoom, Webex, ClickShare'],
      ['Audio', 'Shure, Sennheiser, QSC, ClearOne, analog mixers'],
      ['Monitoring', 'Vyopta, ThousandEyes, Webex Control Hub'],
      ['IT', 'Microsoft Intune, Jamf, ServiceNow CMDB, Microsoft Entra ID'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    shortJobs: [],
    projects: [],
    eduNote: true,
    github: false,
    note: 'For AV engineer, AV systems and collaboration technology roles.',
    figures: [
      ['88+', 'Logitech rooms supported at TAG'],
      ['6', 'divisible training rooms seating 120+'],
      ['568+', 'rooms covered at Discover'],
      ['160+', 'rooms across five Abbott sites'],
    ],
  },
  {
    key: 'asset',
    label: 'Asset Manager',
    headline: 'IT Asset Manager',
    file: 'John_Geddes_Resume_Asset_Manager',
    pages: 1,
    summary: "IT asset manager who built TAG's asset processes and the platform that runs them, then cataloged all 48,243 assets in it. The automations give the team back about 314 hours a month.",
    skills: [
      ['IT asset management', 'Snipe-IT, ServiceNow CMDB (configuration management database), asset lifecycle, onboarding, returns, chargebacks'],
      ['Endpoint management', 'Microsoft Intune, Jamf, Microsoft Entra ID, CrowdStrike, Apple Business Manager'],
      ['Logistics and procurement', 'FedEx shipping, SHI orders, Dell, Lenovo'],
      ['Reporting and automation', 'SQL, Power BI, Power Apps, Power Automate, scheduled jobs'],
      ['Development', 'TypeScript, React, Express, MySQL, Google Cloud Run'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    shortJobs: [],
    projects: [],
    eduNote: true,
    github: false,
    note: 'For IT asset management, ITAM and CMDB roles.',
    figures: [
      ['48,243', 'assets cataloged'],
      ['14', 'systems reconciled nightly'],
      ['910', 'assets onboarded in two weeks'],
      ['314', 'hours a month given back'],
    ],
  },
  {
    key: 'lead',
    label: 'Technical Lead',
    headline: 'Technical Lead / IT Manager',
    file: 'John_Geddes_Resume_Technical_Lead',
    pages: 1,
    summary: "Technical lead who still does the hands-on work. Trains TAG's five-person IT team in AV and built the asset platform 36 people use each week.",
    skills: [
      ['Leadership', 'technical training, mentoring, escalation standards, project coordination, stakeholder work'],
      ['Delivery', 'room upgrades, process design, rollouts, ServiceNow'],
      ['Technical', 'Q-SYS, Crestron, Neat, Microsoft Intune, Jamf, TypeScript, React'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    shortJobs: [],
    projects: [],
    eduNote: true,
    github: false,
    note: 'For team lead, supervisor and IT manager roles.',
    figures: [
      ['5', 'Level 1 technicians led at Discover'],
      ['5', 'IT staff trained in AV at TAG'],
      ['36', 'people using Census each week'],
      ['568+', 'rooms covered at Discover'],
    ],
  },
  {
    key: 'software',
    label: 'Software Engineer',
    headline: 'Software Engineer',
    file: 'John_Geddes_Resume_Software_Engineer',
    pages: 1,
    summary: 'Full-stack and mobile engineer with a Computer Science degree. Built Census, an internal platform in daily use at The Aspen Group, and Cipher Tracker, an encrypted React Native app with 3,822 passing tests.',
    skills: [
      ['Languages', 'TypeScript, JavaScript, SQL, Python, Swift, Kotlin, HTML, CSS'],
      ['Frontend and mobile', 'React, Next.js, Vite, Tailwind CSS, React Native, Expo, EAS Build, iOS Live Activities'],
      ['Backend and cloud', 'Node.js, Express, Firebase, Cloud Functions, Google Cloud Run, Cloud SQL, Vercel'],
      ['Data', 'MySQL, Firestore, SQLite, IndexedDB'],
      ['Testing and tooling', 'Node test runner, Jest, Docker, GitLab CI, GitHub Actions, SonarQube, Git'],
    ],
    jobs: ['tag', 'brag', 'tlc'],
    shortJobs: ['discover', 'abbott', 'kirkland', 'loyola'],
    projects: ['cipher', 'rambler'],
    eduNote: false,
    github: true,
    note: 'For full-stack, mobile and web developer roles.',
    figures: [
      ['3,822', 'tests behind Cipher Tracker'],
      ['228', 'API routes in Census'],
      ['14', 'outside systems integrated'],
      ['716', 'test files behind Census'],
    ],
  },
];

// Values the old Recruiters page used in ?role= links, mapped to current tracks.
export const LEGACY_ROLES = {
  web: 'software',
  dev: 'software',
  manager: 'lead',
  mgmt: 'lead',
  executive: 'main',
  exec: 'main',
};
