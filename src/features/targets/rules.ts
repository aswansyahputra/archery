import type { ScoringRule } from "@/features/scoring/engine";

export const FESPATI_LAPANGAN: ScoringRule = {
  id: "fespati-lapangan",
  rings: [
    { value: 6, isX: true, labelKey: "targets.fespatiLapangan.ring6plus" },
    { value: 6, labelKey: "targets.fespatiLapangan.ring6" },
    { value: 5, labelKey: "targets.fespatiLapangan.ring5" },
    { value: 4, labelKey: "targets.fespatiLapangan.ring4" },
    { value: 3, labelKey: "targets.fespatiLapangan.ring3" },
    { value: 2, labelKey: "targets.fespatiLapangan.ring2" },
    { value: 1, labelKey: "targets.fespatiLapangan.ring1" },
  ],
  hitValues: [1, 2, 3, 4, 5, 6], highRingValue: 6, maxScore: 6,
};

export const WA_10_ZONE: ScoringRule = {
  id: "wa-10zone",
  rings: [
    { value: 10, isX: true, labelKey: "targets.wa10.ringX" },
    { value: 10, labelKey: "targets.wa10.ring10" },
    { value: 9, labelKey: "targets.wa10.ring9" },
    { value: 8, labelKey: "targets.wa10.ring8" },
    { value: 7, labelKey: "targets.wa10.ring7" },
    { value: 6, labelKey: "targets.wa10.ring6" },
    { value: 5, labelKey: "targets.wa10.ring5" },
    { value: 4, labelKey: "targets.wa10.ring4" },
    { value: 3, labelKey: "targets.wa10.ring3" },
    { value: 2, labelKey: "targets.wa10.ring2" },
    { value: 1, labelKey: "targets.wa10.ring1" },
  ],
  hitValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], highRingValue: 10, maxScore: 10,
};

export const WA_5_ZONE: ScoringRule = {
  id: "wa-5zone",
  rings: [
    { value: 5, labelKey: "targets.wa5.ring5" },
    { value: 4, labelKey: "targets.wa5.ring4" },
    { value: 3, labelKey: "targets.wa5.ring3" },
    { value: 2, labelKey: "targets.wa5.ring2" },
    { value: 1, labelKey: "targets.wa5.ring1" },
  ],
  hitValues: [1, 2, 3, 4, 5], highRingValue: 5, maxScore: 5,
};

export const NFAA: ScoringRule = {
  id: "nfaa",
  rings: [
    { value: 5, isX: true, labelKey: "targets.nfaa.ringX" },
    { value: 5, labelKey: "targets.nfaa.ring5" },
    { value: 4, labelKey: "targets.nfaa.ring4" },
    { value: 3, labelKey: "targets.nfaa.ring3" },
    { value: 2, labelKey: "targets.nfaa.ring2" },
    { value: 1, labelKey: "targets.nfaa.ring1" },
    { value: 0, labelKey: "targets.nfaa.ring0" },
  ],
  hitValues: [1, 2, 3, 4, 5], highRingValue: 5, maxScore: 5,
};

export const KOREAN_TRADITIONAL: ScoringRule = {
  id: "korean-traditional",
  rings: [
    { value: 10, isX: true, labelKey: "targets.korean.ringX" },
    { value: 10, labelKey: "targets.korean.ring10" },
    { value: 9, labelKey: "targets.korean.ring9" },
    { value: 7, labelKey: "targets.korean.ring7" },
    { value: 5, labelKey: "targets.korean.ring5" },
    { value: 3, labelKey: "targets.korean.ring3" },
  ],
  hitValues: [3, 5, 7, 9, 10], highRingValue: 10, maxScore: 10,
};

export const TURKISH_TRADITIONAL: ScoringRule = {
  id: "turkish-traditional",
  rings: [
    { value: 9, labelKey: "targets.turkish.ring9" },
    { value: 7, labelKey: "targets.turkish.ring7" },
    { value: 5, labelKey: "targets.turkish.ring5" },
    { value: 3, labelKey: "targets.turkish.ring3" },
    { value: 1, labelKey: "targets.turkish.ring1" },
  ],
  hitValues: [1, 3, 5, 7, 9], highRingValue: 9, maxScore: 9,
};

export const ASIATIC_RING: ScoringRule = {
  id: "asiatic-ring",
  rings: [
    { value: 5, labelKey: "targets.asiatic.ring5" },
    { value: 3, labelKey: "targets.asiatic.ring3" },
    { value: 1, labelKey: "targets.asiatic.ring1" },
  ],
  hitValues: [1, 3, 5], highRingValue: 5, maxScore: 5,
};

export const ALL_RULES: ScoringRule[] = [FESPATI_LAPANGAN, WA_10_ZONE, WA_5_ZONE, NFAA, KOREAN_TRADITIONAL, TURKISH_TRADITIONAL, ASIATIC_RING];
