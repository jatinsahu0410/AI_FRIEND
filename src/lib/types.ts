// types.ts

export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    clerkid: string;
    bots: ChatBot[];
    profile?: Profile;
    profilePic?: string | null;
    onboarding: boolean;
    createdAt: string;
}

export interface ChatBot {
    id: string;
    name?: string;
    personality: Personality;
    userId: string;
    messages: Message[];
    avatars: Avatar[];
}
export interface Profile {
    id: string;
    gender: Gender;
    interest: string[];
    emotions: string;
    userId: string;
}

export interface Personality {
    id: string;
    tone: Tone;
    communicationStyle: CommunicationStyle;
    intelligenceLevel: IntelligenceLevel;
    politenessLevel: PolitenessLevel;
}

export interface Message {
    id: string;
    text?: string;
    liked?: boolean;
    isUserInput?: boolean
}

export interface Avatar {
    id: string;
    imageUrl: string;
    category?: string;
}

// Enums for improved type safety
export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export enum Tone {
    CASUAL = "CASUAL",
    FORMAL = "FORMAL",
    HUMOROUS = "HUMOROUS",
}

export enum CommunicationStyle {
    CONCISE = "CONCISE",
    DETAILED = "DETAILED",
}

export enum IntelligenceLevel {
    SIMPLE = "SIMPLE",
    MODERATE = "MODERATE",
    ADVANCED = "ADVANCED",
}

export enum PolitenessLevel {
    NEUTRAL = "NEUTRAL",
    POLITE = "POLITE",
    HARSH = "HARSH",
}
