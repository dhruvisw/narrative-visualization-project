import { TimelineEvent } from '@/components/Timeline';

import case1Image from '@/assets/case-1-maya.jpg';
import case2Image from '@/assets/case-2-james.jpg';
import case3Image from '@/assets/case-3-sarah.jpg';
import case4Image from '@/assets/case-4-david.jpg';

export interface CaseStudy {
  id: number;
  title: string;
  hook: string;
  outcome: string;
  duration: string;
  trigger: string;
  context: string;
  triggerDetail: string;
  treatmentPath: string;
  changes: string;
  currentOutcome: string;
  timeline: TimelineEvent[];
  source: string;
  sourceUrl: string;
  image: string;
  imageAlt: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "Case Story 1: Treatment-Resistant Depression and Ketamine Therapy",
    hook: "This case story follows a patient with treatment-resistant depression who underwent ketamine infusion therapy.",
    outcome: "Symptom Improvement",
    duration: "Clinical study",
    trigger: "Treatment-resistant",
    context: "A patient suffering from severe treatment-resistant depression had experienced persistent depressive symptoms despite multiple previous therapies. Conventional antidepressants and treatment approaches failed to provide sustained improvement, leading clinicians to explore alternative treatment strategies.\n\nThe patient reported symptoms including persistent sadness, lack of motivation, emotional distress, and significant impairment in daily functioning.",
    triggerDetail: "Before the treatment began, clinicians conducted a detailed evaluation of the patient's condition. Depression severity was assessed using standardized clinical scales, while neurophysiological measurements such as EEG recordings were used to analyze brain activity patterns associated with depressive symptoms.\n\nThese baseline measurements helped researchers understand the patient's initial clinical and neurological state.",
    treatmentPath: "The patient received a series of ketamine infusions as part of the treatment protocol. Ketamine has been investigated as a rapid-acting treatment for severe depression, particularly for patients who do not respond to traditional antidepressant medication.\n\nThroughout the treatment period, clinicians monitored symptom changes and recorded neurological measurements to evaluate the therapy's effectiveness.",
    changes: "Following the ketamine infusions, the patient showed noticeable improvement in depressive symptoms. Clinical assessments indicated reduced depression severity and improvements in mood and emotional stability.\n\nAt the same time, neurophysiological data suggested measurable changes in brain activity patterns that corresponded with the patient's clinical improvement.",
    currentOutcome: "This case highlights the potential of combining clinical narratives with quantitative measurements such as EEG data to better understand treatment responses in depression.\n\nBy visualizing patient journeys through narrative storytelling and interactive data exploration, researchers and clinicians can gain deeper insights into treatment effects and mental health trajectories.",
    timeline: [
      { id: '1-1', title: 'Patient Background', description: 'Severe treatment-resistant depression with persistent symptoms despite multiple previous therapies.', phase: 'onset' },
      { id: '1-2', title: 'Clinical Evaluation', description: 'Baseline assessment using standardized clinical scales and EEG neurophysiological measurements.', phase: 'onset' },
      { id: '1-3', title: 'Ketamine Treatment', description: 'Series of ketamine infusions administered as part of the treatment protocol.', phase: 'treatment' },
      { id: '1-4', title: 'Symptom Monitoring', description: 'Clinicians monitored symptom changes and recorded neurological measurements throughout treatment.', phase: 'treatment' },
      { id: '1-5', title: 'Observed Improvement', description: 'Noticeable improvement in depressive symptoms with reduced severity and improved mood stability.', phase: 'changes' },
      { id: '1-6', title: 'Neurological Changes', description: 'Measurable changes in brain activity patterns corresponding with clinical improvement.', phase: 'changes' },
      { id: '1-7', title: 'Case Insights', description: 'Demonstrates the potential of combining clinical narratives with quantitative EEG data for understanding treatment responses.', phase: 'outcome' }
    ],
    source: "Frontiers in Psychiatry – Clinical study on ketamine treatment and neurophysiological changes in depression",
    sourceUrl: "https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2022.1020214/full",
    image: case3Image,
    imageAlt: "Narrative visualization of ketamine therapy in severe depression"
  },
  {
    id: 2,
    title: "Marcus and the Weight of Grief",
    hook: "When losing his father triggered a spiral into depression, one man found his way back through unexpected connections.",
    outcome: "Significant Improvement",
    duration: "3 years",
    trigger: "Bereavement",
    context: "Marcus, 45, had always been the stable one in his family. When his father passed away after a long illness, Marcus threw himself into work to cope. But within months, he found himself unable to concentrate, sleeping excessively, and isolating from loved ones.",
    triggerDetail: "The loss of his father, combined with unresolved childhood issues and the stress of being the family's emotional anchor, created a perfect storm. Marcus had never allowed himself to grieve properly.",
    treatmentPath: "Initially resistant to therapy, Marcus eventually agreed to try grief counseling at his wife's urging. He was prescribed medication for severe depression and began attending a men's grief support group.",
    changes: "The support group was transformative—Marcus had never discussed emotions with other men before. Therapy helped him process not just his father's death but their complicated relationship. He learned to ask for help.",
    currentOutcome: "Marcus maintains his mental health through regular therapy and has become a facilitator for the men's grief group. While he still has difficult days, he's developed tools to navigate them.",
    timeline: [
      { id: '2-1', title: 'Father\'s Passing', description: 'After a long illness, Marcus\'s father dies. Marcus takes on the role of family organizer.', phase: 'onset' },
      { id: '2-2', title: 'Work Escape & Decline', description: 'Attempts to bury grief in work; symptoms of depression begin to manifest.', phase: 'onset' },
      { id: '2-3', title: 'Crisis Point', description: 'Unable to function at work; wife insists on seeking professional help.', phase: 'onset' },
      { id: '2-4', title: 'Beginning Grief Counseling', description: 'Reluctantly starts therapy; prescribed antidepressants for severe depression.', phase: 'treatment' },
      { id: '2-5', title: 'Joining Men\'s Group', description: 'Discovers a grief support group for men; finds unexpected connection and validation.', phase: 'treatment' },
      { id: '2-6', title: 'Processing the Past', description: 'Therapy helps address complicated relationship with his father and family dynamics.', phase: 'changes' },
      { id: '2-7', title: 'New Purpose', description: 'Becomes a group facilitator; finds meaning in helping others through grief.', phase: 'outcome' }
    ],
    source: "Journal of Affective Disorders",
    sourceUrl: "https://www.sciencedirect.com/journal/journal-of-affective-disorders",
    image: case4Image,
    imageAlt: "A winding coastal path at sunset, representing the journey through grief toward peace"
  },
  {
    id: 3,
    title: "Elena's Battle with Treatment-Resistant Depression",
    hook: "After years of treatments that didn't work, a breakthrough came from an unexpected direction.",
    outcome: "Ongoing Management",
    duration: "7 years",
    trigger: "Chronic stress",
    context: "Elena, 38, had struggled with depression since her early twenties. Multiple medications provided only temporary relief. As a healthcare worker, she understood her condition intellectually but felt increasingly hopeless about ever feeling truly well.",
    triggerDetail: "Years of working in high-stress emergency medicine, combined with genetic predisposition and early life trauma, created a form of depression that proved resistant to standard treatments.",
    treatmentPath: "Elena tried numerous medications, several therapists, and even electroconvulsive therapy. Finally, she was referred to a specialized program that combined transcranial magnetic stimulation (TMS) with intensive outpatient therapy.",
    changes: "TMS provided the first sustained improvement Elena had experienced in years. Combined with trauma-focused therapy and lifestyle changes including reduced work hours, she began to stabilize.",
    currentOutcome: "Elena's depression hasn't disappeared, but it's now manageable. She's reduced her clinical hours and works part-time in mental health advocacy. She views her journey as ongoing rather than complete.",
    timeline: [
      { id: '3-1', title: 'First Episode', description: 'Depression emerges in early twenties; first medication trial provides temporary relief.', phase: 'onset' },
      { id: '3-2', title: 'Years of Trial and Error', description: 'Multiple medications and therapies fail to provide lasting improvement.', phase: 'treatment' },
      { id: '3-3', title: 'ECT Treatment', description: 'Undergoes electroconvulsive therapy; experiences temporary improvement only.', phase: 'treatment' },
      { id: '3-4', title: 'Referral to Specialty Program', description: 'Begins transcranial magnetic stimulation combined with intensive therapy.', phase: 'treatment' },
      { id: '3-5', title: 'First Sustained Improvement', description: 'TMS provides breakthrough; depression symptoms significantly reduce.', phase: 'changes' },
      { id: '3-6', title: 'Lifestyle Restructuring', description: 'Reduces work hours; focuses on sleep, exercise, and stress reduction.', phase: 'changes' },
      { id: '3-7', title: 'Finding Balance', description: 'Achieves stable management; works part-time in mental health advocacy.', phase: 'outcome' }
    ],
    source: "Lancet Psychiatry",
    sourceUrl: "https://www.thelancet.com/journals/lanpsy/",
    image: case2Image,
    imageAlt: "A peaceful forest path with dappled sunlight, symbolizing finding calm and renewal"
  },
  {
    id: 4,
    title: "James: A Young Person's Path to Wellness",
    hook: "Diagnosed at 19, James navigated college, relationships, and identity while learning to live with depression.",
    outcome: "Thriving",
    duration: "5 years",
    trigger: "Academic pressure",
    context: "James, now 24, was a high-achieving student who began experiencing depression during his freshman year of college. The transition from a small town to a large university, combined with academic pressure and loneliness, triggered his first major episode.",
    triggerDetail: "Away from his support system for the first time, James struggled with the anonymity of university life. Imposter syndrome and social anxiety compounded his depression, leading to withdrawal from classes.",
    treatmentPath: "After a crisis call to campus counseling, James was connected with a therapist who specialized in young adults. He tried medication briefly but found therapy and lifestyle changes more effective for his situation.",
    changes: "Therapy helped James understand his perfectionistic patterns. He learned to set realistic expectations and build genuine connections. Mindfulness meditation became a daily practice, and he found community through mental health advocacy.",
    currentOutcome: "James graduated and works in tech while running a mental health peer support group for young professionals. He considers depression part of his story but not his defining characteristic.",
    timeline: [
      { id: '4-1', title: 'Transition to College', description: 'Leaves small town for large university; struggles with anonymity and loneliness.', phase: 'onset' },
      { id: '4-2', title: 'Academic Breakdown', description: 'Depression worsens; withdraws from classes mid-semester.', phase: 'onset' },
      { id: '4-3', title: 'Crisis Intervention', description: 'Campus counseling provides immediate support; connects with specialized therapist.', phase: 'treatment' },
      { id: '4-4', title: 'Understanding Patterns', description: 'Therapy reveals perfectionistic tendencies and social anxiety underlying depression.', phase: 'treatment' },
      { id: '4-5', title: 'Building New Habits', description: 'Develops mindfulness practice; creates realistic academic expectations.', phase: 'changes' },
      { id: '4-6', title: 'Finding Community', description: 'Joins mental health advocacy group; forms genuine friendships with peers.', phase: 'changes' },
      { id: '4-7', title: 'Graduation & Growth', description: 'Completes degree; launches career while leading peer support initiatives.', phase: 'outcome' }
    ],
    source: "American Journal of Psychiatry",
    sourceUrl: "https://ajp.psychiatryonline.org/",
    image: case1Image,
    imageAlt: "Soft morning sunlight streaming through a window onto an open book, representing academic recovery and hope"
  }
];
