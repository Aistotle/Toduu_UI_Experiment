import React from 'react';
import { LabSectionMetadata } from '../components/LabSection';
import { Idea01Overview } from './idea1/Idea01Overview';
import { Idea01Hero } from './idea1/Idea01Hero';
import { Idea01Introduction } from './idea1/Idea01Introduction';
import { Idea01ScaleLadder } from './idea1/Idea01ScaleLadder';
import { Idea01RhythmVignette } from './idea1/Idea01RhythmVignette';
import { Idea01SpacingStates } from './idea1/Idea01SpacingStates';
import { Idea01VoicePersonas } from './idea1/Idea01VoicePersonas';
import { Idea01WeightCascade } from './idea1/Idea01WeightCascade';
import { Idea01Conclusion } from './idea1/Idea01Conclusion';
import { Idea02TrackingSection } from './idea2/TrackingSection';
import { Idea02VoiceCards } from './idea2/VoiceCards';
import { Idea02SilenceBox } from './idea2/SilenceBox';
import { Idea03HeroStudy } from './idea3/HeroStudy';
import { Idea03ScaleStudy } from './idea3/ScaleStudy';
import { Idea03ScaleHierarchyDraft } from './idea3/ScaleHierarchyDraft';
import { Idea03SpacingStudy } from './idea3/SpacingStudy';
import { Idea03VoiceCarousel } from './idea3/VoiceCarousel';
import { Idea03SilencePanel } from './idea3/SilencePanel';
import { Idea04Hero } from './idea4/Hero';
import { Idea04ScaleSection } from './idea4/ScaleSection';
import { Idea04WeightSection } from './idea4/WeightSection';
import { Idea04RhythmSection } from './idea4/RhythmSection';
import { Idea04TypefaceSection } from './idea4/TypefaceSection';
import { Idea04SilenceSection } from './idea4/SilenceSection';
import { LazyIdea05Section } from './idea5/LazyIdea05Section';

export type LabSectionConfig = LabSectionMetadata & {
  Component: React.ComponentType;
};

const Placeholder: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-2xl border border-dashed border-black/20 bg-black/5 p-6 text-sm text-black/60">
    {message}
  </div>
);

const idea01Summary = 'GSAP-powered essay with interactive modules for scale, weight, rhythm, spacing, voice, and silence.';
const idea02Summary = 'Scroll-step experience featuring tracking sliders, microcopy cadences, and hover-driven silence blocks.';
const idea03Summary = 'React + GSAP story with pinned hero, sticky spacing experiments, and a horizontal voice carousel.';
const idea04Summary = 'Interaction deck pairing alternating copy blocks with sliders that drive typography demos.';
const idea05Summary = 'Framer Motion-led chapters with progress bar, scale dial, mouse-driven weight painting, and rhythm controls.';

export const labSectionConfigs: LabSectionConfig[] = [
  {
    id: 'idea-01-hero',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Gradient Playfair Hero',
    summary: 'Stacked Playfair Display hero with mono “scroll to explore” prompt and GSAP intro.',
    status: 'porting',
    tags: ['Hero', 'Playfair Display', 'GSAP'],
    layout: 'full',
    Component: Idea01Hero,
  },
  {
    id: 'idea-01-intro',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Thesis Introduction',
    summary: 'Centered thesis paragraphs describing typography as voice with staged reveals.',
    status: 'porting',
    tags: ['Thesis', 'Voice', 'GSAP Reveal'],
    Component: Idea01Introduction,
  },
  {
    id: 'idea-01-scale',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Scale Ladder',
    summary: 'Click-to-enlarge ladder from ENORMOUS down to whisper, mirroring the GSAP pulses from the HTML study.',
    status: 'porting',
    tags: ['Scale', 'GSAP', 'Click Interaction'],
    Component: Idea01ScaleLadder,
  },
  {
    id: 'idea-01',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Immersive Scroll Narrative',
    summary: idea01Summary,
    status: 'porting',
    tags: ['GSAP', 'Click + Hover Micro Interactions', 'Negative Space'],
    Component: Idea01Overview,
  },
  {
    id: 'idea-01-rhythm',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Rhythm Vignette',
    summary: 'Line-height ladder that stages tight, balanced, and generous breathing between paragraphs.',
    status: 'porting',
    tags: ['Rhythm', 'Line Height', 'Hover'],
    Component: Idea01RhythmVignette,
  },
  {
    id: 'idea-01-weight',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Weight Cascade',
    summary: 'Five-line Playfair ladder progressing from 100 -> 900 with a reveal animation.',
    status: 'porting',
    tags: ['GSAP', 'Weight', 'Playfair Display'],
    Component: Idea01WeightCascade,
  },
  {
    id: 'idea-01-spacing',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Spacing States',
    summary: 'Letter-spacing ladder traveling from tight tension to expansive calm.',
    status: 'porting',
    tags: ['Spacing', 'Hover Interaction'],
    Component: Idea01SpacingStates,
  },
  {
    id: 'idea-01-voice',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Voice Personas',
    summary: 'Four-line specimen where each sentence swaps fonts to show tonal personality.',
    status: 'porting',
    tags: ['Voice', 'Fonts', 'Hover Interaction'],
    Component: Idea01VoicePersonas,
  },
  {
    id: 'idea-01-conclusion',
    source: 'new-ideas-1.html',
    title: 'Idea 01 — Conclusion',
    summary: '“The Craft Continues” gradient coda capped with a mono thank-you, replaying GSAP reveal beats.',
    status: 'porting',
    tags: ['GSAP', 'Reveal Animation', 'Gradient'],
    Component: Idea01Conclusion,
  },
  {
    id: 'idea-02-tracking',
    source: 'new-ideas-2.html',
    title: 'Idea 02 — Tracking Slider',
    summary: idea02Summary,
    status: 'porting',
    tags: ['Intersection Observer', 'Tracking Slider', 'Voice Cards'],
    Component: Idea02TrackingSection,
  },
  {
    id: 'idea-02-voice',
    source: 'new-ideas-2.html',
    title: 'Idea 02 — Voice Cards',
    summary: 'IntersectionObserver-driven cards describing serif/sans/mono personalities.',
    status: 'porting',
    tags: ['Intersection Observer', 'Voice Cards'],
    Component: Idea02VoiceCards,
  },
  {
    id: 'idea-02-silence',
    source: 'new-ideas-2.html',
    title: 'Idea 02 — Silence Box',
    summary: 'Hover-to-fade silence experience from the HTML scroll essay.',
    status: 'porting',
    tags: ['Hover Interaction', 'Negative Space'],
    Component: Idea02SilenceBox,
  },
  {
    id: 'idea-03-hero',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Hero Parallax Study',
    summary: idea03Summary,
    status: 'porting',
    tags: ['Pinned Hero', 'GSAP', 'React'],
    Component: Idea03HeroStudy,
  },
  {
    id: 'idea-03-scale',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Scale Pin',
    summary: 'Pinned viewport that expands “HIERARCHY” across the screen to demonstrate typographic dominance.',
    status: 'porting',
    tags: ['GSAP', 'Pinned Viewport', 'Scale'],
    Component: Idea03ScaleStudy,
  },
  {
    id: 'idea-03-spacing',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Spacing Study',
    summary: 'Sticky viewport where “BREATHE” expands and “TENSION” compresses to demonstrate rhythm shifts.',
    status: 'porting',
    tags: ['GSAP', 'Pinned Viewport', 'Spacing'],
    Component: Idea03SpacingStudy,
  },
  {
    id: 'idea-03-voice',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Voice Carousel',
    summary: 'Horizontal snap carousel cycling through four typographic voices.',
    status: 'porting',
    tags: ['GSAP', 'Horizontal Scroll', 'Voice'],
    Component: Idea03VoiceCarousel,
  },
  {
    id: 'idea-03-silence',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Silence Grid',
    summary: 'Negative space grid mixing serif copy with breathing room.',
    status: 'porting',
    tags: ['Negative Space', 'Serif'],
    Component: Idea03SilencePanel,
  },
  {
    id: 'idea-04-hero',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Hero',
    summary: idea04Summary,
    status: 'porting',
    tags: ['Hero', 'Gradient', 'React'],
    Component: Idea04Hero,
  },
  {
    id: 'idea-04-scale',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Scale Slider',
    summary: 'Scale slider toggling typographic hierarchy.',
    status: 'porting',
    tags: ['Slider', 'Scale'],
    Component: Idea04ScaleSection,
  },
  {
    id: 'idea-04-weight',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Weight Slider',
    summary: 'Weight control demonstrating shout vs whisper.',
    status: 'porting',
    tags: ['Slider', 'Weight'],
    Component: Idea04WeightSection,
  },
  {
    id: 'idea-04-rhythm',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Rhythm Controls',
    summary: 'Leading + tracking controls for breathing room.',
    status: 'porting',
    tags: ['Slider', 'Rhythm'],
    Component: Idea04RhythmSection,
  },
  {
    id: 'idea-04-type',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Typeface Toggle',
    summary: 'Buttons swapping among sans, serif, mono voices.',
    status: 'porting',
    tags: ['Voice', 'Buttons'],
    Component: Idea04TypefaceSection,
  },
  {
    id: 'idea-04-silence',
    source: 'new-ideas-4.html',
    title: 'Idea 04 — Silence Slider',
    summary: 'Padding slider that emulates the negative-space demo.',
    status: 'porting',
    tags: ['Slider', 'Negative Space'],
    Component: Idea04SilenceSection,
  },
  {
    id: 'idea-05',
    source: 'new-ideas-5.html',
    title: 'Idea 05 — Framer Motion Chapters',
    summary: idea05Summary,
    status: 'porting',
    tags: ['Framer Motion', 'Progress Indicator', 'Variable Fonts'],
    Component: LazyIdea05Section,
  },
  {
    id: 'idea-03-scale-draft',
    source: 'new-ideas-3.html',
    title: 'Idea 03 — Scale = Hierarchy (Draft)',
    summary: 'A sandbox copy of the pinned Scale = Hierarchy viewport for upcoming explorations.',
    status: 'porting',
    tags: ['GSAP', 'Pinned Viewport', 'Scale'],
    Component: Idea03ScaleHierarchyDraft,
  },
];

export default labSectionConfigs;
