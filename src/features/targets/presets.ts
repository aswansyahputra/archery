import type { ComponentType, SVGProps } from "react";
import type { ScoringRule } from "@/features/scoring/engine";
import { ALL_RULES } from "@/features/targets/rules";
import { FespatiLapanganSvg } from "@/features/targets/FespatiLapanganSvg";
import { Wa10ZoneSvg } from "@/features/targets/Wa10ZoneSvg";
import { Wa5ZoneSvg, NfaaSvg, KoreanTraditionalSvg, TurkishTraditionalSvg, AsiaticRingSvg } from "@/features/targets/OtherTargets";

export interface TargetPreset {
  id: string;
  labelKey: string;
  rule: ScoringRule;
  defaultDistance: number;
  distances: number[];
  Svg: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
}

export const TARGET_PRESETS: TargetPreset[] = [
  { id: "fespati-lapangan", labelKey: "targets.fespatiLapangan.label", rule: ALL_RULES[0], defaultDistance: 18, distances: [18, 30, 50, 70], Svg: FespatiLapanganSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "wa-10zone", labelKey: "targets.wa10.label", rule: ALL_RULES[1], defaultDistance: 18, distances: [18, 30, 50, 70], Svg: Wa10ZoneSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "wa-5zone", labelKey: "targets.wa5.label", rule: ALL_RULES[2], defaultDistance: 15, distances: [15, 18, 30], Svg: Wa5ZoneSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "nfaa", labelKey: "targets.nfaa.label", rule: ALL_RULES[3], defaultDistance: 18, distances: [18, 25], Svg: NfaaSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "korean-traditional", labelKey: "targets.korean.label", rule: ALL_RULES[4], defaultDistance: 20, distances: [20, 30], Svg: KoreanTraditionalSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "turkish-traditional", labelKey: "targets.turkish.label", rule: ALL_RULES[5], defaultDistance: 20, distances: [15, 20, 30], Svg: TurkishTraditionalSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
  { id: "asiatic-ring", labelKey: "targets.asiatic.label", rule: ALL_RULES[6], defaultDistance: 20, distances: [15, 20, 30], Svg: AsiaticRingSvg as unknown as ComponentType<SVGProps<SVGSVGElement> & { size?: number }> },
];

export function getPreset(id: string): TargetPreset | undefined {
  return TARGET_PRESETS.find((t) => t.id === id);
}

export const DEFAULT_TARGET_ID = "fespati-lapangan";
