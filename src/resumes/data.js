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
    title: 'Senior Audio Visual Engineer',
    company: 'The Aspen Group (TAG)',
    place: 'Chicago, IL',
    start: '2025-09',
    end: null,
    bullets: {
      main: [
        'Built Census, the platform TAG tracks all 48,243 of its IT assets in; it reconciles 14 outside systems into one record per asset, and 36 people use it each week.',
        'Designed the onboarding, shipping, returns and chargeback processes Census runs, and automated enough of them to give the team back about 314 hours a month.',
        'Wrote Census in React 19 and TypeScript with an Express gateway, MySQL on Cloud SQL and nightly jobs on Google Cloud Run: 228 API routes, 716 test files.',
        'Started Census in January 2026 and moved the team onto it fully that October, when 11,942 changes went through it.',
        'Upgraded four 20+ person meeting rooms to Neat and rebuilt the boardroom from Crestron and Q-SYS to Neat and Q-SYS with 360-degree cameras.',
        'Repaired and upgraded six divisible Q-SYS and Crestron training rooms that hold 120+ people.',
        'Support 88+ Logitech meeting rooms across the TAG network and handle AV and endpoint problems for the C-Suite directly.',
        "Train TAG's five-person IT team in AV and administer Microsoft Intune, Jamf, ServiceNow and Entra ID.",
      ],
      av: [
        'Upgraded four 20+ person meeting rooms to Neat and moved the boardroom from Crestron and Q-SYS to a full Neat and Q-SYS system with 360-degree cameras.',
        'Repaired and upgraded six divisible Q-SYS and Crestron training rooms that hold 120+ people.',
        'Support 88+ Logitech meeting rooms across the TAG network as one half of a two-person AV team.',
        'Handle AV, endpoint and connectivity problems for the C-Suite directly, often while the meeting waits.',
        'Train and technically lead the whole five-person IT team in AV.',
      ],
      asset: [
        "Designed TAG's asset processes for onboarding, shipping, returns and monthly chargebacks, then built Census to run them.",
        'Brought 14 outside systems, including Intune, Jamf, CrowdStrike and ServiceNow, into one record per device and cataloged all 48,243 assets.',
        'Automated FedEx labels from each checkout, chargebacks and other routine work, worth about 314 hours a month at per-task times the team agreed on.',
        'Connected SHI orders to an onboarding queue that took in 910 assets in its first two weeks.',
        'Built nightly checks that raise, route and auto-close flags wherever two systems disagree about a device.',
        'Rolled Census out to the 36 people who use it each week; 11,942 changes went through it in October 2026.',
      ],
      lead: [
        "Train and technically lead TAG's five-person IT team in AV, including escalation paths and system standards.",
        'Ran the room upgrades: four Neat meeting rooms, a Neat and Q-SYS boardroom, and six divisible training rooms for 120+ people.',
        'Designed the IT asset processes, then built and rolled out Census: 36 people use it each week, and it gives back about 314 hours a month.',
        "Support TAG's C-Suite and other executives directly on AV, endpoints and connectivity.",
      ],
      software: [
        'Built Census, a React 19 and TypeScript platform with an Express gateway, MySQL on Cloud SQL and scheduled jobs on Google Cloud Run.',
        'Integrated 14 outside systems, including Intune, Jamf, ServiceNow and FedEx, into one record per device across 48,243 assets.',
        'Added Microsoft Entra ID sign-in so every change is recorded under the name of the person who made it.',
        'Moved 41 read surfaces from REST API calls to direct SQL; one report fell from 19.5 minutes to 1.3 seconds.',
        'Cleared all 43 SonarQube blocker and critical findings; the GitLab pipeline runs the 716 test files on every push.',
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
        'Ran break/fix for a Microsoft Teams estate of 568+ meeting rooms at six sites in the US and abroad.',
        'Led and mentored a team of five Level 1 technicians.',
        'Installed and programmed Crestron, Q-SYS and Biamp systems and the networking behind them.',
        'Built a room-check app that replaced the manual round, plus an inventory tool, in Power Apps, Power Automate and Power BI.',
      ],
      av: [
        'Ran break/fix for a Microsoft Teams estate of 568+ meeting rooms at six sites in the US and abroad.',
        'Installed and programmed Crestron, Q-SYS and Biamp systems and the networking behind them.',
        'Monitored equipment health in Crestron Toolbox, Q-SYS Designer and Biamp Tesira.',
      ],
      asset: [
        'Built a room-check app that replaced the manual round, plus an inventory tool, in Power Apps, Power Automate and Power BI.',
        'Supported 568+ meeting rooms across six locations in the US and abroad.',
        'Led and mentored a team of five Level 1 technicians.',
      ],
      lead: [
        'Led and mentored a team of five Level 1 technicians.',
        'Balanced break/fix across 568+ meeting rooms at six locations against installation and programming projects.',
        'Built the team a room-check app and an inventory tool in Power Apps and Power BI.',
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
        'Serviced Cisco rooms at five Chicago-area sites, 160+ in all, fitted with Biamp, QSC, Shure and ClickShare.',
        'Monitored room health in Crestron XiO, Q-SYS Designer, Vyopta and ThousandEyes to catch faults before users reported them.',
        'Tracked AV assets against the ServiceNow CMDB to keep inventory records accurate.',
      ],
      av: [
        'Serviced Cisco rooms at five Chicago-area sites, 160+ in all, fitted with Biamp, QSC, Shure, Sennheiser and ClearOne.',
        'Used Crestron XiO, Vyopta, ThousandEyes and Webex Control Hub to spot faults before users reported them.',
      ],
      asset: [
        'Tracked AV assets across five Chicago-area sites against the ServiceNow CMDB to keep inventory records accurate.',
        'Set up room checks in Power Apps that reported to a Power BI dashboard.',
      ],
      lead: [
        'Worked with stakeholders to configure and integrate Accruent EMS so event scheduling matched how teams booked rooms.',
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
        'Configured Cisco and Crestron systems with Shure microphones for about 144 meeting rooms in one building.',
        'Removed a manual step that caused errors by writing Excel VBA macros for data transfers and room testing.',
      ],
      av: [
        'Configured Cisco and Crestron systems with Shure microphones for about 144 meeting rooms in one building.',
        'Set up rooms for client meetings on Zoom, Microsoft Teams and Webex at a firm that bills by the hour.',
      ],
      asset: [
        'Removed a manual step that caused errors by writing Excel VBA macros for data transfers and room testing.',
      ],
      lead: [
        'Led staff demonstrations of new Excel and Office features that raised adoption.',
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
        'Ran AV for six or seven campus events a week on analog mixers, Crestron systems and projectors.',
        'Configured and troubleshot Microsoft Teams and Zoom for video conferencing across campus.',
      ],
      av: [
        'Ran AV for six or seven campus events a week on analog mixers, Crestron systems and projectors.',
        'Worked with IT Services on maintenance and upgrades, and supported Teams and Zoom across campus.',
      ],
      asset: [
        'Maintained campus AV equipment with IT Services while running six or seven events a week.',
      ],
      lead: [
        'Ran AV for six or seven campus events a week, coordinating with IT Services on maintenance and upgrades.',
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
        'Ran user-testing sessions; their feedback led to UI changes.',
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
    text: 'React Native health tracker for iOS and Android that encrypts every entry on the phone with AES-256, so the server only holds ciphertext. Lock-screen timers in Swift and Kotlin, 3,822 passing tests. In App Store preparation.',
  },
  rambler: {
    name: 'Rambler Registrar',
    link: 'www.ramblerregistrar.com',
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
    summary: 'AV and software engineer with a Computer Science degree. Designed and built Census, the platform that tracks all 48,243 IT assets at The Aspen Group and saves its team about 314 hours a month. In AV since 2021, now supporting 88+ Logitech rooms.',
    skills: [
      ['AV', 'Q-SYS, Crestron, Neat, Logitech, Biamp Tesira, Shure, Cisco, Microsoft Teams, Zoom, Webex'],
      ['IT and endpoints', 'Microsoft Intune, Jamf, Microsoft Entra ID (Azure Active Directory), ServiceNow'],
      ['Software', 'TypeScript, JavaScript, React, React Native, Expo, Node.js, Express, SQL'],
      ['Cloud and data', 'Google Cloud Run, Cloud SQL (MySQL), Firebase, Firestore, Docker, GitLab CI'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola', 'brag', 'tlc'],
    shortJobs: [],
    projects: ['cipher', 'rambler', 'papertrail'],
    eduNote: true,
    github: false,
    note: 'Two pages covering the AV work and the software, for jobs that need both.',
    figures: [
      ['48,243', 'assets cataloged in Census'],
      ['314', 'hours a month saved, by team estimate'],
      ['88+', 'Logitech rooms supported at TAG'],
      ['568+', 'rooms covered at Discover'],
    ],
  },
  {
    key: 'av',
    label: 'AV Engineer',
    headline: 'AV Engineer',
    file: 'John_Geddes_Resume_AV_Engineer',
    pages: 1,
    summary: 'AV engineer working since 2021 in corporate, legal, healthcare and university settings. Supports 88+ Logitech rooms at The Aspen Group and has upgraded training rooms there that seat 120+.',
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
    summary: "IT asset manager who built The Aspen Group's asset processes and Census, the tool that runs them, then cataloged all 48,243 assets in it. Census automations save the team about 314 hours a month.",
    skills: [
      ['IT asset management', 'ServiceNow CMDB (configuration management database), asset lifecycle, onboarding, shipping, returns, chargebacks'],
      ['Endpoint management', 'Microsoft Intune, Jamf, Microsoft Entra ID, CrowdStrike, Apple Business Manager'],
      ['Logistics and procurement', 'FedEx shipping, SHI orders, Dell and Lenovo warranty lookups'],
      ['Reporting and automation', 'SQL, Power BI, Power Apps, Power Automate, scheduled jobs'],
      ['Development', 'TypeScript, React, Express, MySQL, Google Cloud Run'],
    ],
    jobs: ['tag', 'discover', 'abbott', 'kirkland', 'loyola'],
    shortJobs: [],
    projects: [],
    eduNote: true,
    github: false,
    note: 'For IT asset management (ITAM) and CMDB roles.',
    figures: [
      ['48,243', 'assets cataloged'],
      ['14', 'outside systems connected'],
      ['910', 'assets onboarded in two weeks'],
      ['314', 'hours a month saved, by team estimate'],
    ],
  },
  {
    key: 'lead',
    label: 'Technical Lead',
    headline: 'Technical Lead / IT Manager',
    file: 'John_Geddes_Resume_Technical_Lead',
    pages: 1,
    summary: "Technical lead who mentored five Level 1 technicians at Discover and now trains The Aspen Group's five-person IT team in AV. Built the asset platform 36 people there use each week.",
    skills: [
      ['Leadership', 'AV training for a five-person IT team, mentoring Level 1 technicians, escalation paths, system standards'],
      ['Delivery', 'Neat and Q-SYS room upgrades, asset process design, Census rollout, Accruent EMS, ServiceNow'],
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
    summary: 'Full-stack and mobile engineer with a Computer Science degree. Built Census, the asset platform in daily use at The Aspen Group, and Cipher Tracker, an encrypted React Native app with 3,822 passing tests.',
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
