export const profile = {
  name: 'Soham Kubal',
  title: 'Performance Test Engineer',
  email: 'sohamk185@gmail.com',
  phone: '8767245886',
  location: 'Mumbai, India',
  github: 'https://github.com/soham-kubal',
  summary:
    'Performance Test Engineer with 5+ years of experience in performance engineering, load testing, and test automation for large-scale enterprise applications. Specialized in designing modular JMeter frameworks, building Python-based automation pipelines for JMX test plan management and Excel reporting, and diagnosing production bottlenecks through end-to-end transaction tracing using Azure Application Insights, AppDynamics, and New Relic. Proven track record of reducing manual testing effort through framework engineering, AI-assisted development, and reusable tooling. Skilled at translating performance metrics into actionable insights for stakeholders using Grafana, Power BI, and automated Excel reports.',
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
      'Architected a reusable, modular JMeter "Super Script" framework consolidating 17+ individual test plans into a unified, maintainable structure — reducing script maintenance effort by 80%.',
      'Built a Python automation framework (lxml, openpyxl) with 15+ CLI tools for JMX manipulation — including TC renumbering, JMX flattening, hashTree validation, HAR-to-JMX conversion, and disabled element removal — eliminating 60 hours of manual XML editing per release cycle.',
      'Developed an automated Excel performance reporting pipeline that processes JMeter aggregate CSVs, generates formatted multi-run comparison sheets, and produces PROD performance statistics with median/percentile analysis.',
      'Used Azure Application Insights to trace end-to-end transactions across microservices, identifying 21 stored procedure and backend issues/bugs by correlating dependency telemetry with application logs.',
      'Implemented dynamic CSV test data rotation using Groovy in JMeter tearDown, enabling continuous multi-run execution across 100 virtual users without manual data reset.',
      'Leveraged GitHub Copilot to accelerate Python script development and automate repetitive coding tasks, reducing development time by 75%.',
      'Integrated InfluxDB and Grafana for real-time JMeter test monitoring, building custom dashboards for live response time, throughput, and error rate visualization.',
      'Automated API test suite execution and report generation using Postman and Newman, integrating 13+ collections for continuous regression validation.',
      'Conducted performance test execution across 4 environments (STG, UAT, PROD) covering multiple modules for our web app.',
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
      'Led performance testing for the FedEx GSI project using JMeter and ReadyAPI, designing and executing load, stress, and scalability tests across UI, API, and database layers.',
      'Designed load test scenarios simulating 1200 concurrent users of real-world traffic patterns, identifying critical performance thresholds that led to 3 infrastructure scaling decisions.',
      'Automated functional and regression API testing using ReadyAPI, building 30+ test suites that improved test coverage by 91% and reduced regression cycle time from 4 days to 7 hours.',
      'Utilized LoadRunner for performance and functional testing of a complex UI application and associated Oracle/SQL databases under 150–200 concurrent user load.',
      'Monitored server-side performance using AppDynamics, correlating application tier metrics with database response times to identify 24+ bottlenecks across 36 releases.',
      'Analyzed LoadRunner and JMeter reports to identify memory leaks, connection pool exhaustion, and slow SQL queries, collaborating with development teams on 16+ performance fixes.',
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
  {
    degree: 'HSC',
    school: 'U.B.S Junior College',
    dates: '2016',
    details: ['Promoted with 73.5%'],
  },
  {
    degree: 'SSC',
    school: 'N.E.S High School',
    dates: '2014',
    details: ['Distinction with 92.4%'],
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
      'Percentile Analysis',
      'Workload Modeling',
      'Test Data Management',
    ],
  },
  {
    group: 'API Testing',
    items: ['Postman', 'Newman', 'ReadyAPI (SoapUI)', 'REST/SOAP API Validation'],
  },
  {
    group: 'Monitoring & Diagnostics',
    items: [
      'Azure Application Insights (E2E Transaction Tracing)',
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
    items: ['Grafana', 'InfluxDB', 'Power BI', 'Excel Automation (openpyxl)', 'CSV/JTL Aggregate Processing'],
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
