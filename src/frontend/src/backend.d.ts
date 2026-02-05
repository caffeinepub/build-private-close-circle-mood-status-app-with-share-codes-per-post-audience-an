import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type Avatar = {
    __kind__: "uploaded";
    uploaded: UploadedAvatar;
} | {
    __kind__: "systemAvatar";
    systemAvatar: string;
};
export interface Preferences {
    intent: RelationshipIntent;
    gender: Gender;
}
export interface UpdateUserProfile {
    preferences: Preferences;
    showAge: boolean;
    relationshipIntent: RelationshipIntent;
    shareCode: string;
}
export interface StatusPost {
    id: string;
    content: string;
    contextTags?: Array<string>;
    mood: Mood;
    createdAt: Time;
    audience: Array<Principal>;
    author: Principal;
}
export interface PendingRequestWithProfile {
    request: JoinRequest;
    profile: UserProfile;
}
export interface JournalEntry {
    content: string;
    date: Time;
    createdAt: Time;
}
export interface Notification {
    id: string;
    createdAt: Time;
    user: Principal;
    isRead: boolean;
    statusId?: string;
    message: string;
    requesterName?: string;
}
export type FeedItem = {
    __kind__: "status";
    status: StatusPost;
} | {
    __kind__: "silentSignal";
    silentSignal: SilentSignal;
};
export interface UploadedAvatar {
    contentType: string;
    image: Uint8Array;
}
export interface ConnectionWhyExplanation {
    why: string;
    principal: Principal;
    interaction: bigint;
    name: string;
    sharedConnections: bigint;
}
export interface SilentSignal {
    id: string;
    content: string;
    mood: Mood;
    createdAt: Time;
    audience: Array<Principal>;
    author: Principal;
}
export interface JoinRequest {
    to: Principal;
    from: Principal;
    createdAt: Time;
    shareCode: string;
}
export interface UserProfile {
    dateOfBirth: bigint;
    name: string;
    createdAt: Time;
    preferences: Preferences;
    showAge: boolean;
    relationshipIntent: RelationshipIntent;
    gender: Gender;
    shareCode: string;
    avatar?: Avatar;
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male",
    nonBinary = "nonBinary"
}
export enum Mood {
    joy = "joy",
    sad = "sad",
    shy = "shy",
    zen = "zen",
    hopeful = "hopeful",
    inspiration = "inspiration",
    tired = "tired",
    content = "content",
    anxious = "anxious",
    courage = "courage",
    happy = "happy",
    angry = "angry",
    triumph = "triumph",
    nervous = "nervous",
    embarrass = "embarrass",
    apathetic = "apathetic",
    melancholy = "melancholy",
    bore = "bore",
    calm = "calm",
    fear = "fear",
    irritate = "irritate",
    relaxed = "relaxed",
    grateful = "grateful",
    lonely = "lonely",
    secure = "secure",
    unsafe = "unsafe",
    satisfy = "satisfy",
    motivate = "motivate",
    stressed = "stressed",
    frustrate = "frustrate",
    overwhelm = "overwhelm",
    passionate = "passionate",
    disappoint = "disappoint",
    excited = "excited",
    indifferen = "indifferen",
    humbled = "humbled",
    disgust = "disgust",
    confident = "confident",
    curious = "curious",
    relieved = "relieved",
    worry = "worry",
    guilty = "guilty",
    ashamed = "ashamed",
    neutral = "neutral",
    optimistic = "optimistic"
}
export enum RelationshipIntent {
    romantic = "romantic",
    both = "both",
    friendship = "friendship"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptJoinRequest(from: Principal, code: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOrUpdateJournalEntry(content: string): Promise<void>;
    declineJoinRequest(user: Principal, code: string): Promise<void>;
    deleteJournalEntry(date: Time): Promise<void>;
    getAllJournalEntries(): Promise<Array<JournalEntry>>;
    getBestCircleConnectionsWithWhyExplanation(): Promise<Array<ConnectionWhyExplanation>>;
    getCallerCircleOwners(): Promise<Array<Principal>>;
    getCallerPulseScore(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCircleMembers(): Promise<Array<Principal>>;
    getEligibleSafePeopleCandidates(): Promise<Array<Principal>>;
    getEntriesByRange(startDate: Time, endDate: Time): Promise<Array<JournalEntry>>;
    getFeed(): Promise<Array<FeedItem>>;
    getJournalEntry(date: Time): Promise<JournalEntry | null>;
    getNotifications(): Promise<Array<Notification>>;
    getOwnSilentSignals(): Promise<Array<SilentSignal>>;
    getSafePeople(): Promise<Array<Principal>>;
    getShareCodeByPrincipal(principal: Principal): Promise<string>;
    getSilentSignals(): Promise<Array<SilentSignal>>;
    getStatus(statusId: string): Promise<StatusPost | null>;
    getUnprocessedJoinRequests(): Promise<Array<PendingRequestWithProfile>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserPulseScore(user: Principal): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    joinCircleFromShareCode(code: string): Promise<void>;
    postSilentSignal(mood: Mood, content: string): Promise<void>;
    postStatus(status: StatusPost): Promise<void>;
    removeCircleMember(member: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    selectSystemAvatar(avatarId: string): Promise<void>;
    setSafePerson(person: Principal): Promise<void>;
    unsetSafePerson(person: Principal): Promise<void>;
    updateProfile(updates: UpdateUserProfile): Promise<void>;
    updateShareCode(code: string): Promise<string>;
    uploadAvatar(avatar: UploadedAvatar): Promise<void>;
    viewProfile(id: Principal): Promise<UserProfile>;
}
