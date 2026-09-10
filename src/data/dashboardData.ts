// Structured dashboard data per case, per phase, per view.
// Designed to be easily extended to multiple cases later.

export type PhaseKey = 'before' | 'early' | 'mid' | 'after';
export type ViewKey = 'experience' | 'clinical' | 'eeg';

export interface ExperienceContent {
  summary: string;
  quote: string;
}

export interface ClinicalContent {
  symptoms: string[];
  treatmentStep: string;
  response: string[];
}

export interface EEGContent {
  trend: 'up' | 'down' | 'stable' | 'mixed';
  trendLabel: string;
  meaning: string;
  notMeaning: string;
}

export interface PhaseContent {
  experience: ExperienceContent;
  clinical: ClinicalContent;
  eeg: EEGContent;
}

/**
 * Simple 0–3 ordinal scale derived from the narrative summary.
 * 0 = none/very low, 1 = low, 2 = medium, 3 = high.
 * NOT a clinical measurement.
 */
export type NarrativeScore = 0 | 1 | 2 | 3;

export interface PhaseMetrics {
  // Experience view (patient-reported)
  mood: NarrativeScore;        // mood quality (higher = better mood)
  sleep: NarrativeScore;       // sleep quality (higher = better)
  motivation: NarrativeScore;  // motivation/energy (higher = better)
  // Clinical view (symptom clusters; higher = MORE symptoms)
  depressiveSymptoms: NarrativeScore;
  functionalImpairment: NarrativeScore;
  treatmentResponse: NarrativeScore; // higher = better response
  // Brain / EEG view (single neural marker, abstract index 0–3)
  eegMarker: NarrativeScore;   // higher = pattern more associated w/ improved regulation
}

export interface DashboardCase {
  id: number;
  title: string;
  shortLabel: string;
  whatThisCaseShows: string[];
  phases: Record<PhaseKey, PhaseContent>;
  metrics: Record<PhaseKey, PhaseMetrics>;
  keyDifferences: {
    symptoms: string;
    dailyLife: string;
    treatmentEeg: string;
  };
}

export const scoreLabel = (s: NarrativeScore): string =>
  ['None', 'Low', 'Medium', 'High'][s];

export const phaseOrder: { key: PhaseKey; label: string; short: string }[] = [
  { key: 'before', label: 'Before treatment', short: 'Before' },
  { key: 'early', label: 'Early treatment', short: 'Early' },
  { key: 'mid', label: 'Mid treatment', short: 'Mid' },
  { key: 'after', label: 'After / Follow-up', short: 'After' },
];

export const viewOptions: { key: ViewKey; label: string; description: string }[] = [
  { key: 'experience', label: 'Experience', description: 'The patient\'s perspective' },
  { key: 'clinical', label: 'Clinical', description: 'Symptoms, treatment, response' },
  { key: 'eeg', label: 'Brain / EEG', description: 'Brain activity signals' },
];

export const eegGlossary: Record<string, string> = {
  EEG: 'Electroencephalography — a non-invasive recording of electrical activity from the scalp.',
  'alpha activity': 'Brain rhythms (~8–12 Hz) often linked to relaxed wakefulness.',
  'gamma activity': 'Faster brain rhythms (~30+ Hz) linked to attention and cortical processing.',
  connectivity: 'How synchronized different brain regions are during a recording.',
};

export const dashboardCases: DashboardCase[] = [
  {
    id: 1,
    title: 'Treatment-Resistant Depression and Ketamine Therapy',
    shortLabel: 'Ketamine case',
    whatThisCaseShows: [
      'Ketamine is not a miracle cure — improvements observed here are partial and need follow-up.',
      'Recovery is uneven: clinical scores, daily experience, and EEG can change at different speeds.',
      'Context matters — this patient had failed multiple prior treatments, so results may not generalize.',
    ],
    phases: {
      before: {
        experience: {
          summary:
            'The patient describes years of persistent sadness, low motivation, and emotional exhaustion. Previous treatments brought little or no lasting relief.',
          quote:
            '"I had tried so many things — nothing seemed to reach the part of me that was stuck."',
        },
        clinical: {
          symptoms: [
            'Severe, persistent depressed mood',
            'Marked loss of motivation and energy',
            'Impairment in daily functioning',
            'Non-response to multiple prior antidepressants',
          ],
          treatmentStep: 'Baseline evaluation — no active new treatment yet.',
          response: [
            'Standardized depression scales confirm severe symptoms',
            'EEG recorded as a neurophysiological baseline',
          ],
        },
        eeg: {
          trend: 'stable',
          trendLabel: 'Baseline pattern',
          meaning:
            'EEG shows the patient\'s starting brain-activity pattern, used as a reference for later comparison.',
          notMeaning:
            'It does not by itself diagnose depression or predict who will respond to ketamine.',
        },
      },
      early: {
        experience: {
          summary:
            'After the first ketamine infusion, the patient notices small shifts — a brief sense of lightness — but symptoms remain mostly present.',
          quote:
            '"For a few hours afterwards, the heaviness lifted a little. Then it came back, but not quite as strong."',
        },
        clinical: {
          symptoms: [
            'Severe symptoms still dominant',
            'Possible short-lived mood improvement after infusion',
          ],
          treatmentStep: 'First ketamine infusions administered under monitoring.',
          response: [
            'Clinicians track tolerability and side effects',
            'Early EEG changes recorded for comparison',
          ],
        },
        eeg: {
          trend: 'mixed',
          trendLabel: 'Early shifts',
          meaning:
            'Some short-term changes in brain rhythms appear soon after infusion, consistent with ketamine\'s known acute effects.',
          notMeaning:
            'Early EEG shifts do not guarantee that clinical symptoms will improve in the longer term.',
        },
      },
      mid: {
        experience: {
          summary:
            'Across repeated infusions, the patient reports more good days than bad, improved sleep, and re-engaging with small daily activities.',
          quote:
            '"I started answering messages again. That sounds small, but for me it was huge."',
        },
        clinical: {
          symptoms: [
            'Reduction on depression-severity scales',
            'Improved mood and emotional stability',
            'Better sleep and basic daily functioning',
          ],
          treatmentStep: 'Continued ketamine infusion series with regular monitoring.',
          response: [
            'Clinical scores trend downward over time',
            'EEG patterns show measurable changes alongside clinical improvement',
          ],
        },
        eeg: {
          trend: 'up',
          trendLabel: 'Patterns shifting',
          meaning:
            'Brain-activity patterns shift in a direction that researchers associate with improved mood regulation.',
          notMeaning:
            'These patterns are correlational — they do not prove ketamine "fixes" depression at the brain level.',
        },
      },
      after: {
        experience: {
          summary:
            'At follow-up, the patient feels more like themselves but is aware that maintenance and support are still needed to stay well.',
          quote:
            '"I\'m not magically cured. I\'m just back in my own life — and I want to keep it that way."',
        },
        clinical: {
          symptoms: [
            'Residual but reduced depressive symptoms',
            'Improved overall functioning vs. baseline',
            'Need for continued monitoring and support',
          ],
          treatmentStep: 'Follow-up assessments and maintenance planning.',
          response: [
            'Sustained, partial clinical improvement',
            'EEG pattern differs from baseline in a stable way',
          ],
        },
        eeg: {
          trend: 'up',
          trendLabel: 'Sustained difference vs. baseline',
          meaning:
            'Follow-up EEG shows a pattern measurably different from baseline, in line with the patient\'s clinical improvement.',
          notMeaning:
            'It does not mean the brain is "back to normal" or that relapse is impossible.',
        },
      },
    },
    metrics: {
      before: { mood: 0, sleep: 1, motivation: 0, depressiveSymptoms: 3, functionalImpairment: 3, treatmentResponse: 0, eegMarker: 1 },
      early:  { mood: 1, sleep: 1, motivation: 1, depressiveSymptoms: 3, functionalImpairment: 2, treatmentResponse: 1, eegMarker: 1 },
      mid:    { mood: 2, sleep: 2, motivation: 2, depressiveSymptoms: 2, functionalImpairment: 2, treatmentResponse: 2, eegMarker: 2 },
      after:  { mood: 2, sleep: 3, motivation: 2, depressiveSymptoms: 1, functionalImpairment: 1, treatmentResponse: 3, eegMarker: 3 },
    },
    keyDifferences: {
      symptoms:
        'Symptoms shift from severe and persistent to reduced but still present — a meaningful improvement, not a full remission.',
      dailyLife:
        'Daily life moves from withdrawn and impaired to re-engaged with small, meaningful routines.',
      treatmentEeg:
        'After a series of ketamine infusions, EEG patterns differ from baseline in directions associated with improved mood regulation.',
    },
  },
];
