
import React from 'react';
import Hero from './components/Hero';
import Section from './components/Section';
import { ClockDemo, ElevatorDemo, GravityDemo, HighDemo, ParallelDemo, TsunamiDemo, SmileDemo, VoyeurDemo, ZipperDemo, MoonDemo, TunnelDemo, SpidermanDemo } from './components/TypographicDemos';

const App: React.FC = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 space-y-24 sm:space-y-32 md:space-y-48">
        <Section
          title="Meaning in Form"
          description="The most fundamental principle of expressive typography is that the shape of letters can embody the word's meaning. Form isn't just decoration; it's a vehicle for the message itself."
          demoComponent={<ClockDemo />}
        />

        <Section
          title="Interaction & Personality"
          description="By responding to the user, type can gain personality and character. A simple hover or click can transform static letters into a dynamic, playful experience that draws the user deeper into the narrative."
          demoComponent={<GravityDemo />}
        />

        <Section
          title="Space as a Storyteller"
          description="The space around and within letterforms—kerning, leading, and alignment—can be manipulated to create tension, harmony, or emphasis. Here, verticality and position dramatically alter our interpretation."
          demoComponent={<HighDemo />}
        />

        <Section
          title="Composition & Structure"
          description="Typography is architecture on a small scale. The arrangement of elements can convey order, chaos, and relationships. Clean, strong lines can define a word's essence before it's even read."
          demoComponent={<ParallelDemo />}
        />

        <Section
          title="Motion & Emotion"
          description="Animation breathes life into static type. The path and rhythm of motion can evoke powerful emotions, turning a simple word into a cinematic event."
          demoComponent={<TsunamiDemo />}
        />

        <Section
          title="Form as Function"
          description="Sometimes, typography can transcend its role as a message and become an interface. When letterforms hint at an action, they invite interaction and create a witty, self-referential loop."
          demoComponent={<ElevatorDemo />}
        />

        <Section
          title="Anthropomorphism & Character"
          description="Giving letters human-like features and expressions infuses them with personality. A simple dot or curve can transform a letter into a character, conveying emotion and tone in a single, witty gesture."
          demoComponent={<SmileDemo />}
        />

        <Section
          title="Gaze & Direction"
          description="Typography can do more than just sit on the page; it can look back. By embedding a sense of gaze, letterforms can create a dynamic, sometimes unsettling, relationship with the viewer, making the act of reading a two-way street."
          demoComponent={<VoyeurDemo />}
        />

        <Section
          title="Functional Form & Direct Manipulation"
          description="When typography mimics a real-world object, it invites interaction. The form itself becomes a user interface, blurring the line between reading a word and using an object, creating a satisfying and memorable experience."
          demoComponent={<ZipperDemo />}
        />

        <Section
          title="Transformation & Cycles"
          description="Static letters can represent dynamic processes. Through interaction, a word can illustrate a cycle, a transformation, or the passage of time, encoding a complex narrative into its very form."
          demoComponent={<MoonDemo />}
        />

        <Section
          title="Perspective & Depth"
          description="Two-dimensional letters can be arranged to create a powerful illusion of depth. By manipulating perspective and reacting to the user's viewpoint, type can build a three-dimensional space on a flat screen."
          demoComponent={<TunnelDemo />}
        />
        
        <Section
          title="Physics & Weight"
          description="By responding to user input with simulated physics, letterforms can gain a sense of weight and materiality. This makes them feel tangible and grounded in a virtual space, adding a layer of playful realism."
          demoComponent={<SpidermanDemo />}
        />

      </main>

      <footer className="text-center py-16 px-4">
        <p className="text-gray-500">Crafted with care.</p>
        <p className="text-gray-600 text-sm mt-1">An exploration into type that is something.</p>
      </footer>
    </div>
  );
};

export default App;
