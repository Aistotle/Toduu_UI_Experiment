import React from 'react';
import { SampleSection } from './SampleSection';
import {
  ClockDemo,
  ElevatorDemo,
  GravityDemo,
  HighDemo,
  ParallelDemo,
  TsunamiDemo,
  SmileDemo,
  VoyeurDemo,
  ZipperDemo,
  MoonDemo,
  TunnelDemo,
  SpidermanDemo,
} from './TypographicDemos';

const showcaseSections = [
  {
    title: 'Meaning in Form',
    description:
      "The most fundamental principle of expressive typography is that the shape of letters can embody the word's meaning. Form isn't just decoration; it's a vehicle for the message itself.",
    demo: <ClockDemo />,
  },
  {
    title: 'Interaction & Personality',
    description:
      'By responding to the user, type can gain personality and character. A simple hover or click can transform static letters into a dynamic, playful experience that draws the user deeper into the narrative.',
    demo: <GravityDemo />,
  },
  {
    title: 'Space as a Storyteller',
    description:
      'The space around and within letterforms—kerning, leading, and alignment—can be manipulated to create tension, harmony, or emphasis. Here, verticality and position dramatically alter our interpretation.',
    demo: <HighDemo />,
  },
  {
    title: 'Composition & Structure',
    description:
      "Typography is architecture on a small scale. The arrangement of elements can convey order, chaos, and relationships. Clean, strong lines can define a word's essence before it's even read.",
    demo: <ParallelDemo />,
  },
  {
    title: 'Motion & Emotion',
    description:
      'Animation breathes life into static type. The path and rhythm of motion can evoke powerful emotions, turning a simple word into a cinematic event.',
    demo: <TsunamiDemo />,
  },
  {
    title: 'Form as Function',
    description:
      'Sometimes, typography can transcend its role as a message and become an interface. When letterforms hint at an action, they invite interaction and create a witty, self-referential loop.',
    demo: <ElevatorDemo />,
  },
  {
    title: 'Anthropomorphism & Character',
    description:
      'Giving letters human-like features and expressions infuses them with personality. A simple dot or curve can transform a letter into a character, conveying emotion and tone in a single, witty gesture.',
    demo: <SmileDemo />,
  },
  {
    title: 'Gaze & Direction',
    description:
      'Typography can do more than just sit on the page; it can look back. By embedding a sense of gaze, letterforms can create a dynamic, sometimes unsettling relationship with the viewer.',
    demo: <VoyeurDemo />,
  },
  {
    title: 'Functional Form & Direct Manipulation',
    description:
      "When typography mimics a real-world object, it invites interaction. The form itself becomes a user interface, blurring the line between reading a word and using an object, creating a satisfying and memorable experience.",
    demo: <ZipperDemo />,
  },
  {
    title: 'Transformation & Cycles',
    description:
      'Static letters can represent dynamic processes. Through interaction, a word can illustrate a cycle, a transformation, or the passage of time, encoding a complex narrative into its very form.',
    demo: <MoonDemo />,
  },
  {
    title: 'Perspective & Depth',
    description:
      'Two-dimensional letters can be arranged to create a powerful illusion of depth. By manipulating perspective and reacting to the user\'s viewpoint, type can build a three-dimensional space on a flat screen.',
    demo: <TunnelDemo />,
  },
  {
    title: 'Physics & Weight',
    description:
      "By responding to user input with simulated physics, letterforms can gain a sense of weight and materiality. This makes them feel tangible and grounded, adding a layer of playful realism.",
    demo: <SpidermanDemo />,
  },
];

export const InteractiveShowcase: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-8 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-20">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.6em] text-[color:rgba(17,17,17,0.45)]">Micro-Lab</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight mt-6 text-[var(--ink)]">
            A dozen typographic toys that react to you.
          </h2>
          <p className="mt-4 text-lg text-[color:rgba(17,17,17,0.65)] leading-relaxed">
            We lifted the freshest studies from the interactive lab and folded them directly into the performance. Scroll
            down and poke at each one—every word carries its own physics, mood, and story.
          </p>
        </header>
        <div className="space-y-16 md:space-y-20">
          {showcaseSections.map((section) => (
            <SampleSection key={section.title} title={section.title} description={section.description} demo={section.demo} />
          ))}
        </div>
      </div>
    </section>
  );
};
