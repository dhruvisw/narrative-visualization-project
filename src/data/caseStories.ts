// Structured case dataset for the Comparative Dashboard.
// Source of truth — do not invent unsupported facts beyond this dataset.

export interface CaseStory {
  id: string;
  label: string;
  sourceLabel: string;
  sourceUrl: string;
  title: string;
  age: number | null;
  ageGroup: 'young adult' | 'middle-aged';
  gender: 'male' | 'female';
  primaryPattern: string[];
  comorbidities: string[];
  contributingFactors: string[];
  treatmentHistory: string[];
  whatHelped: string[];
  timePattern: string[];
  severityIndicators: string[];
  symptomHighlights: string[];
  summary: string;
  timelineSteps: string[];
  keyTakeaway: string;
}

export const caseStories: CaseStory[] = [
  {
    id: 'case_1',
    label: 'Case 1',
    sourceLabel: 'Frontiers in Psychiatry (2022)',
    sourceUrl:
      'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1020214/full',
    title:
      'Medical student with treatment-resistant depression, PTSD, GAD, and chronic suicidal ideation',
    age: 30,
    ageGroup: 'young adult',
    gender: 'male',
    primaryPattern: ['treatment-resistant depression', 'chronic suicidality'],
    comorbidities: ['anxiety', 'PTSD', 'suicidality'],
    contributingFactors: [
      'academic/professional stress',
      'trauma-related context',
      'childhood instability',
      'chronic pain',
    ],
    treatmentHistory: ['therapy', 'lifestyle changes', 'multiple antidepressants'],
    whatHelped: ['IV ketamine', 'ketamine-assisted psychotherapy', 'psychotherapy'],
    timePattern: ['chronic', 'long-term', 'improved over months'],
    severityIndicators: [
      '5 years daily suicidal ideation',
      'severe depression',
      'functional impact',
    ],
    symptomHighlights: [
      'depressed mood',
      'anhedonia',
      'insomnia',
      'nightmares',
      'low energy',
      'loss of appetite',
      'poor concentration',
      'social withdrawal',
      'worthlessness',
    ],
    summary:
      'A 30-year-old male medical student experienced treatment-resistant depression alongside GAD, PTSD, and years of daily suicidal ideation. Previous therapy, lifestyle changes, and several antidepressants had little effect. Over an extended ketamine-based treatment course with psychotherapy support, suicidality and PTSD improved first, followed later by remission of depression and anxiety symptoms.',
    timelineSteps: [
      'Long-standing depression, PTSD, GAD, and daily suicidal ideation',
      'Prior therapy, lifestyle changes, and multiple antidepressants brought little relief',
      'Started IV ketamine infusions with ketamine-assisted psychotherapy',
      'Suicidality and PTSD improved within the first month',
      'Depression and GAD later remitted over the following months',
    ],
    keyTakeaway:
      'Depression can coexist with trauma, anxiety, and suicidality, and meaningful improvement may happen in stages rather than all at once.',
  },
  {
    id: 'case_2',
    label: 'Case 2',
    sourceLabel: 'ScienceDirect / Case Reports (2024)',
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S2773021224000245',
    title: 'Young female with treatment-resistant depression and difficult-to-sustain remission',
    age: null,
    ageGroup: 'young adult',
    gender: 'female',
    primaryPattern: ['treatment-resistant depression', 'difficult remission'],
    comorbidities: [],
    contributingFactors: ['quality-of-life impact', 'complex treatment response'],
    treatmentHistory: ['antidepressants', 'mood stabilizers', 'therapy', 'ECT'],
    whatHelped: ['IV ketamine', 'pramipexole'],
    timePattern: ['hard to sustain remission', 'recurrent difficulty'],
    severityIndicators: ['treatment resistance', 'strong quality-of-life impact'],
    symptomHighlights: [
      'persistent depressive burden',
      'difficulty reaching sustainable remission',
    ],
    summary:
      'This case centers on a young adult female with treatment-resistant depression whose condition significantly affected quality of life. Multiple prior interventions had not produced sustainable remission. Improvement was reported after combining biweekly IV ketamine infusions with oral pramipexole.',
    timelineSteps: [
      'Depression remained difficult to treat despite multiple prior interventions',
      'Several treatment approaches were attempted, including antidepressants, mood stabilizers, therapy, and ECT',
      'Sustainable remission remained difficult to achieve',
      'Combination treatment with ketamine and pramipexole was introduced',
      'Clinical improvement followed the combination approach',
    ],
    keyTakeaway:
      'Even when two people both have treatment-resistant depression, what helps one person may differ, and combination treatment may matter.',
  },
  {
    id: 'case_3',
    label: 'Case 3',
    sourceLabel: 'Case Reports in Clinical Medicine / SCIRP (2024)',
    sourceUrl: 'https://www.scirp.org/journal/paperinformation?paperid=136810',
    title:
      '51-year-old woman with anxiety, depression, suicidal ideation, and cyclical worsening before menstruation',
    age: 51,
    ageGroup: 'middle-aged',
    gender: 'female',
    primaryPattern: ['cyclical worsening', 'depression with medical contributors'],
    comorbidities: ['anxiety', 'suicidality', 'medical contributors'],
    contributingFactors: [
      'hormonal factors',
      'thyroid-related factors',
      'vitamin deficiencies',
    ],
    treatmentHistory: [
      'psychiatric interventions',
      'psychiatric medication only was insufficient',
    ],
    whatHelped: [
      'broader diagnostic workup',
      'medical evaluation',
      'identifying contributing medical factors',
    ],
    timePattern: ['cyclical', 'worsens before menstruation', '3-4 day episodes'],
    severityIndicators: ['suicidal ideation', 'recurrent functional disruption'],
    symptomHighlights: [
      'low energy',
      'depression',
      'shortness of breath',
      'difficulty focusing',
      'suicidal thoughts',
      'repetitive thoughts',
      'social withdrawal',
      'feeling out of control',
    ],
    summary:
      'A 51-year-old female experienced anxiety, depression, and suicidal ideation that worsened about a week before menstruation and lasted several days. Psychiatric treatment alone was not enough. The case emphasizes the importance of investigating broader medical contributors, including hormonal imbalance, hypothyroidism, and vitamin deficiencies.',
    timelineSteps: [
      'Repeated episodes of worsening anxiety and depression',
      'Symptoms consistently intensified before menstruation',
      'Psychiatric interventions alone did not fully explain or resolve the pattern',
      'Broader diagnostic evaluation identified medical contributors',
      'The case highlighted the importance of looking beyond a narrow psychiatric-only lens',
    ],
    keyTakeaway:
      'Depression and suicidal thoughts can be shaped by hormonal and medical factors, so context and broader assessment matter.',
  },
];

export type FilterGroupKey =
  | 'ageGroup'
  | 'gender'
  | 'primaryPattern'
  | 'comorbidities'
  | 'contributingFactors'
  | 'treatmentHistory'
  | 'whatHelped'
  | 'timePattern'
  | 'severityIndicators';

export interface FilterGroup {
  key: FilterGroupKey;
  label: string;
  values: string[];
}

export const filterGroups: FilterGroup[] = [
  { key: 'ageGroup', label: 'Age group', values: ['young adult', 'middle-aged'] },
  { key: 'gender', label: 'Gender', values: ['male', 'female'] },
  {
    key: 'primaryPattern',
    label: 'Primary pattern',
    values: [
      'treatment-resistant depression',
      'chronic suicidality',
      'difficult remission',
      'cyclical worsening',
      'depression with medical contributors',
    ],
  },
  {
    key: 'comorbidities',
    label: 'Comorbidities',
    values: ['anxiety', 'PTSD', 'suicidality', 'medical contributors'],
  },
  {
    key: 'contributingFactors',
    label: 'Contributing factors',
    values: [
      'academic/professional stress',
      'trauma-related context',
      'childhood instability',
      'chronic pain',
      'quality-of-life impact',
      'hormonal factors',
      'thyroid-related factors',
      'vitamin deficiencies',
    ],
  },
  {
    key: 'treatmentHistory',
    label: 'Treatment history',
    values: [
      'therapy',
      'lifestyle changes',
      'multiple antidepressants',
      'antidepressants',
      'mood stabilizers',
      'ECT',
      'psychiatric interventions',
      'psychiatric medication only was insufficient',
    ],
  },
  {
    key: 'whatHelped',
    label: 'What helped',
    values: [
      'IV ketamine',
      'ketamine-assisted psychotherapy',
      'psychotherapy',
      'pramipexole',
      'broader diagnostic workup',
      'medical evaluation',
      'identifying contributing medical factors',
    ],
  },
  {
    key: 'timePattern',
    label: 'Time pattern',
    values: [
      'chronic',
      'long-term',
      'improved over months',
      'hard to sustain remission',
      'recurrent difficulty',
      'cyclical',
      'worsens before menstruation',
      '3-4 day episodes',
    ],
  },
  {
    key: 'severityIndicators',
    label: 'Severity indicators',
    values: [
      '5 years daily suicidal ideation',
      'severe depression',
      'functional impact',
      'treatment resistance',
      'strong quality-of-life impact',
      'suicidal ideation',
      'recurrent functional disruption',
    ],
  },
];

/** Build a dynamic insight string based on which case ids are visible. */
export function buildInsight(visibleIds: string[]): string {
  const ids = new Set(visibleIds);
  if (ids.size === 0) {
    return 'No cases match the current filters. Try removing some filters to explore the journeys.';
  }
  if (ids.size === 3) {
    return 'All three cases are visible. Notice how depression differs across presentation, timing, severity, and what eventually helped — there is no single template.';
  }
  if (ids.has('case_1') && ids.has('case_3')) {
    return 'These cases show that depression can be shaped by very different forces — trauma-related context in one, and medical and hormonal contributors in the other.';
  }
  if (ids.has('case_1') && ids.has('case_2')) {
    return 'Both cases involve treatment-resistant depression, yet the treatment histories and trajectories diverge. What helps one person may not be what helps another.';
  }
  if (ids.has('case_2') && ids.has('case_3')) {
    return 'One case struggles to sustain remission; the other follows a cyclical pattern tied to medical factors. Timing and context shape the experience differently.';
  }
  if (ids.has('case_1')) {
    return 'A long, chronic course with trauma and anxiety alongside depression — improvement came in stages rather than all at once.';
  }
  if (ids.has('case_2')) {
    return 'Treatment-resistant depression where sustainable remission was difficult — a combination approach made the difference.';
  }
  // case_3 only
  return 'A cyclical pattern worsening before menstruation, where a broader medical workup mattered as much as psychiatric care.';
}
