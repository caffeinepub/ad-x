import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ConsentSettings {
    shareAge: boolean;
    shareLocation: boolean;
    shareInterests: boolean;
}
export interface Demographics {
    ageRange: string;
    location: string;
}
export interface CompanyProfile {
    productCategory: string;
    name: string;
}
export interface UserProfile {
    consent: ConsentSettings;
    interests: Array<string>;
    demographics: Demographics;
}
export interface CategoryCount {
    count: bigint;
    category: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCategoryCounts(): Promise<Array<CategoryCount>>;
    getAudienceCountCategory(category: string): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCompanyProfile(company: Principal): Promise<CompanyProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveCompanyProfile(profile: CompanyProfile): Promise<void>;
}
