import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlass,
  MapPin,
  Buildings,
  Users,
  CalendarBlank,
  ArrowRight,
  ArrowClockwise,
  SlidersHorizontal,
  ArrowSquareOut,
} from '@phosphor-icons/react';
import { JobListing } from '../types.ts';
import { SAMPLE_JOBS } from '../mockData.ts';

interface JobSearchPageProps {
  onSelectJob: (job: JobListing) => void;
  onBack: () => void;
}

const GLOBAL_HUBS = [
  { id: 'all', label: 'All Global Roles' },
  { id: 'london', label: 'London' },
  { id: 'bengaluru', label: 'Bengaluru' },
  { id: 'berlin', label: 'Berlin' },
  { id: 'singapore', label: 'Singapore' },
  { id: 'tokyo', label: 'Tokyo' },
  { id: 'sydney', label: 'Sydney' },
  { id: 'toronto', label: 'Toronto' },
  { id: 'new york', label: 'New York' },
  { id: 'san francisco', label: 'San Francisco' },
  { id: 'worldwide remote', label: 'Worldwide Remote' },
];

const SOURCE_FILTERS = [
  { id: 'all', label: 'All Live Sources' },
  { id: 'ats', label: 'Public ATS (Greenhouse / Lever / Ashby)' },
  { id: 'feeds', label: 'Global Feeds (Remotive / Arbeitnow)' },
  { id: 'google', label: 'Google Jobs (JSearch / SerpApi)' },
];

export const JobSearchPage: React.FC<JobSearchPageProps> = ({ onSelectJob, onBack }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedHub, setSelectedHub] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [remoteFilter, setRemoteFilter] = useState<'all' | 'remote' | 'onsite'>('all');
  const [datePosted, setDatePosted] = useState<'any' | '24h' | 'week' | 'month'>('any');
  const [sortBy, setSortBy] = useState<'relevance' | 'recent'>('relevance');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [activeSources, setActiveSources] = useState<string[]>([
    'Greenhouse',
    'Ashby',
    'Lever',
    'Remotive',
    'Arbeitnow',
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        location,
        hub: selectedHub,
        source: sourceFilter,
        remote: remoteFilter,
        datePosted,
        sortBy,
        refresh: forceRefresh ? 'true' : 'false',
      });

      const res = await fetch(`/api/search-jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
        if (Array.isArray(data.activeSources) && data.activeSources.length > 0) {
          setActiveSources(data.activeSources);
        }
      } else {
        filterLocally();
      }
    } catch (e) {
      filterLocally();
    } finally {
      setIsLoading(false);
    }
  };

  const filterLocally = () => {
    let filtered = [...SAMPLE_JOBS];
    const qLower = query.toLowerCase().trim();
    if (qLower) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(qLower) ||
          j.company.toLowerCase().includes(qLower) ||
          j.tags?.some((t) => t.toLowerCase().includes(qLower))
      );
    }

    if (selectedHub && selectedHub !== 'all') {
      filtered = filtered.filter(
        (j) =>
          (j.hub && j.hub.toLowerCase().includes(selectedHub)) ||
          j.location.toLowerCase().includes(selectedHub)
      );
    }

    if (location.trim()) {
      const loc = location.toLowerCase().trim();
      filtered = filtered.filter(
        (j) =>
          j.location.toLowerCase().includes(loc) ||
          (j.country && j.country.toLowerCase().includes(loc)) ||
          (j.hub && j.hub.toLowerCase().includes(loc))
      );
    }

    if (remoteFilter === 'remote') {
      filtered = filtered.filter((j) => j.isRemote);
    } else if (remoteFilter === 'onsite') {
      filtered = filtered.filter((j) => !j.isRemote);
    }

    setJobs(filtered);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs(false);
    }, 220);
    return () => clearTimeout(timer);
  }, [query, location, selectedHub, sourceFilter, remoteFilter, datePosted, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-[#F5F5F7] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="text-[13px] font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors mb-3 flex items-center gap-1 cursor-pointer"
          >
            ← Return to overview
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F]">
            Live Global Job Index
          </h1>
          <p className="text-[15px] text-[#86868B] mt-1 font-normal tracking-tight">
            Real-time openings aggregated across public ATS boards ({activeSources.join(' · ')}) and global feeds.
          </p>
        </div>

        <button
          onClick={() => fetchJobs(true)}
          disabled={isLoading}
          className="px-4 py-2 rounded-full bg-white hover:bg-black/[0.02] text-[#1D1D1F] border border-black/[0.08] text-[13px] font-medium flex items-center gap-2 shadow-xs transition cursor-pointer self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <ArrowClockwise size={15} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Live Feeds</span>
        </button>
      </div>

      {/* Global Tech Hubs Quick Filter */}
      <div className="mb-4 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
        {GLOBAL_HUBS.map((hub) => (
          <button
            key={hub.id}
            onClick={() => setSelectedHub(hub.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
              selectedHub === hub.id
                ? 'bg-[#1D1D1F] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-[#1D1D1F] border border-black/[0.08] hover:border-black/20'
            }`}
          >
            {hub.label}
          </button>
        ))}
      </div>

      {/* Source Provider Segmented Controls */}
      <div className="mb-6 overflow-x-auto pb-1 scrollbar-none flex items-center gap-2">
        {SOURCE_FILTERS.map((src) => (
          <button
            key={src.id}
            onClick={() => setSourceFilter(src.id)}
            className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              sourceFilter === src.id
                ? 'bg-black/[0.08] text-[#1D1D1F] font-semibold'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            {src.label}
          </button>
        ))}
      </div>

      {/* Search & Working Filters Bar */}
      <div className="bg-white rounded-3xl border border-black/[0.08] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-8 space-y-4">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
              <MagnifyingGlass size={17} weight="bold" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Role, tech stack, or company (e.g. Full Stack, Stripe, Monzo, Python)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/10 transition placeholder:text-[#86868B]"
            />
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868B]">
              <MapPin size={17} weight="bold" />
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, country or remote (e.g. London, Bengaluru, Berlin, Tokyo)..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border border-black/[0.06] rounded-2xl text-[14px] text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black/10 transition placeholder:text-[#86868B]"
            />
          </div>

          {/* Search CTA */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => fetchJobs(false)}
              className="w-full py-2.5 px-4 bg-[#1D1D1F] hover:bg-black text-white font-medium text-[14px] rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <ArrowClockwise size={17} className="animate-spin" />
              ) : (
                <SlidersHorizontal size={17} weight="bold" />
              )}
              <span>Search Live</span>
            </button>
          </div>
        </div>

        {/* Working Filters & Sorting Strip */}
        <div className="pt-3 border-t border-black/[0.05] flex flex-wrap items-center justify-between gap-4 text-[13px]">
          {/* Remote Toggle */}
          <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-xl">
            <button
              onClick={() => setRemoteFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                remoteFilter === 'all'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              All Workplaces
            </button>
            <button
              onClick={() => setRemoteFilter('remote')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                remoteFilter === 'remote'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              Remote Only
            </button>
            <button
              onClick={() => setRemoteFilter('onsite')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap shrink-0 ${
                remoteFilter === 'onsite'
                  ? 'bg-white text-[#1D1D1F] shadow-xs'
                  : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
            >
              On-site
            </button>
          </div>

          {/* Date & Sort Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[#86868B]">Posted:</span>
              <select
                value={datePosted}
                onChange={(e) => setDatePosted(e.target.value as any)}
                aria-label="Date Posted"
                className="bg-[#F5F5F7] border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-[13px] text-[#1D1D1F] font-medium focus:outline-none focus:ring-1 focus:ring-black/20"
              >
                <option value="any">Any time</option>
                <option value="24h">Past 24 hours</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#86868B]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort by"
                className="bg-[#F5F5F7] border border-black/[0.06] rounded-xl px-2.5 py-1.5 text-[13px] text-[#1D1D1F] font-medium focus:outline-none focus:ring-1 focus:ring-black/20"
              >
                <option value="relevance">Most Relevant</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-[13px] text-[#86868B] tabular-nums">
          <span>
            {isLoading ? 'Syncing global job feeds...' : `${jobs.length} live opportunities matched`}
          </span>
          <span>Click any listing to ingest candidate PDF</span>
        </div>

        {isLoading && jobs.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl border border-black/[0.08] p-6 h-56 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 w-36 bg-black/[0.06] rounded" />
                  <div className="h-6 w-3/4 bg-black/[0.08] rounded" />
                  <div className="h-4 w-1/2 bg-black/[0.05] rounded" />
                </div>
                <div className="h-4 w-full bg-black/[0.04] rounded" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-black/[0.08] p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <Buildings size={36} className="mx-auto text-[#86868B] mb-3" />
            <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-1">
              No positions matching this filter combination
            </h3>
            <p className="text-[13px] text-[#86868B] mb-5">
              Try resetting your search filters or switching to All Global Roles.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setLocation('');
                setSelectedHub('all');
                setSourceFilter('all');
                setRemoteFilter('all');
                setDatePosted('any');
              }}
              className="px-5 py-2.5 bg-[#1D1D1F] text-white rounded-full text-[13px] font-medium hover:bg-black transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="bg-white rounded-3xl border border-black/[0.08] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-black/20 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top unboxed metadata strip with middot separators */}
                  <div className="flex items-center justify-between gap-2 mb-2 text-[12px] text-[#86868B]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-[#1D1D1F]">{job.company}</span>
                      {job.sourceProvider && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{job.sourceProvider}</span>
                        </>
                      )}
                    </div>
                    <span className="flex items-center gap-1 shrink-0 tabular-nums">
                      <CalendarBlank size={13} /> {job.postedDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] font-semibold text-[#1D1D1F] group-hover:text-black transition tracking-tight mb-2">
                    {job.title}
                  </h3>

                  {/* Unboxed Location & Remote metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#86868B] mb-3.5">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-[#86868B] shrink-0" /> {job.location}
                    </span>
                    {job.isRemote && !job.location.toLowerCase().includes('remote') && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1D1D1F] font-medium">Remote</span>
                      </>
                    )}
                    {job.salaryRange && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#1D1D1F] font-medium tabular-nums">
                          {job.salaryRange}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Snippet */}
                  <p className="text-[13px] text-[#86868B] line-clamp-2 leading-relaxed mb-5 font-normal">
                    {job.description.replace(/^About.*?:/i, '').trim()}
                  </p>
                </div>

                {/* Bottom Bar: Exact Applicant Count (only when provided by source API) & CTA */}
                <div className="pt-4 border-t border-black/[0.05] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[12px] text-[#86868B] tabular-nums">
                    <Users size={15} />
                    {typeof job.applicantCount === 'number' ? (
                      <span>
                        <strong className="text-[#1D1D1F] font-semibold">{job.applicantCount}</strong> applicants
                      </span>
                    ) : (
                      <span>Applicant volume unlisted</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {job.sourceUrl && (
                      <a
                        href={job.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[12px] text-[#86868B] hover:text-[#1D1D1F] flex items-center gap-1 transition-colors"
                        title="Open live job posting"
                      >
                        <span>Original</span>
                        <ArrowSquareOut size={13} />
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1D1D1F] group-hover:translate-x-0.5 transition-transform whitespace-nowrap shrink-0">
                      Benchmark CV <ArrowRight size={14} weight="bold" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
