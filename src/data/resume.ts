export type Profile = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  github: string
  /** Condensed 3-bullet summary — replaces the old single-paragraph summary. */
  summaryBullets: string[]
}

export const profile: Profile = {
  name: 'Soham Kubal',
  title: 'Performance Test Engineer',
  email: 'sohamk185@gmail.com',
  phone: '8767245886',
  location: 'Mumbai, India',
  github: 'https://github.com/soham-kubal',
  summaryBullets: [
    'Performance Test Engineer with 5+ years of experience in performance engineering, load testing, and test automation for large-scale enterprise applications.',
    'Specialized in designing modular JMeter frameworks, building Python-based automation pipelines for JMX management, and diagnosing production bottlenecks using Azure Application Insights, AppDynamics, and New Relic.',
    'Proven track record of reducing manual testing effort through framework engineering, AI-assisted development, and translating metrics into actionable insights using Grafana and Power BI.',
  ],
}

export const highlights = [
  { value: '5+', label: 'Years in performance engineering' },
  { value: '80%', label: 'Script maintenance effort reduced' },
  { value: '60 hrs', label: 'Manual XML editing saved per release' },
  { value: '1200', label: 'Concurrent users load-tested' },
]

export type ExperienceEntry = {
  role: string
  company: string
  dates: string
  location: string
  bullets: string[]
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Performance Tester',
    company: 'MUFG Pension & Market Services',
    dates: '12/2024 – Present',
    location: 'Mumbai',
    bullets: [
      'Architected a reusable, modular JMeter "Super Script" framework consolidating 17+ individual test plans into a unified structure, reducing script maintenance effort by 80%.',
      'Implemented automated UI and API testing frameworks, page object models, and web scrapers utilizing Selenium Java, Playwright, and Python to expand regression coverage.',
      'Built a Python automation framework (lxml, openpyxl) with 15+ CLI tools for JMX manipulation, eliminating 60 hours of manual XML editing per release cycle.',
      'Developed an automated Excel performance reporting pipeline processing JMeter aggregate CSVs for multi-run comparison and PROD performance statistics.',
      'Traced end-to-end transactions across microservices using Azure Application Insights, identifying 21 stored procedure and backend issues.',
      'Implemented dynamic CSV test data rotation using Groovy in JMeter tearDown for continuous execution across 100 virtual users.',
      'Leveraged GitHub Copilot to accelerate Python script development by 75%.',
      'Integrated InfluxDB and Grafana for real-time JMeter test monitoring and live dashboards.',
      'Automated API test suite execution and report generation using Postman and Newman across 13+ collections.',
      'Conducted performance test execution across STG, UAT, and PROD environments.',
    ],
  },
  {
    role: 'Quality Engineering Analyst',
    company: 'Accenture',
    dates: '08/2024 – 11/2024',
    location: 'Mumbai',
    bullets: [
      'Managed seamless transition of FedEx GSI performance testing responsibilities from Atos Syntel to Accenture, ensuring zero disruption to ongoing test cycles.',
    ],
  },
  {
    role: 'Performance Test Engineer',
    company: 'Atos Syntel',
    dates: '03/2021 – 07/2024',
    location: 'Mumbai',
    bullets: [
      'Led performance testing for the FedEx GSI project using JMeter and ReadyAPI, executing load, stress, and scalability tests across UI, API, and DB layers.',
      'Designed load test scenarios simulating 1200 concurrent users, identifying critical thresholds leading to 3 infrastructure scaling decisions.',
      'Automated functional and regression API testing using ReadyAPI, building 30+ test suites that improved coverage by 91% and reduced cycle time from 4 days to 7 hours.',
      'Utilized LoadRunner for testing a complex UI application and Oracle/SQL databases under 150–200 user load.',
      'Monitored server-side performance using AppDynamics, identifying 24+ bottlenecks across 36 releases.',
      'Analyzed LoadRunner and JMeter reports to resolve memory leaks and slow SQL queries, collaborating on 16+ performance fixes.',
    ],
  },
]

export type EducationEntry = {
  degree: string
  school: string
  dates: string
  details: string[]
}

export const education: EducationEntry[] = [
  {
    degree: 'B.E. Computer Engineering',
    school: 'Mumbai University',
    dates: '2016 – 2020',
    details: ['Semester VIII CGPA: 9.58', 'Overall (all semesters) CGPA: 7.39'],
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Automation & Scripting',
    items: ['Java', 'C', 'Groovy', 'JavaScript', 'Python', 'Selenium', 'Playwright', 'Apache POI'],
  },
  {
    group: 'Performance Testing',
    items: [
      'JMeter',
      'LoadRunner',
      'Load / Stress / Scalability / Soak Testing',
      'Baseline Analysis',
      'Workload Modeling',
    ],
  },
  {
    group: 'API Testing',
    items: ['Postman', 'Newman', 'ReadyAPI (SoapUI)', 'REST/SOAP API Validation'],
  },
  {
    group: 'Monitoring & Diagnostics',
    items: [
      'Azure Application Insights',
      'New Relic',
      'AppDynamics',
      'Heap Dump & GC Analysis',
    ],
  },
  {
    group: 'AI & Productivity',
    items: ['GitHub Copilot', 'Prompt Engineering', 'AI-Assisted Test Development'],
  },
  {
    group: 'CI/CD & Version Control',
    items: ['Jenkins', 'GitHub', 'Newman CLI Integration'],
  },
  {
    group: 'Data & Reporting',
    items: ['Grafana', 'InfluxDB', 'Power BI', 'Excel Automation (openpyxl)', 'CSV/JTL Processing'],
  },
]

export type Project = {
  title: string
  description: string
  tags: string[]
  link?: { label: string; href: string }
}

export const projects: Project[] = [
  {
    title: 'JMeter "Super Script" Framework',
    description:
      'A reusable, modular JMeter framework consolidating 17+ individual test plans into a single maintainable structure — cutting script maintenance effort by 80% across releases.',
    tags: ['JMeter', 'Groovy', 'Framework Design'],
  },
  {
    title: 'Python JMX Automation CLI Toolkit',
    description:
      '15+ command-line tools (built with lxml and openpyxl) for JMX manipulation — test-case renumbering, JMX flattening, hashTree validation, HAR-to-JMX conversion, and disabled-element removal — eliminating ~60 hours of manual XML editing per release cycle.',
    tags: ['Python', 'lxml', 'openpyxl', 'CLI'],
  },
  {
    title: 'Automated Excel Performance Reporting Pipeline',
    description:
      'Processes JMeter aggregate CSVs into formatted multi-run comparison sheets and PROD performance statistics with median/percentile analysis — turning raw JTL/CSV output into stakeholder-ready reports.',
    tags: ['Python', 'openpyxl', 'Reporting'],
  },
  {
    title: 'Grafana + InfluxDB Real-Time Monitoring',
    description:
      'Live JMeter test monitoring via InfluxDB and Grafana, with custom dashboards for response time, throughput, and error-rate visualization during test execution.',
    tags: ['Grafana', 'InfluxDB', 'Observability'],
  },
  {
    title: 'React-Spring-Project',
    description: 'An early React + react-spring animation experiment from university coursework.',
    tags: ['React', 'JavaScript'],
    link: { label: 'View on GitHub', href: 'https://github.com/soham-kubal/React-Spring-Project' },
  },
]
