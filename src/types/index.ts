export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  hasVoted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Candidate {
  _id: string;
  name: string;
  position: string;
  photoUrl: string;
  votes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  _id: string;
  userId: string;
  candidateId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoteResult {
  _id: string;
  name: string;
  position: string;
  photoUrl: string;
  votes: number;
  percentage: string;
}

export interface ResultsData {
  candidates: VoteResult[];
  totalVotes: number;
  totalCandidates: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface VotingSettings {
  _id: string;
  votingDeadline: string;
  isVotingActive: boolean;
  allowVoting: boolean;
  votingTitle: string;
  votingDescription: string;
  canVote: boolean;
  hasEnded: boolean;
  timeRemaining: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VotingStatus {
  canVote: boolean;
  hasEnded: boolean;
  timeRemaining: number;
  votingDeadline: string;
  votingTitle: string;
  votingDescription: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
} 