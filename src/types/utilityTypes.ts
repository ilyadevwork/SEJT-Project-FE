import snapshots from "../data/jobs.json";

export type rootIdxType = typeof snapshots[0]["techRoot"];
export type branchIdxType = "name" | "remote" | "salaryEst" | "jobType" | "expLevel" | "eduLevel" | "location" | "company";

export interface tableDataType {
    key: React.Key;
    identifier: string;
    category?: string;
    marketshare: number;
    value: number;
  }

export type altDataType = typeof snapshots[0]["techBranch"][0][branchIdxType];
export type justObjects = Exclude<altDataType, string>;

export type Dictionary<T> = {
  [index: string]: T;
}