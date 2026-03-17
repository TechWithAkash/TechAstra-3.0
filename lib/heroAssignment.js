// Weighted scoring matrix: quiz answers → hero identity
export const HERO_SCORING_MATRIX = {
  iron_man: {
    name: "Tony Stark",
    title: "Iron Man",
    traits: ["analytical", "innovative", "ambitious", "tech-driven"],
    color: "#F5A623",
    gradient: "linear-gradient(135deg, #F5A623, #C0392B)",
    careers: ["Software Engineer", "Entrepreneur", "Data Scientist", "AI Researcher"],
    tagline: "Genius, Billionaire, Playboy, Philanthropist. Choose your field wisely.",
  },
  black_panther: {
    name: "T'Challa",
    title: "Black Panther",
    traits: ["leadership", "strategic", "responsible", "visionary"],
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #2563EB)",
    careers: ["Business Analyst", "Product Manager", "Policy Maker", "Consultant"],
    tagline: "Wakanda forever. Strategy and wisdom lead every empire.",
  },
  captain_america: {
    name: "Steve Rogers",
    title: "Captain America",
    traits: ["resilient", "team-oriented", "principled", "disciplined"],
    color: "#2563EB",
    gradient: "linear-gradient(135deg, #2563EB, #1E40AF)",
    careers: ["Civil Services", "Military", "Social Work", "Teaching", "NGO Leadership"],
    tagline: "I can do this all day. Follow the path — it's long, but it's yours.",
  },
  doctor_strange: {
    name: "Doctor Strange",
    title: "Doctor Strange",
    traits: ["curious", "precise", "knowledge-seeking", "detail-oriented"],
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #7C3AED)",
    careers: ["Doctor", "Researcher", "Professor", "Scientist", "Pharmacologist"],
    tagline: "I've seen 14 million outcomes. This path is the one.",
  },
  thor: {
    name: "Thor Odinson",
    title: "Thor",
    traits: ["powerful", "bold", "natural leader", "commanding"],
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B, #2563EB)",
    careers: ["Lawyer", "Politician", "Sports Professional", "CEO", "Diplomat"],
    tagline: "I am the god of thunder — and you are worthy of greatness.",
  },
  black_widow: {
    name: "Natasha Romanoff",
    title: "Black Widow",
    traits: ["adaptable", "perceptive", "strategic", "empathetic"],
    color: "#C0392B",
    gradient: "linear-gradient(135deg, #C0392B, #7C3AED)",
    careers: ["Intelligence Analyst", "UX Researcher", "Journalist", "Psychologist", "HR Leader"],
    tagline: "I have a ledger full of potential. Time to fill it with purpose.",
  },
  bruce_banner: {
    name: "Bruce Banner",
    title: "Hulk / Bruce Banner",
    traits: ["intellectual", "problem-solver", "introverted", "methodical"],
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981, #065F46)",
    careers: ["Research Scientist", "Engineer", "Data Analyst", "Academic", "Biotech Specialist"],
    tagline: "That's my secret — I'm always thinking.",
  },
};

// Quiz questions and answer weights
export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What's your natural approach when facing a complex problem?",
    options: [
      { text: "Break it down logically and engineer a solution", weights: { iron_man: 3, bruce_banner: 2, doctor_strange: 1 } },
      { text: "Rally a team and lead them through it strategically", weights: { black_panther: 3, captain_america: 2, thor: 1 } },
      { text: "Research deeply until you find the precise answer", weights: { doctor_strange: 3, bruce_banner: 2, black_widow: 1 } },
      { text: "Trust instinct and adapt on the fly", weights: { black_widow: 3, thor: 2, iron_man: 1 } },
    ],
  },
  {
    id: 2,
    question: "Which of these best describes your ideal work environment?",
    options: [
      { text: "A cutting-edge tech lab or startup — ideas to reality", weights: { iron_man: 3, bruce_banner: 2 } },
      { text: "A boardroom, courtroom, or decision-making arena", weights: { black_panther: 3, thor: 2, captain_america: 1 } },
      { text: "A research facility, hospital, or academic institution", weights: { doctor_strange: 3, bruce_banner: 2 } },
      { text: "Anywhere I can understand people and influence culture", weights: { black_widow: 3, captain_america: 2 } },
    ],
  },
  {
    id: 3,
    question: "When you imagine success in 10 years, what does it look like?",
    options: [
      { text: "Building something that changes the world or industry", weights: { iron_man: 3, black_panther: 2, thor: 1 } },
      { text: "Being a trusted leader others look up to for guidance", weights: { captain_america: 3, black_panther: 2, thor: 1 } },
      { text: "Mastering your field as a top expert or specialist", weights: { doctor_strange: 3, bruce_banner: 2, iron_man: 1 } },
      { text: "Creating meaningful impact in people's lives directly", weights: { black_widow: 3, captain_america: 2 } },
    ],
  },
  {
    id: 4,
    question: "What gives you the most satisfaction in work?",
    options: [
      { text: "Solving a problem no one else could figure out", weights: { iron_man: 3, bruce_banner: 3, doctor_strange: 1 } },
      { text: "Mentoring, defending, or serving a greater cause", weights: { captain_america: 3, black_widow: 2, thor: 1 } },
      { text: "Discovering new knowledge or making a breakthrough", weights: { doctor_strange: 3, bruce_banner: 2 } },
      { text: "Leading something from scratch and seeing it grow", weights: { thor: 3, black_panther: 3, iron_man: 1 } },
    ],
  },
  {
    id: 5,
    question: "Pick your power: if you could have one extraordinary ability at work, what would it be?",
    options: [
      { text: "Create any technology or system you can imagine", weights: { iron_man: 4, bruce_banner: 2 } },
      { text: "Command total respect and authority in any room", weights: { thor: 3, black_panther: 3 } },
      { text: "See the perfect solution in any situation", weights: { doctor_strange: 4, black_widow: 2 } },
      { text: "Read anyone's motivations and know exactly what they need", weights: { black_widow: 4, captain_america: 2 } },
    ],
  },
];

export function calculateHero(answers) {
  const scores = Object.keys(HERO_SCORING_MATRIX).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});

  answers.forEach((answer) => {
    if (answer && answer.weights) {
      Object.entries(answer.weights).forEach(([hero, weight]) => {
        scores[hero] = (scores[hero] || 0) + weight;
      });
    }
  });

  const topHero = Object.entries(scores).sort(([, a], [, b]) => b - a)[0][0];
  return { heroId: topHero, ...HERO_SCORING_MATRIX[topHero] };
}
