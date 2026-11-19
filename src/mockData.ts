import { JobListing } from './types.ts';

export const SAMPLE_JOBS: JobListing[] = [
  // 1. San Francisco, US
  {
    id: 'stripe-sr-fullstack',
    title: 'Senior Full Stack Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    country: 'United States',
    hub: 'San Francisco',
    isRemote: true,
    postedDate: '1 day ago',
    applicantCount: 142,
    department: 'Global Payments & Billing Infrastructure',
    salaryRange: '$185,000 - $240,000 + Equity',
    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Distributed Systems'],
    description: `About the Role:
At Stripe, we're building the financial infrastructure for the internet. As a Senior Full Stack Engineer on the Global Payments team, you will design, build, and operate resilient web applications and high-throughput APIs handling billions of dollars in daily transaction volume.

Key Responsibilities:
- Architect, build, and deploy mission-critical full-stack features using TypeScript, React, Node.js, and PostgreSQL.
- Design low-latency, highly available microservices and REST/GraphQL APIs that interface with banking networks globally.
- Optimize frontend web performance, accessibility, and state management for mission-critical merchant dashboards.
- Collaborate cross-functionally with product managers, designers, and risk analysts to deliver secure, frictionless payment experiences.
- Uphold rigorous engineering standards: automated testing, CI/CD pipelines, distributed tracing, and comprehensive documentation.

Basic Qualifications:
- 5+ years of software engineering experience delivering production web applications.
- Strong proficiency in modern TypeScript, React, and backend services (Node.js, Go, or Ruby).
- Demonstrated experience with relational databases (PostgreSQL, MySQL), query optimization, and schema design.
- Hands-on experience with cloud infrastructure (AWS/GCP), containerization (Docker, Kubernetes), and CI/CD.
- Proven track record of owning features end-to-end, from architecture spec to post-launch observability.

Preferred Qualifications:
- Prior experience in fintech, payment gateways, fraud prevention, or PCI-DSS compliant architectures.
- Experience with Kafka, Redis, distributed transactions, or event-driven systems.
- Strong knowledge of web performance metrics (Core Web Vitals) and browser rendering pipelines.`,
  },

  // 2. London, UK
  {
    id: 'monzo-lead-systems',
    title: 'Staff Distributed Systems Engineer',
    company: 'Monzo Bank',
    location: 'London, United Kingdom',
    country: 'United Kingdom',
    hub: 'London',
    isRemote: true,
    postedDate: '2 days ago',
    applicantCount: 64,
    department: 'Core Banking Ledger & Platform',
    salaryRange: '£125,000 - £165,000 + Options',
    tags: ['Go', 'Microservices', 'Kubernetes', 'Cassandra', 'Distributed Systems'],
    description: `About the Role:
Monzo is making money work for everyone. Our microservices architecture runs over 2,500 individual services written in Go on Kubernetes, processing millions of contactless card transactions and real-time payments across the UK and Europe.

Key Responsibilities:
- Lead the architecture and continuous scaling of Monzo's immutable double-entry core ledger.
- Build high-resilience consensus protocols, event streaming pipelines, and fault-tolerant message buses.
- Partner with security and compliance teams to ensure strict financial auditability and FCA/PRA regulatory requirements.
- Drive platform reliability initiatives, chaos testing, and disaster recovery simulation drills.

Requirements:
- 6+ years experience architecting high-scale distributed systems in Go, Java, or Rust.
- Deep expertise in container orchestration (Kubernetes), gRPC, and service mesh architectures.
- Practical experience with distributed data stores (Cassandra, ScyllaDB, CockroachDB).
- Strong track record of engineering zero-data-loss distributed transactions.`,
  },

  // 3. Bengaluru, India
  {
    id: 'swiggy-principal-ai',
    title: 'Principal Machine Learning Engineer',
    company: 'Swiggy',
    location: 'Bengaluru, India',
    country: 'India',
    hub: 'Bengaluru',
    isRemote: false,
    postedDate: '5 hours ago',
    applicantCount: 195,
    department: 'Logistics AI & Hyperlocal Routing',
    salaryRange: '₹55,00,000 - ₹75,00,000 + ESOPs',
    tags: ['Python', 'PyTorch', 'Reinforcement Learning', 'Graph Neural Networks', 'Distributed Training'],
    description: `About the Role:
Swiggy powers India's leading on-demand hyperlocal delivery ecosystem, executing over 2.5 million daily deliveries across 500+ cities. The Logistics AI team engineers algorithmic dispatch, real-time ETA predictions, and multi-modal fleet routing.

Key Responsibilities:
- Design dynamic dispatch and batching algorithms utilizing deep reinforcement learning and combinatorial optimization.
- Scale real-time spatio-temporal inference engines predicting delivery partner arrival times with sub-minute precision.
- Optimize graph neural networks representing complex road topologies, weather anomalies, and real-time city traffic bottlenecks.
- Mentor a high-caliber team of 12+ research scientists and applied ML engineers.

Requirements:
- 7+ years of machine learning engineering experience in high-velocity production ecosystems.
- Deep expertise with PyTorch, Ray, Horovod, and low-latency C++ model serving (Triton/TensorRT).
- Proven contributions to top-tier algorithmic systems handling high concurrency operations.`,
  },

  // 4. Berlin, Germany
  {
    id: 'zalando-sr-frontend',
    title: 'Senior Frontend Architect',
    company: 'Zalando',
    location: 'Berlin, Germany',
    country: 'Germany',
    hub: 'Berlin',
    isRemote: true,
    postedDate: '1 day ago',
    applicantCount: 48,
    department: 'European Customer Experience',
    salaryRange: '€95,000 - €125,000 + Stock',
    tags: ['TypeScript', 'Next.js', 'Web Performance', 'Micro-frontends', 'Design Systems'],
    description: `About the Role:
Zalando is Europe's leading online platform for fashion and lifestyle, connecting 50+ million active customers across 25 markets. We are seeking a Senior Frontend Architect to elevate our pan-European checkout and discovery web architecture.

Key Responsibilities:
- Steer the technical roadmap for micro-frontend applications serving multi-locale e-commerce experiences.
- Enforce strict Core Web Vitals targets (LCP < 1.2s, CLS < 0.05) across high-traffic localized storefronts.
- Architect modular design system foundations in React and TypeScript with zero-runtime accessibility compliance.
- Drive edge rendering, streaming SSR, and CDN edge worker caching topologies across Cloudflare and AWS.

Requirements:
- 5+ years building large-scale, high-conversion modern web interfaces.
- In-depth mastery of TypeScript, modern React, Next.js, and browser performance profiling.
- Strong understanding of internationalization (i18n), localization, and multi-tenant frontends.`,
  },

  // 5. Singapore
  {
    id: 'grab-lead-backend',
    title: 'Lead Cloud Infrastructure Engineer',
    company: 'Grab',
    location: 'Singapore',
    country: 'Singapore',
    hub: 'Singapore',
    isRemote: false,
    postedDate: '3 days ago',
    applicantCount: 82,
    department: 'Core Financial Services & Superapp Infra',
    salaryRange: 'S$180,000 - S$240,000 + RSUs',
    tags: ['Go', 'Terraform', 'AWS', 'Kubernetes', 'High Throughput'],
    description: `About the Role:
Grab is Southeast Asia's leading superapp, providing everyday services such as mobility, deliveries, and digital financial services to over 35 million monthly active users across 8 countries.

Key Responsibilities:
- Design multi-region cloud infrastructure on AWS and GCP supporting 100k+ peak requests per second.
- Implement automated infrastructure as code (Terraform), secure identity access, and zero-trust mesh networks.
- Architect real-time failover mechanisms and resilient database sharding topologies across APAC data centers.
- Collaborate with engineering teams in Singapore, Seattle, Beijing, and Jakarta to establish SRE standards.

Requirements:
- 6+ years in systems engineering, cloud architecture, and platform engineering.
- Deep hands-on experience with Go, Kubernetes, Terraform, and cloud networking.
- Experience with cross-border latency optimization and multi-cloud resilience.`,
  },

  // 6. Tokyo, Japan
  {
    id: 'line-staff-engineer',
    title: 'Staff Software Engineer - Messaging Platform',
    company: 'LINE Corporation (LY Corp)',
    location: 'Tokyo, Japan',
    country: 'Japan',
    hub: 'Tokyo',
    isRemote: true,
    postedDate: '4 days ago',
    applicantCount: 39,
    department: 'Real-time Messaging & Protocol Core',
    salaryRange: '¥14,000,000 - ¥19,500,000',
    tags: ['Java', 'Kotlin', 'Kafka', 'WebSocket', 'Netty', 'Distributed Systems'],
    description: `About the Role:
LINE connects over 200 million people across Japan, Taiwan, Thailand, and Indonesia with real-time communication, fintech, and digital lifestyle services. The Messaging Platform core handles billions of messages daily with sub-second latency.

Key Responsibilities:
- Architect high-concurrency socket connection managers handling over 50 million concurrent persistent TCP/WebSocket connections.
- Optimize Netty and async I/O pipelines for minimal CPU overhead and deterministic memory allocation.
- Scale Apache Kafka partitions and distributed queueing topologies for instantaneous push notifications.
- Coordinate international protocol standardization across cross-functional engineering teams.

Requirements:
- 7+ years of server-side systems development in Java, Kotlin, or C++.
- Deep expertise in asynchronous networking (Netty, Epoll, WebSockets) and JVM performance tuning.
- Fluent in technical English; Japanese proficiency is a plus but not required.`,
  },

  // 7. Sydney, Australia
  {
    id: 'canva-sr-graphics',
    title: 'Senior Graphics & WebGL Engineer',
    company: 'Canva',
    location: 'Sydney, Australia',
    country: 'Australia',
    hub: 'Sydney',
    isRemote: true,
    postedDate: '12 hours ago',
    applicantCount: 52,
    department: 'Core Visual Rendering Engine',
    salaryRange: 'AU$180,000 - AU$235,000 + Equity',
    tags: ['WebGL', 'WebAssembly', 'TypeScript', 'Shader Programming', 'Computer Graphics'],
    description: `About the Role:
Canva empowers over 170 million people worldwide to design and publish anything. Our web-based rendering engine renders rich vectors, typography, 3D elements, and video compositions entirely inside the browser at 60 FPS.

Key Responsibilities:
- Develop GPU-accelerated rendering pipelines using WebGL 2.0, WebGPU, and WebAssembly (Rust/C++).
- Design precision rasterization shaders, blending modes, color space conversions, and text shaping kernels.
- Benchmark and optimize GPU memory bandwidth, draw calls, and batched vertex buffers for complex canvases.
- Collaborate with product designers and typography experts to guarantee pixel-perfect visual output across all devices.

Requirements:
- 5+ years of software engineering with direct focus on 2D/3D computer graphics and shader programming.
- Deep expertise in TypeScript, WebGL/OpenGL, linear algebra, and memory-constrained performance tuning.
- Passion for empowering millions of visual creators with buttery-smooth interactions.`,
  },

  // 8. Toronto, Canada
  {
    id: 'shopify-staff-backend',
    title: 'Staff Backend Developer - Merchant Core',
    company: 'Shopify',
    location: 'Toronto, Canada',
    country: 'Canada',
    hub: 'Toronto',
    isRemote: true,
    postedDate: '2 days ago',
    applicantCount: 110,
    department: 'High-Volume Merchant Infrastructure',
    salaryRange: 'CAD$190,000 - CAD$250,000 + Stock',
    tags: ['Ruby on Rails', 'Go', 'MySQL', 'Kafka', 'Distributed Systems'],
    description: `About the Role:
Shopify powers over 10% of total US e-commerce and millions of independent merchants globally. During peak events like Black Friday / Cyber Monday, our platform processes over $9.3 billion in merchant sales.

Key Responsibilities:
- Architect highly resilient checkout and order fulfillment primitives capable of absorbing 100k checkout attempts per minute.
- Lead horizontal database sharding initiatives and zero-downtime schema migrations across thousands of MySQL shards.
- Build robust asynchronous job processing fabrics and resilient idempotency mechanisms.
- Drive engineering craft standards and mentor senior engineers across the global merchant organization.

Requirements:
- 6+ years building and maintaining business-critical web backends (Ruby, Go, or Java).
- Expert knowledge of relational database query optimization, locking semantics, and caching topologies.
- Demonstrated success scaling internet-scale applications during massive traffic spikes.`,
  },

  // 9. New York, US
  {
    id: 'figma-sr-frontend',
    title: 'Senior Frontend Engineer - Canvas Core',
    company: 'Figma',
    location: 'New York, NY',
    country: 'United States',
    hub: 'New York',
    isRemote: false,
    postedDate: '2 days ago',
    applicantCount: null, // Volume not specified test case
    department: 'Design Systems & Multiplayer Canvas',
    salaryRange: '$180,000 - $235,000 + Equity',
    tags: ['WebGL', 'WebAssembly', 'TypeScript', 'Canvas Rendering', 'Performance'],
    description: `About Figma:
Figma is where teams design, build, and ship digital products together. Our multiplayer canvas handles millions of vector nodes with instant 60 FPS rendering on the web.

Responsibilities:
- Develop rendering features and spatial interaction algorithms for Figma's high-performance 2D canvas.
- Work across WebGL, WebAssembly (C++/Rust), and TypeScript to maintain 60 FPS responsiveness during complex document edits.
- Architect clean, reactive data stores that support real-time operational transform and CRDT synchronization.
- Benchmark and profile memory usage, garbage collection pauses, and GPU buffer management.

Requirements:
- 5+ years of software engineering experience focusing on frontend performance, graphics, or complex web applications.
- Strong knowledge of computer graphics fundamentals (transformation matrices, shaders, spatial indexing).
- Deep experience in TypeScript and modern JavaScript internals.`,
  },

  // 10. Worldwide Remote
  {
    id: 'gitbook-sr-fullstack',
    title: 'Senior Product Engineer',
    company: 'GitBook',
    location: 'Worldwide Remote',
    country: 'Worldwide Remote',
    hub: 'Remote Worldwide',
    isRemote: true,
    postedDate: '8 hours ago',
    applicantCount: 31,
    department: 'Knowledge Sync & Developer Core',
    salaryRange: '$150,000 - $190,000 + Equity',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'CRDTs'],
    description: `About the Role:
GitBook is building the knowledge platform for technical teams. Used by over 5 million developers, GitBook connects code repositories, documentation, and API references in a collaborative, lightning-fast workspace.

Responsibilities:
- Build rich collaborative editing experiences leveraging real-time CRDT algorithms and modern React.
- Design elegant, accessible developer tooling interfaces with sub-millisecond interaction feedback.
- Ship high-throughput synchronization APIs connecting Git providers (GitHub, GitLab) with GitBook spaces.
- Participate in shaping product direction, engineering standards, and remote-first team culture.

Requirements:
- 5+ years of full-stack product engineering experience.
- Deep proficiency with modern TypeScript, React, and server-side TypeScript.
- Strong eye for typography, interaction polish, and user experience craft.`,
  },

  // 11. San Francisco, US
  {
    id: 'linear-staff-ml',
    title: 'Staff Machine Learning Engineer',
    company: 'Linear',
    location: 'San Francisco, CA',
    country: 'United States',
    hub: 'San Francisco',
    isRemote: true,
    postedDate: '3 days ago',
    applicantCount: 88,
    department: 'Product Intelligence & Search',
    salaryRange: '$210,000 - $275,000 + Equity',
    tags: ['Python', 'PyTorch', 'Vector Search', 'LLMs', 'TypeScript'],
    description: `About the Role:
Linear is rebuilding modern software development tools with uncompromising craft, speed, and elegance. We are looking for a Staff Machine Learning Engineer to lead our Product Intelligence initiatives, empowering thousands of fast-moving product teams with instant issue triage, semantic search, and contextual code synthesis.

Key Responsibilities:
- Design and deploy state-of-the-art embedding pipelines and vector similarity search across millions of engineering issues and git commits.
- Fine-tune and evaluate open-source and proprietary Large Language Models (LLMs) for task categorization, duplicate detection, and automated PR summaries.
- Build low-latency ML inference infrastructure capable of sub-50ms query responses at scale.
- Collaborate with frontend engineers to integrate intelligent recommendations seamlessly into our desktop and web apps.

Requirements:
- 6+ years of software and machine learning engineering experience in production.
- Deep expertise with Python, PyTorch, Hugging Face transformers, and vector databases (Pinecone, Qdrant, or pgvector).
- Experience productionizing RAG (Retrieval-Augmented Generation) architectures and prompt evaluation frameworks.
- Strong engineering fundamentals: distributed systems, caching strategies, and API design.`,
  },

  // 12. Worldwide Remote / Zurich, Switzerland
  {
    id: 'proton-sr-security',
    title: 'Senior Cryptographic Systems Engineer',
    company: 'Proton',
    location: 'Zurich, Switzerland • Worldwide Remote',
    country: 'Switzerland',
    hub: 'Zurich',
    isRemote: true,
    postedDate: '1 day ago',
    applicantCount: 76,
    department: 'End-to-End Encryption & Privacy Protocol',
    salaryRange: 'CHF 155,000 - CHF 195,000',
    tags: ['Rust', 'Cryptography', 'Go', 'Zero-Knowledge', 'WebCrypto'],
    description: `About Proton:
Proton was founded by scientists who met at CERN in 2014 to build an internet where privacy is the default. Today, over 100 million people and businesses rely on Proton Mail, Drive, Pass, and VPN to protect their confidential data.

Responsibilities:
- Implement end-to-end cryptographic protocols in Rust and WebAssembly deployed across web and native clients.
- Audit zero-knowledge proof implementations and elliptic curve operations for constant-time execution and side-channel immunity.
- Work with open-source cryptographic maintainers to standardize forward-secret messaging primitives.
- Collaborate with independent security researchers during external audits and formal protocol verifications.

Requirements:
- 5+ years of software engineering with strong foundation in applied cryptography.
- High proficiency in Rust or modern C++, with deep knowledge of memory safety and CPU timing attacks.
- Strong dedication to privacy, open-source software, and civil liberties online.`,
  },
];

export const SAMPLE_RESUME_TEXT = `ALEX RIVERA
San Francisco, CA • alex.rivera@email.com • (555) 234-5678 • linkedin.com/in/alexrivera-dev • github.com/arivera-code

PROFESSIONAL SUMMARY
Senior Full-Stack Software Engineer with 6+ years of experience engineering high-performance web applications, resilient distributed systems, and real-time APIs. Adept at modern TypeScript, React, Node.js, and PostgreSQL. Spearheaded payments integration and cloud migration for high-growth SaaS platforms, boosting transaction throughput by 40% while cutting latency.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3/Tailwind
Frameworks & Libraries: React, Next.js, Node.js, Express, Redux Toolkit, React Query, GraphQL
Databases & Caching: PostgreSQL, Redis, MongoDB, MySQL
Cloud & DevOps: AWS (EC2, S3, RDS, Lambda), Docker, GitHub Actions, CI/CD, Terraform
Architecture: RESTful APIs, Microservices, Event-Driven Architecture, Unit/E2E Testing (Jest, Playwright)

PROFESSIONAL EXPERIENCE

Senior Full-Stack Engineer | Apex Financial Technologies | 2022 - Present
- Architected and shipped core checkout modules handling over 250,000 daily transactions with 99.98% uptime.
- Worked on redesigning our customer billing portal using React, TypeScript, and Tailwind CSS, improving user satisfaction.
- Built backend payment microservices in Node.js and PostgreSQL to connect with Stripe, Adyen, and ACH providers.
- Helped optimize database queries and added Redis caching to speed up merchant dashboard load times.
- Participated in weekly code reviews and mentored 3 junior software engineers on React component architecture and state management.

Full-Stack Software Engineer | CloudVibe Systems | 2019 - 2022
- Developed customer-facing web applications using React, Redux, and Express serving 500k+ monthly active users.
- Migrated legacy monolithic services into modular Docker containers deployed on AWS ECS.
- Created automated CI/CD pipelines using GitHub Actions, decreasing deployment cycle times from 45 minutes to 8 minutes.
- Integrated third-party analytics and error tracking with Sentry and Datadog to identify production bottlenecks.

Software Engineer Intern | Innovate Labs | 2018 - 2019
- Built internal analytics dashboards with React and Chart.js to visualize daily user signups and retention metrics.
- Wrote automated unit tests with Jest, increasing test coverage from 55% to 82%.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2015 - 2019`;
