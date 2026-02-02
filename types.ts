export interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: Date;
    isError?: boolean;
}

export interface User {
    name: string;
    age: number;
    role: string;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    colorClass: string;
    path: string;
}

export interface Profile {
    id: string;
    name: string;
    role: 'patient' | 'caregiver' | 'user' | string;
    email: string;
    avatar_url?: string;
}

// Cognitive Metrics Interfaces
export interface DailyCompletion {
    day: string;
    levels_completed: number;
}

export interface DailyAccuracy {
    day: string;
    total_hits: number;
    total_errors: number;
}

export interface WeeklyTrend {
    user_id?: string;
    patient_id?: string;
    current_week_score: number;
    previous_week_score: number;
    percentage_change: number | null;
}

export interface GameStats {
    day: string;
    game_type: string;
    total_hits: number;
    total_errors: number;
    levels_completed: number;
}

export interface TotalLevels {
    total_completed: number;
}

export interface AvgSessionTime {
    avg_time_seconds: number;
}

export type GameCategory = 'all' | 'memory' | 'attention' | 'calculation' | 'calc';
