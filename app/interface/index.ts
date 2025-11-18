export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: Option[];
  createdBy: string;
  createdAt: string;
  isClosed: boolean;
}

export interface PollsState {
  polls: Poll[];
  pollDetails: Poll | null;
  loading: boolean;
  error: string | null;
}

export interface VoteResult {
  optionId: string;
  votes: number;
}

export interface VotesState {
  liveResults: Record<string, VoteResult[]>;
  loading: boolean;
  error: string | null;
}