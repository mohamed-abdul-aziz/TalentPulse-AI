export type JobSourceProvider =
  | 'Greenhouse'
  | 'Lever'
  | 'Ashby'
  | 'Remotive'
  | 'Arbeitnow'
  | 'JSearch'
  | 'SerpApi';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  country?: string;
  hub?: string;
  isRemote: boolean;
  postedDate: string; // e.g. "2 days ago", "14 hours ago"
  publishedAtIso?: string;
  applicantCount: number | null; // Strictly exact count if provided by source API, else null
  description: string;
  department?: string;
  sourceUrl?: string;
  sourceProvider?: JobSourceProvider;
  salaryRange?: string;
  tags?: string[];
}

export interface VectorScoreResult {
  matchScore: number; // 0 - 100
  rawSimilarity: number; // e.g. 0.784
  applicantCount: number | null;
}

export interface XYZBullet {
  originalBullet: string;
  rewrittenXYZ: string;
  impactFactor: string;
}

export interface RoadmapProject {
  title: string;
  timeline: string;
  skillsAddressed: string[];
  deliverable: string;
}

export interface InterviewQuestion {
  question: string;
  targetedWeakness: string;
  defenseStrategy: string;
}

export interface EvaluationPayload {
  jobTitle: string;
  companyName: string;
  matchScore: number;
  rawSimilarity?: number;
  applicantCount: number | null;
  probabilityAvailable: boolean;
  hiringProbability?: number;
  probabilityDisplay?: string;
  tier?: 'Top 5% Contender' | 'Competitive Candidate' | 'Uphill Battle';
  tierDescription?: string;
  competitionMultiplier?: number;
  aiOverview: string;
  strengths: {
    highlights: string[];
    technicalTags: string[];
  };
  gaps: {
    missingSkills: string[];
    atsKeywordsMissing: string[];
  };
  xyzBulletOptimizations: XYZBullet[];
  careerAcceleration: {
    reverseMatchRoadmap: RoadmapProject[];
    interviewQuestions: InterviewQuestion[];
    tailoredCoverLetter: string;
  };
}
