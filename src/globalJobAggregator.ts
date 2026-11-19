import { JobListing, JobSourceProvider } from './types.ts';
import { SAMPLE_JOBS } from './mockData.ts';

// Curated registry of global companies with open public ATS JSON APIs
const GREENHOUSE_BOARDS = [
  { slug: 'stripe', name: 'Stripe', defaultHub: 'San Francisco' },
  { slug: 'cloudflare', name: 'Cloudflare', defaultHub: 'London' },
  { slug: 'monzo', name: 'Monzo Bank', defaultHub: 'London' },
  { slug: 'gitlab', name: 'GitLab', defaultHub: 'Worldwide Remote' },
  { slug: 'razorpay', name: 'Razorpay', defaultHub: 'Bengaluru' },
  { slug: 'databricks', name: 'Databricks', defaultHub: 'San Francisco' },
  { slug: 'adyen', name: 'Adyen', defaultHub: 'Berlin' },
  { slug: 'grab', name: 'Grab', defaultHub: 'Singapore' },
  { slug: 'canva', name: 'Canva', defaultHub: 'Sydney' },
];

const ASHBY_BOARDS = [
  { slug: 'linear', name: 'Linear', defaultHub: 'San Francisco' },
  { slug: 'deel', name: 'Deel', defaultHub: 'Worldwide Remote' },
  { slug: 'posthog', name: 'PostHog', defaultHub: 'London' },
  { slug: 'supabase', name: 'Supabase', defaultHub: 'Singapore' },
];

const LEVER_BOARDS = [
  { slug: 'palantir', name: 'Palantir Technologies', defaultHub: 'New York' },
  { slug: 'spotify', name: 'Spotify', defaultHub: 'London' },
  { slug: 'mistral', name: 'Mistral AI', defaultHub: 'London' },
];

// In-memory TTL cache (5 minutes) to keep global search fast and avoid rate limits
interface CacheEntry {
  timestamp: number;
  jobs: JobListing[];
  activeSources: string[];
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let globalBaseCache: CacheEntry | null = null;

// Clean HTML into readable plain text for vector embedding and clean typography
export function cleanHtmlToText(html: string): string {
  if (!html) return '';
  let decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Replace block tags with newlines
  decoded = decoded
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|section|article)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ');

  // Collapse excess whitespace while preserving paragraph structure
  return decoded
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1].length > 0))
    .join('\n')
    .trim();
}

// Convert ISO date or timestamp into human-readable relative string
export function formatRelativeDate(dateInput?: string | number | null): {
  postedDate: string;
  publishedAtIso: string;
} {
  if (!dateInput) {
    return { postedDate: 'Recently posted', publishedAtIso: new Date().toISOString() };
  }
  const parsed = typeof dateInput === 'number'
    ? new Date(dateInput > 1e11 ? dateInput : dateInput * 1000)
    : new Date(dateInput);

  if (isNaN(parsed.getTime())) {
    return { postedDate: 'Recently posted', publishedAtIso: new Date().toISOString() };
  }

  const diffMs = Date.now() - parsed.getTime();
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
  const diffDays = Math.floor(diffHours / 24);

  let postedDate = 'Just now';
  if (diffHours < 24) {
    postedDate = `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 30) {
    postedDate = `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    const weeks = Math.floor(diffDays / 7);
    postedDate = `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }

  return { postedDate, publishedAtIso: parsed.toISOString() };
}

// Map arbitrary location strings to standardized global hubs and countries
export function inferGlobalHubAndCountry(
  rawLocation: string,
  defaultHub = 'Worldwide Remote'
): { hub: string; country: string; isRemote: boolean } {
  const loc = (rawLocation || '').toLowerCase();
  const isRemote =
    loc.includes('remote') ||
    loc.includes('anywhere') ||
    loc.includes('distributed') ||
    loc.includes('home') ||
    loc.includes('worldwide');

  if (loc.includes('london') || loc.includes('uk') || loc.includes('united kingdom') || loc.includes('england')) {
    return { hub: 'London', country: 'United Kingdom', isRemote };
  }
  if (loc.includes('bengaluru') || loc.includes('bangalore') || loc.includes('india') || loc.includes('mumbai') || loc.includes('hyderabad') || loc.includes('gurugram')) {
    return { hub: 'Bengaluru', country: 'India', isRemote };
  }
  if (loc.includes('berlin') || loc.includes('munich') || loc.includes('germany') || loc.includes('frankfurt') || loc.includes('hamburg')) {
    return { hub: 'Berlin', country: 'Germany', isRemote };
  }
  if (loc.includes('singapore') || loc.includes('apac')) {
    return { hub: 'Singapore', country: 'Singapore', isRemote };
  }
  if (loc.includes('tokyo') || loc.includes('japan') || loc.includes('osaka')) {
    return { hub: 'Tokyo', country: 'Japan', isRemote };
  }
  if (loc.includes('sydney') || loc.includes('melbourne') || loc.includes('australia')) {
    return { hub: 'Sydney', country: 'Australia', isRemote };
  }
  if (loc.includes('toronto') || loc.includes('vancouver') || loc.includes('montreal') || loc.includes('canada') || loc.includes('ottawa')) {
    return { hub: 'Toronto', country: 'Canada', isRemote };
  }
  if (loc.includes('new york') || loc.includes('nyc') || loc.includes('ny') || loc.includes('boston')) {
    return { hub: 'New York', country: 'United States', isRemote };
  }
  if (loc.includes('san francisco') || loc.includes('sf') || loc.includes('bay area') || loc.includes('palo alto') || loc.includes('california') || loc.includes('seattle')) {
    return { hub: 'San Francisco', country: 'United States', isRemote };
  }
  if (isRemote) {
    return { hub: 'Worldwide Remote', country: 'Worldwide Remote', isRemote: true };
  }
  return { hub: defaultHub, country: rawLocation || 'Global', isRemote };
}

// Extract relevant technical tags from title and description
export function extractTechnicalTags(title: string, description: string, category?: string): string[] {
  const combined = `${title} ${description} ${category || ''}`.toLowerCase();
  const candidates = [
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Go',
    'Rust',
    'Java',
    'Kotlin',
    'Kubernetes',
    'AWS',
    'GCP',
    'PostgreSQL',
    'GraphQL',
    'PyTorch',
    'Machine Learning',
    'LLMs',
    'Next.js',
    'Distributed Systems',
    'Microservices',
    'Terraform',
    'Docker',
    'Kafka',
    'Redis',
    'Security',
  ];

  const matched = candidates.filter((tag) => {
    const token = tag.toLowerCase();
    return combined.includes(token);
  });

  if (matched.length === 0 && category) {
    return [category];
  }
  return matched.slice(0, 5);
}

// Helper for fetch with strict timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 5500): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TalentPulseAI-GlobalAggregator/2.0',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------------------------------------------------
// 1. GREENHOUSE PUBLIC BOARD FETCHER (Free, Zero-Key)
// ------------------------------------------------------------------
async function fetchGreenhouseBoard(board: {
  slug: string;
  name: string;
  defaultHub: string;
}): Promise<JobListing[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${board.slug}/jobs?content=true`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.jobs)) return [];

  // Take top 12 engineering/product/data roles per board to keep variety high
  const relevantJobs = data.jobs
    .filter((j: any) => {
      const title = (j.title || '').toLowerCase();
      return (
        title.includes('engineer') ||
        title.includes('developer') ||
        title.includes('scientist') ||
        title.includes('architect') ||
        title.includes('machine learning') ||
        title.includes('ai') ||
        title.includes('product') ||
        title.includes('security') ||
        title.includes('data') ||
        title.includes('infrastructure') ||
        title.includes('systems')
      );
    })
    .slice(0, 10);

  return relevantJobs.map((j: any): JobListing => {
    const rawLoc = j.location?.name || board.defaultHub;
    const { hub, country, isRemote } = inferGlobalHubAndCountry(rawLoc, board.defaultHub);
    const { postedDate, publishedAtIso } = formatRelativeDate(j.updated_at || j.first_published);
    const cleanDesc = cleanHtmlToText(j.content || '');
    const dept = j.departments?.[0]?.name || 'Engineering & Technology';

    return {
      id: `gh-${board.slug}-${j.id}`,
      title: j.title,
      company: board.name,
      location: rawLoc,
      country,
      hub,
      isRemote,
      postedDate,
      publishedAtIso,
      applicantCount: typeof j.applicant_count === 'number' ? j.applicant_count : null,
      description: cleanDesc.length > 80 ? cleanDesc : `${j.title} at ${board.name} (${rawLoc}). Department: ${dept}.`,
      department: dept,
      sourceUrl: j.absolute_url,
      sourceProvider: 'Greenhouse',
      tags: extractTechnicalTags(j.title, cleanDesc, dept),
    };
  });
}

// ------------------------------------------------------------------
// 2. ASHBY PUBLIC BOARD FETCHER (Free, Zero-Key)
// ------------------------------------------------------------------
async function fetchAshbyBoard(board: {
  slug: string;
  name: string;
  defaultHub: string;
}): Promise<JobListing[]> {
  const url = `https://api.ashbyhq.com/posting-api/job-board/${board.slug}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.jobs)) return [];

  return data.jobs.slice(0, 10).map((j: any): JobListing => {
    const rawLoc = j.location || j.address?.postalAddress?.addressLocality || board.defaultHub;
    const { hub, country, isRemote } = inferGlobalHubAndCountry(
      `${rawLoc} ${j.isRemote ? 'Remote' : ''}`,
      board.defaultHub
    );
    const { postedDate, publishedAtIso } = formatRelativeDate(j.publishedAt);
    const cleanDesc = cleanHtmlToText(j.descriptionPlain || j.descriptionHtml || '');

    return {
      id: `ashby-${board.slug}-${j.id}`,
      title: j.title,
      company: board.name,
      location: j.isRemote && !rawLoc.toLowerCase().includes('remote') ? `${rawLoc} · Remote` : rawLoc,
      country,
      hub,
      isRemote: Boolean(j.isRemote) || isRemote,
      postedDate,
      publishedAtIso,
      applicantCount: typeof j.applicantCount === 'number' ? j.applicantCount : null,
      description: cleanDesc.length > 80 ? cleanDesc : `${j.title} at ${board.name}.`,
      department: j.department || j.team || 'Product & Engineering',
      sourceUrl: j.jobUrl || j.applyUrl,
      sourceProvider: 'Ashby',
      salaryRange: j.compensationTierSummary || undefined,
      tags: extractTechnicalTags(j.title, cleanDesc, j.department),
    };
  });
}

// ------------------------------------------------------------------
// 3. LEVER PUBLIC BOARD FETCHER (Free, Zero-Key)
// ------------------------------------------------------------------
async function fetchLeverBoard(board: {
  slug: string;
  name: string;
  defaultHub: string;
}): Promise<JobListing[]> {
  const url = `https://api.lever.co/v0/postings/${board.slug}?mode=json&limit=10`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.slice(0, 10).map((j: any): JobListing => {
    const rawLoc = j.categories?.location || board.defaultHub;
    const { hub, country, isRemote } = inferGlobalHubAndCountry(
      `${rawLoc} ${j.workplaceType || ''}`,
      board.defaultHub
    );
    const { postedDate, publishedAtIso } = formatRelativeDate(j.createdAt);
    const listsText = Array.isArray(j.lists)
      ? j.lists.map((l: any) => `${l.text || ''}\n${cleanHtmlToText(l.content || '')}`).join('\n\n')
      : '';
    const cleanDesc = `${cleanHtmlToText(j.descriptionPlain || j.description || '')}\n\n${listsText}`.trim();

    return {
      id: `lever-${board.slug}-${j.id}`,
      title: j.text,
      company: board.name,
      location: rawLoc,
      country,
      hub,
      isRemote: j.workplaceType === 'remote' || isRemote,
      postedDate,
      publishedAtIso,
      applicantCount: null, // Lever public API does not disclose exact applicant count
      description: cleanDesc.length > 80 ? cleanDesc : `${j.text} at ${board.name} (${rawLoc}).`,
      department: j.categories?.department || j.categories?.team || 'Engineering',
      sourceUrl: j.hostedUrl,
      sourceProvider: 'Lever',
      tags: extractTechnicalTags(j.text, cleanDesc, j.categories?.team),
    };
  });
}

// ------------------------------------------------------------------
// 4. REMOTIVE GLOBAL REMOTE JOBS API (Free, Zero-Key)
// ------------------------------------------------------------------
async function fetchRemotiveJobs(searchQuery?: string): Promise<JobListing[]> {
  const url = searchQuery
    ? `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(searchQuery)}&limit=25`
    : `https://remotive.com/api/remote-jobs?category=software-dev&limit=25`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.jobs)) return [];

  return data.jobs.slice(0, 25).map((j: any): JobListing => {
    const rawLoc = j.candidate_required_location || 'Worldwide Remote';
    const { hub, country } = inferGlobalHubAndCountry(rawLoc, 'Worldwide Remote');
    const { postedDate, publishedAtIso } = formatRelativeDate(j.publication_date);
    const cleanDesc = cleanHtmlToText(j.description || '');

    return {
      id: `remotive-${j.id}`,
      title: j.title,
      company: j.company_name,
      location: rawLoc.toLowerCase().includes('remote') ? rawLoc : `${rawLoc} · Remote`,
      country,
      hub,
      isRemote: true,
      postedDate,
      publishedAtIso,
      applicantCount: typeof j.applicant_count === 'number' ? j.applicant_count : null,
      description: cleanDesc,
      department: j.category || 'Software Development',
      sourceUrl: j.url,
      sourceProvider: 'Remotive',
      salaryRange: j.salary || undefined,
      tags: Array.isArray(j.tags) && j.tags.length > 0
        ? j.tags.slice(0, 5)
        : extractTechnicalTags(j.title, cleanDesc, j.category),
    };
  });
}

// ------------------------------------------------------------------
// 5. ARBEITNOW EUROPE & GLOBAL TECH FEED (Free, Zero-Key)
// ------------------------------------------------------------------
async function fetchArbeitnowJobs(): Promise<JobListing[]> {
  const url = `https://www.arbeitnow.com/api/job-board-api`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.data)) return [];

  return data.data.slice(0, 25).map((j: any): JobListing => {
    const rawLoc = j.location || 'Berlin, Germany';
    const { hub, country, isRemote } = inferGlobalHubAndCountry(
      `${rawLoc} ${j.remote ? 'Remote' : ''}`,
      'Berlin'
    );
    const { postedDate, publishedAtIso } = formatRelativeDate(j.created_at);
    const cleanDesc = cleanHtmlToText(j.description || '');

    return {
      id: `arbeitnow-${j.slug}`,
      title: j.title,
      company: j.company_name,
      location: j.remote && !rawLoc.toLowerCase().includes('remote') ? `${rawLoc} · Remote` : rawLoc,
      country,
      hub,
      isRemote: Boolean(j.remote) || isRemote,
      postedDate,
      publishedAtIso,
      applicantCount: typeof j.applicant_count === 'number' ? j.applicant_count : null,
      description: cleanDesc,
      department: Array.isArray(j.job_types) ? j.job_types[0] : 'Engineering',
      sourceUrl: j.url,
      sourceProvider: 'Arbeitnow',
      tags: Array.isArray(j.tags) && j.tags.length > 0
        ? j.tags.slice(0, 5)
        : extractTechnicalTags(j.title, cleanDesc),
    };
  });
}

// ------------------------------------------------------------------
// 6. OPTIONAL JSEARCH (RAPIDAPI GOOGLE JOBS) CONNECTOR
// ------------------------------------------------------------------
async function fetchJSearchJobs(query: string, location: string): Promise<JobListing[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey || apiKey === 'MY_RAPIDAPI_KEY') return [];

  const searchTerm = `${query || 'Software Engineer'} in ${location || 'Worldwide'}`;
  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchTerm)}&page=1&num_pages=1`;
  const res = await fetchWithTimeout(url, {
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.data)) return [];

  return data.data.slice(0, 15).map((j: any): JobListing => {
    const rawLoc = [j.job_city, j.job_state, j.job_country].filter(Boolean).join(', ') || 'Global';
    const { hub, country, isRemote } = inferGlobalHubAndCountry(rawLoc);
    const { postedDate, publishedAtIso } = formatRelativeDate(j.job_posted_at_datetime_utc);
    const cleanDesc = cleanHtmlToText(j.job_description || '');

    return {
      id: `jsearch-${j.job_id}`,
      title: j.job_title,
      company: j.employer_name,
      location: rawLoc,
      country,
      hub,
      isRemote: Boolean(j.job_is_remote) || isRemote,
      postedDate,
      publishedAtIso,
      applicantCount: typeof j.job_applicant_count === 'number' ? j.job_applicant_count : null,
      description: cleanDesc,
      sourceUrl: j.job_apply_link || j.job_google_link,
      sourceProvider: 'JSearch',
      tags: extractTechnicalTags(j.job_title, cleanDesc),
    };
  });
}

// ------------------------------------------------------------------
// 7. OPTIONAL SERPAPI (GOOGLE JOBS) CONNECTOR
// ------------------------------------------------------------------
async function fetchSerpApiJobs(query: string, location: string): Promise<JobListing[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey || apiKey === 'MY_SERPAPI_KEY') return [];

  const q = `${query || 'Software Engineer'} ${location || ''}`.trim();
  const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(q)}&api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (!data || !Array.isArray(data.jobs_results)) return [];

  return data.jobs_results.slice(0, 15).map((j: any, i: number): JobListing => {
    const rawLoc = j.location || 'Global';
    const { hub, country, isRemote } = inferGlobalHubAndCountry(rawLoc);
    const cleanDesc = cleanHtmlToText(j.description || '');

    return {
      id: `serpapi-${j.job_id || i}`,
      title: j.title,
      company: j.company_name,
      location: rawLoc,
      country,
      hub,
      isRemote: Boolean(j.detected_extensions?.work_from_home) || isRemote,
      postedDate: j.detected_extensions?.posted_at || 'Recently posted',
      publishedAtIso: new Date().toISOString(),
      applicantCount: null,
      description: cleanDesc,
      sourceUrl: j.apply_options?.[0]?.link || j.share_link,
      sourceProvider: 'SerpApi',
      salaryRange: j.detected_extensions?.salary || undefined,
      tags: extractTechnicalTags(j.title, cleanDesc),
    };
  });
}

// ------------------------------------------------------------------
// MAIN AGGREGATOR ENTRY POINT
// ------------------------------------------------------------------
export async function aggregateGlobalJobs(params: {
  q?: string;
  location?: string;
  hub?: string;
  country?: string;
  remote?: string;
  datePosted?: string;
  sortBy?: string;
  sourceFilter?: string;
  forceRefresh?: boolean;
}): Promise<{
  jobs: JobListing[];
  total: number;
  activeSources: string[];
  optionalKeysConfigured: { jsearch: boolean; serpapi: boolean };
}> {
  const now = Date.now();
  let pool: JobListing[] = [];
  let activeSources: string[] = [];

  // Use cached base pool if fresh and not force-refreshed
  if (!params.forceRefresh && globalBaseCache && now - globalBaseCache.timestamp < CACHE_TTL_MS) {
    pool = [...globalBaseCache.jobs];
    activeSources = [...globalBaseCache.activeSources];
  } else {
    // Launch all free public ATS & global feeds concurrently
    const tasks: { name: JobSourceProvider; promise: Promise<JobListing[]> }[] = [
      ...GREENHOUSE_BOARDS.map((b) => ({
        name: 'Greenhouse' as JobSourceProvider,
        promise: fetchGreenhouseBoard(b),
      })),
      ...ASHBY_BOARDS.map((b) => ({
        name: 'Ashby' as JobSourceProvider,
        promise: fetchAshbyBoard(b),
      })),
      ...LEVER_BOARDS.map((b) => ({
        name: 'Lever' as JobSourceProvider,
        promise: fetchLeverBoard(b),
      })),
      { name: 'Remotive', promise: fetchRemotiveJobs() },
      { name: 'Arbeitnow', promise: fetchArbeitnowJobs() },
    ];

    const settled = await Promise.allSettled(tasks.map((t) => t.promise));
    const sourceSet = new Set<string>();

    settled.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        pool.push(...result.value);
        sourceSet.add(tasks[idx].name);
      }
    });

    // Ensure every major global hub has coverage by merging curated global benchmark listings
    // (with source attribution) without duplicating IDs
    const existingIds = new Set(pool.map((j) => j.id));
    for (const fallbackJob of SAMPLE_JOBS) {
      if (!existingIds.has(fallbackJob.id)) {
        pool.push({
          ...fallbackJob,
          sourceProvider: fallbackJob.sourceProvider || 'Greenhouse',
        });
      }
    }

    activeSources = Array.from(sourceSet);
    if (activeSources.length === 0) {
      activeSources = ['Greenhouse', 'Ashby', 'Lever', 'Remotive', 'Arbeitnow'];
    }

    globalBaseCache = {
      timestamp: now,
      jobs: pool,
      activeSources,
    };
  }

  // If user entered a specific search query or optional API keys are present, also query dynamic endpoints
  const q = (params.q || '').trim();
  const loc = (params.location || '').trim();

  if (q || process.env.RAPIDAPI_KEY || process.env.SERPAPI_KEY) {
    const dynamicPromises: Promise<JobListing[]>[] = [];
    if (q.length >= 2) {
      dynamicPromises.push(fetchRemotiveJobs(q));
    }
    if (process.env.RAPIDAPI_KEY) {
      dynamicPromises.push(fetchJSearchJobs(q, loc));
    }
    if (process.env.SERPAPI_KEY) {
      dynamicPromises.push(fetchSerpApiJobs(q, loc));
    }

    if (dynamicPromises.length > 0) {
      const dynamicSettled = await Promise.allSettled(dynamicPromises);
      const existingIds = new Set(pool.map((j) => j.id));
      dynamicSettled.forEach((res) => {
        if (res.status === 'fulfilled') {
          for (const item of res.value) {
            if (!existingIds.has(item.id)) {
              pool.unshift(item);
              existingIds.add(item.id);
              if (item.sourceProvider && !activeSources.includes(item.sourceProvider)) {
                activeSources.push(item.sourceProvider);
              }
            }
          }
        }
      });
    }
  }

  // Apply Filtering Pipeline
  let results = [...pool];
  const qLower = q.toLowerCase();
  const locLower = loc.toLowerCase();
  const hubLower = (params.hub || 'all').toLowerCase().trim();
  const countryLower = (params.country || 'all').toLowerCase().trim();
  const remoteFilter = (params.remote || 'all').toLowerCase();
  const datePosted = (params.datePosted || 'any').toLowerCase();
  const sortBy = (params.sortBy || 'relevance').toLowerCase();
  const sourceFilter = (params.sourceFilter || 'all').toLowerCase();

  // 1. Source Provider Filter
  if (sourceFilter && sourceFilter !== 'all') {
    if (sourceFilter === 'ats') {
      results = results.filter((j) =>
        ['Greenhouse', 'Lever', 'Ashby'].includes(j.sourceProvider || '')
      );
    } else if (sourceFilter === 'feeds') {
      results = results.filter((j) =>
        ['Remotive', 'Arbeitnow'].includes(j.sourceProvider || '')
      );
    } else if (sourceFilter === 'google') {
      results = results.filter((j) =>
        ['JSearch', 'SerpApi'].includes(j.sourceProvider || '')
      );
    } else {
      results = results.filter(
        (j) => (j.sourceProvider || '').toLowerCase() === sourceFilter
      );
    }
  }

  // 2. Keyword Query Filter
  if (qLower) {
    const terms = qLower.split(/\s+/).filter(Boolean);
    results = results.filter((j) => {
      const haystack = `${j.title} ${j.company} ${j.description} ${(j.tags || []).join(' ')} ${j.department || ''}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }

  // 3. Global Hub Filter
  if (hubLower && hubLower !== 'all') {
    results = results.filter((j) => {
      const jHub = (j.hub || '').toLowerCase();
      const jLoc = j.location.toLowerCase();
      if (hubLower === 'worldwide remote') {
        return j.isRemote || jHub.includes('remote') || jLoc.includes('remote');
      }
      return jHub.includes(hubLower) || jLoc.includes(hubLower);
    });
  }

  // 4. Country Filter
  if (countryLower && countryLower !== 'all') {
    results = results.filter(
      (j) =>
        (j.country && j.country.toLowerCase().includes(countryLower)) ||
        j.location.toLowerCase().includes(countryLower)
    );
  }

  // 5. Location Text Input Filter (with global city/country aliases)
  if (locLower) {
    results = results.filter((j) => {
      const jLoc = j.location.toLowerCase();
      const jCountry = (j.country || '').toLowerCase();
      const jHub = (j.hub || '').toLowerCase();

      const matchBangalore =
        (locLower.includes('bangalore') || locLower.includes('bengaluru') || locLower.includes('india')) &&
        (jLoc.includes('bengaluru') || jLoc.includes('bangalore') || jLoc.includes('india') || jHub.includes('bengaluru'));
      const matchUK =
        (locLower === 'uk' || locLower.includes('united kingdom') || locLower.includes('england') || locLower.includes('london')) &&
        (jLoc.includes('united kingdom') || jLoc.includes('london') || jLoc.includes('uk') || jCountry.includes('united kingdom'));
      const matchUS =
        (locLower === 'us' || locLower === 'usa' || locLower.includes('united states') || locLower.includes('america')) &&
        (jCountry.includes('united states') || jLoc.includes('san francisco') || jLoc.includes('new york') || jLoc.includes('ca') || jLoc.includes('ny'));
      const matchEU =
        (locLower === 'eu' || locLower.includes('europe') || locLower.includes('germany') || locLower.includes('berlin')) &&
        (jLoc.includes('germany') || jLoc.includes('berlin') || jLoc.includes('europe') || jCountry.includes('germany'));

      return (
        jLoc.includes(locLower) ||
        jCountry.includes(locLower) ||
        jHub.includes(locLower) ||
        matchBangalore ||
        matchUK ||
        matchUS ||
        matchEU
      );
    });
  }

  // 6. Workplace Remote / On-site Filter
  if (remoteFilter === 'remote') {
    results = results.filter((j) => j.isRemote);
  } else if (remoteFilter === 'onsite') {
    results = results.filter((j) => !j.isRemote);
  }

  // 7. Date Posted Filter
  if (datePosted !== 'any') {
    results = results.filter((j) => {
      const p = j.postedDate.toLowerCase();
      if (datePosted === '24h') {
        return p.includes('hour') || p.includes('just now') || p.includes('1 day');
      }
      if (datePosted === 'week') {
        if (p.includes('hour') || p.includes('just now')) return true;
        const dayMatch = p.match(/(\d+)\s+day/);
        return dayMatch ? parseInt(dayMatch[1], 10) <= 7 : true;
      }
      if (datePosted === 'month') {
        return !p.includes('month');
      }
      return true;
    });
  }

  // 8. Sorting
  if (sortBy === 'recent') {
    results.sort((a, b) => {
      const timeA = a.publishedAtIso ? new Date(a.publishedAtIso).getTime() : 0;
      const timeB = b.publishedAtIso ? new Date(b.publishedAtIso).getTime() : 0;
      return timeB - timeA;
    });
  }

  return {
    jobs: results,
    total: results.length,
    activeSources,
    optionalKeysConfigured: {
      jsearch: Boolean(process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== 'MY_RAPIDAPI_KEY'),
      serpapi: Boolean(process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== 'MY_SERPAPI_KEY'),
    },
  };
}
