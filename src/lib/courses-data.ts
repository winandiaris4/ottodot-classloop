export interface CourseItem {
  id: string
  slug: string
  title: string
  category: 'STEM' | 'Coding' | 'Math' | 'Creative'
  ageRange: string
  level: 'Beginner' | 'Popular' | 'New' | 'Intermediate'
  durationWeeks: number
  sessionsPerWeek: number
  priceMonthly: number
  tags: string[]
  shortDescription: string
  longDescription: string
  thumbnailUrl: string
  heroThumbnailUrl?: string
  whatYoullLearn: string[]
  perfectFor: string[]
  curriculum: {
    week: number
    title: string
    description: string
  }[]
  requirements: string[]
  instructor: {
    name: string
    title: string
    avatarUrl?: string
  }
}

export const COURSES_CATALOG: CourseItem[] = [
  {
    id: 'course-roblox-physics',
    slug: 'roblox-physics',
    title: 'Roblox Physics & Velocity Explorers',
    category: 'STEM',
    ageRange: 'Ages 8–12',
    level: 'Beginner',
    durationWeeks: 6,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Physics', 'Math', '6 weeks'],
    shortDescription: 'Build, explore, and experiment with real-world physics concepts in Roblox.',
    longDescription:
      'Build, explore, and experiment with real-world physics concepts in Roblox. Kids will learn about velocity, forces, and motion through fun, hands-on challenges and live instructor mentorship.',
    thumbnailUrl: '/images/course-roblox.jpg',
    heroThumbnailUrl: '/images/hero-course-roblox.jpg',
    whatYoullLearn: [
      'Understand basic physics concepts (force, motion, velocity)',
      'Build and customize your own Roblox worlds and obstacle tracks',
      'Solve real-world engineering problems through interactive simulations',
      'Gain confidence in STEM and critical algorithmic thinking',
    ],
    perfectFor: [
      'Kids ages 8–12 curious about STEM & games',
      'No prior coding or physics experience needed',
      'Roblox account & laptop/desktop required',
    ],
    curriculum: [
      {
        week: 1,
        title: 'Motion & Speed in 3D Space',
        description: 'Introduction to vectors, coordinate grids, and character speed mechanics in Roblox Studio.',
      },
      {
        week: 2,
        title: 'Gravity & Acceleration Obstacle Courses',
        description: 'Design gravity-defying ramps and master falling acceleration calculations.',
      },
      {
        week: 3,
        title: 'Kinetic Energy & Elastic Collisions',
        description: 'Build bouncing trampolines, wrecking balls, and learn energy conservation.',
      },
      {
        week: 4,
        title: 'Friction & Surface Dynamics',
        description: 'Program ice slides, mud zones, and tire grip mechanics with custom physics properties.',
      },
      {
        week: 5,
        title: 'Rocket Launchers & Projectile Trajectories',
        description: 'Calculate parabolic launch arcs and projectile velocities.',
      },
      {
        week: 6,
        title: 'Final Project: Physics Arcade World',
        description: 'Assemble and publish a complete playable physics puzzle game with peer testing.',
      },
    ],
    requirements: [
      'PC or Mac computer running Roblox Studio (Windows 10/11 or macOS 10.13+)',
      'Stable internet connection for live video classroom',
      'Standard mouse and keyboard for 3D navigation',
    ],
    instructor: {
      name: 'Dr. Maya Lin',
      title: 'Senior STEM Educator & Roblox Developer',
    },
  },
  {
    id: 'course-quantum-math',
    slug: 'quantum-kids-math',
    title: 'Quantum Kids: Math & Logic Puzzles',
    category: 'Math',
    ageRange: 'Ages 5–7',
    level: 'Popular',
    durationWeeks: 6,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Math', 'Logic', '6 weeks'],
    shortDescription: 'Transform math anxiety into excitement with gamified logic gates and visual geometric proofs.',
    longDescription:
      'Transform math anxiety into excitement with gamified logic gates, prime factor battles, and visual geometric proofs through colorful puzzle mechanics designed specifically for young learners.',
    thumbnailUrl: '/images/course-math.jpg',
    heroThumbnailUrl: '/images/course-math.jpg',
    whatYoullLearn: [
      'Master number sense, mental math tricks, and pattern recognition',
      'Solve visual spatial puzzles and 3D geometric shapes',
      'Understand foundational algebraic logic through balancing games',
      'Build perseverance and enthusiasm for problem solving',
    ],
    perfectFor: [
      'Young learners ages 5–7',
      'Beginners wanting a fun, stress-free math foundation',
      'Tablet or laptop with web browser',
    ],
    curriculum: [
      { week: 1, title: 'Number Kingdoms & Counting Quests', description: 'Interactive visual addition and number patterns.' },
      { week: 2, title: 'Shape Shifters & Spatial Reasoning', description: '2D/3D geometry through tangrams and building blocks.' },
      { week: 3, title: 'Logic Gates & Mystery Paths', description: 'Boolean true/false puzzles and deductive logic mazes.' },
      { week: 4, title: 'Balance Scales & Visual Algebra', description: 'Solving for unknown mystery variables visually.' },
      { week: 5, title: 'Probability & Dice Champions', description: 'Predicting outcomes and understanding simple fractions.' },
      { week: 6, title: 'Math Carnival Graduation', description: 'Live multiplayer math battle game and certificate ceremony.' },
    ],
    requirements: ['Any laptop, iPad, or Chromebook', 'Audio headset or speakers'],
    instructor: {
      name: 'Sarah Jenkins, M.Ed',
      title: 'Early Childhood Math Specialist',
    },
  },
  {
    id: 'course-python-ai',
    slug: 'python-game-creators',
    title: 'Python Game Creators & AI Lab',
    category: 'Coding',
    ageRange: 'Ages 11–15',
    level: 'New',
    durationWeeks: 8,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Coding', 'AI', '8 weeks'],
    shortDescription: 'Write real Python code to create arcade mini-games and interactive AI visualizations.',
    longDescription:
      'Write real text-based Python code to create arcade mini-games, algorithmic bots, and interactive AI visualizations with live guidance from professional mentors.',
    thumbnailUrl: '/images/course-python-ai.jpg',
    heroThumbnailUrl: '/images/course-python-ai.jpg',
    whatYoullLearn: [
      'Write clean Python syntax (variables, loops, functions, lists, dictionaries)',
      'Develop 2D arcade video games using Pygame Zero',
      'Build simple machine learning decision tree models',
      'Understand debugging workflows and software engineering best practices',
    ],
    perfectFor: [
      'Students ages 11–15',
      'No prior text-coding experience required (Scratch graduates welcome)',
      'Computer with keyboard (PC / Mac / Linux)',
    ],
    curriculum: [
      { week: 1, title: 'Python Syntax & Interactive Storyteller', description: 'Variables, inputs, and conditional branches.' },
      { week: 2, title: 'Loops & ASCII Art Battle Arena', description: 'While/for loops and randomization functions.' },
      { week: 3, title: 'Pygame Basics: Windows, Sprites & Sound', description: 'Setting up the 2D game loop and handling keystrokes.' },
      { week: 4, title: 'Collision Physics & Score Systems', description: 'Hitboxes, bounding boxes, and score multipliers.' },
      { week: 5, title: 'AI Enemy Pathfinding', description: 'Programming intelligent opponent behaviors.' },
      { week: 6, title: 'Data Structures & Inventory Management', description: 'Lists and dictionaries for saving game state.' },
      { week: 7, title: 'Machine Learning Mini-Model', description: 'Training an AI model to recognize user inputs.' },
      { week: 8, title: 'Final Game Showcase & Demo Day', description: 'Live presentation of student custom Python games.' },
    ],
    requirements: ['Laptop or Desktop (Windows, macOS, or ChromeOS with Linux)', 'Python 3 and VS Code (Installed in Week 1)'],
    instructor: {
      name: 'Alex Rivera',
      title: 'Full Stack Engineer & Coding Educator',
    },
  },
  {
    id: 'course-science-lab',
    slug: 'science-lab-space',
    title: 'Science Lab: Earth & Space',
    category: 'STEM',
    ageRange: 'Ages 7–10',
    level: 'Beginner',
    durationWeeks: 6,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Science', 'Earth', '6 weeks'],
    shortDescription: 'Explore planetary orbits, volcano chemistry, atmosphere layers, and rock cycles.',
    longDescription:
      'Explore planetary orbits, volcano chemistry, atmosphere layers, and rock cycles through simulated space missions and interactive 3D virtual experiments.',
    thumbnailUrl: '/images/course-science-lab.jpg',
    heroThumbnailUrl: '/images/course-science-lab.jpg',
    whatYoullLearn: [
      'Understand the solar system and gravitational orbits',
      'Discover plate tectonics, volcanoes, and earthquakes',
      'Learn about weather systems, water cycles, and cloud types',
      'Conduct interactive virtual laboratory experiments',
    ],
    perfectFor: [
      'Curious explorers ages 7–10',
      'Kids passionate about nature, planets, and space',
      'Compatible with all modern web browsers',
    ],
    curriculum: [
      { week: 1, title: 'Solar System Voyage', description: 'Planetary sizes, distances, and orbits in 3D.' },
      { week: 2, title: 'Earth Layers & Volcanic Eruptions', description: 'Magma chambers and tectonic plates.' },
      { week: 3, title: 'The Water Cycle & Storm Predictors', description: 'Evaporation, condensation, and weather radars.' },
      { week: 4, title: 'Rocks, Minerals & Dinosaur Fossils', description: 'Sedimentary layering and fossilization.' },
      { week: 5, title: 'Stars, Constellations & Galaxies', description: 'Life cycle of stars and deep space telescopes.' },
      { week: 6, title: 'Space Habitat Design Project', description: 'Designing a sustainable Mars colony station.' },
    ],
    requirements: ['Standard web browser on PC, Mac, or tablet'],
    instructor: {
      name: 'Dr. Marcus Vance',
      title: 'Astrophysicist & Science Communicator',
    },
  },
  {
    id: 'course-scratch-creative',
    slug: 'creative-coding-scratch',
    title: 'Creative Coding with Scratch',
    category: 'Creative',
    ageRange: 'Ages 6–9',
    level: 'Popular',
    durationWeeks: 6,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Coding', 'Animation', '6 weeks'],
    shortDescription: 'Design animated stories, musical instruments, and interactive mini-games using visual block coding.',
    longDescription:
      'Design animated stories, musical instruments, and interactive mini-games using MIT Scratch visual block coding and creative storytelling techniques.',
    thumbnailUrl: '/images/course-scratch.jpg',
    heroThumbnailUrl: '/images/course-scratch.jpg',
    whatYoullLearn: [
      'Master block-based coding algorithms and event listeners',
      'Create custom sound effects, animations, and voiceovers',
      'Design maze games and interactive storyboards',
      'Share creations safely with the ClassLoop learning community',
    ],
    perfectFor: ['Young creators ages 6–9', 'Complete beginners to computer programming', 'Chromebook, Mac, PC, or iPad'],
    curriculum: [
      { week: 1, title: 'Dance Party & Character Animation', description: 'Costume switches, motion blocks, and beat timing.' },
      { week: 2, title: 'Interactive Musical Synthesizer', description: 'Key listeners and musical instrument blocks.' },
      { week: 3, title: 'Maze Runner Challenge', description: 'Arrow key navigation, wall collision sensors, and coins.' },
      { week: 4, title: 'Catch the Star Mini-Game', description: 'Score tracking, timer countdowns, and game-over states.' },
      { week: 5, title: 'Choose Your Own Adventure Story', description: 'Branching dialogue and multi-scene backdrops.' },
      { week: 6, title: 'Showcase Arcade Festival', description: 'Publishing and playing classmates creations.' },
    ],
    requirements: ['Web browser with Scratch 3.0 support'],
    instructor: {
      name: 'Chloe Zhang',
      title: 'Creative Technologist & Scratch Mentor',
    },
  },
  {
    id: 'course-math-realworld',
    slug: 'math-in-the-real-world',
    title: 'Math in the Real World',
    category: 'Math',
    ageRange: 'Ages 8–12',
    level: 'New',
    durationWeeks: 6,
    sessionsPerWeek: 2,
    priceMonthly: 49,
    tags: ['Math', 'Economics', '6 weeks'],
    shortDescription: 'Discover how mathematics powers game economies, blueprints, and secret ciphers.',
    longDescription:
      'Discover how mathematics powers video game economy budgets, architectural blueprints, sports analytics, and secret encryption codes.',
    thumbnailUrl: '/images/course-math-realworld.jpg',
    heroThumbnailUrl: '/images/course-math-realworld.jpg',
    whatYoullLearn: [
      'Apply percentages, fractions, and ratios to practical real-world scenarios',
      'Understand budgeting, discounts, and virtual currency math',
      'Decrypt Caesar ciphers and modular arithmetic puzzles',
      'Analyze sports stats, probability averages, and charts',
    ],
    perfectFor: ['Students ages 8–12', 'Kids looking for practical applications of school math'],
    curriculum: [
      { week: 1, title: 'Theme Park Tycoon Math', description: 'Budgeting ticket prices, rides, and revenue.' },
      { week: 2, title: 'Architect Blueprint Geometry', description: 'Perimeter, area, scale models, and floor plans.' },
      { week: 3, title: 'Secret Agents & Cryptography', description: 'Ciphers, prime numbers, and data encryption.' },
      { week: 4, title: 'Sports Analytics & Probability', description: 'Batting averages, win probabilities, and scatter plots.' },
      { week: 5, title: 'Cooking with Fractions & Ratios', description: 'Scaling recipe portions and unit conversions.' },
      { week: 6, title: 'Shark Tank Pitch & Financials', description: 'Presenting a startup business model with cost analysis.' },
    ],
    requirements: ['Notebook, calculator, and web browser'],
    instructor: {
      name: 'David Patel',
      title: 'Applied Mathematics Educator',
    },
  },
]

export function getCourseBySlug(slug: string): CourseItem | undefined {
  return COURSES_CATALOG.find((c) => c.slug === slug || c.id === slug)
}

