/* =====================================================================
   CONTENT & ASSET CONFIGURATION
   ---------------------------------------------------------------------
   All text on the site lives in this file.
   Only change the words inside the quotes ' '. Keep the quotes and commas.

   PHOTOS -> files go in the  images/  folder
   AUDIO  -> file goes in the  audio/   folder
   ===================================================================== */

var SITE = {
  location: 'SOI · Jersey City, New Jersey',
  subtitle: 'How PATH shapes the way we move, wait, and interact',
  intro:
    'PATH stations are built as part of a transportation system that moves large numbers of people between New Jersey and New York. To do that, the station has to control where people go, how fast they move, and whether the space is accessible to everyone. I take this route to school every day I have class, and after observing it over time, I started to see how the station was shaping my own behavior too: where I walked, where I stopped, and what I paid attention to. This site explores PATH through three layers: the design of the space, the effect of the senses and how commuters respond, and the systems behind them that regulate how commuters behave.',
  question: 'Is a transit station designed for people, or for movement?',
  history: [
    { year: '1912', text: 'Opens as Summit Avenue Station' },
    { year: '1920s–60s', text: 'Becomes known as Journal Square' },
    { year: '1970s', text: 'Rebuilt as the Journal Square Transportation Center' },
  ],
  author: 'Lulu / Na Zhuomalamu',
  course: 'City as Systems · Parsons School of Design',
  fieldwork: 'Field observation at Journal Square PATH Station, Fall 2026',
  photoCredit: 'Photographs: images from web',
}

/* ---------------------------------------------------------------------
   01 — SPATIAL DESIGN · How we move
   focus = which question the photo is about:
   Direction / Speed / Stopping / Accessibility
   --------------------------------------------------------------------- */
var MOVEMENT = {
  note: 'You can only go forward or back through these photos, in the order I chose. The station works the same way. This is one route I take, not the only one through the station.',
}

var PHOTOS = [
  {
    src: 'images/01-entrance.jpg',
    label: 'Entrance',
    focus: 'Direction',
    title: 'Arriving',
    caption:
      'A sign, a clock, and two escalators going down. Before you reach the entrance, the space has already told you which way to go. Up here it is windy and cold, and it smells like Jollibee.',
    alt: 'Street-level entrance under a concrete canopy, with a "To PATH Trains" sign, a Port Authority clock and escalators leading down',
    credit: 'Image from web',
  },
  {
    src: 'images/02-circulation.jpg',
    label: 'Plaza',
    focus: 'Speed',
    title: 'Joining the flow',
    caption:
      'People come from different sides of the plaza and narrow into the same opening. I saw people speed up, slow down, and change direction to avoid bumping into each other.',
    alt: 'People walking past the station entrance toward the escalators',
    credit: 'Image from web',
  },
  {
    src: 'images/03-fare-gates.jpg',
    label: 'Fare gates',
    focus: 'Direction',
    title: 'One way through',
    caption:
      'The corridor is wide, then it ends in a line of gates. There is one way in, and you have to pay to use it.',
    alt: 'Wide corridor ending in a row of fare gates, with pay phones on the right wall',
    credit: 'Image from web (SubwayNut.com)',
  },
  {
    src: 'images/04-escalators.jpg',
    label: 'Stairs / escalator',
    focus: 'Speed · Accessibility',
    title: 'Stairs or escalator',
    caption:
      'The stairs and the escalator run side by side. Which one people take depends on the crowd, how much of a hurry they are in, and what their body can do. I noticed the escalator here is often broken or under repair, which makes it hard to use. The elevator also seems to be unavailable when people ask for it, which makes this route difficult for disabled people, people carrying heavy things, and parents with strollers.',
    alt: 'Passengers coming down stairs next to an escalator onto the platform, beside a waiting PATH train',
    credit: 'Image from web',
  },
  {
    src: 'images/05-platform.jpg',
    label: 'Platform',
    focus: 'Stopping',
    title: 'Waiting',
    caption:
      'The platform is the first place on the route where people actually stop. It is warmer down here. People stand or sit facing the tracks. If they want a seat, most people walk further down the platform, toward the front or the back of the train, and wait there.',
    alt: 'Journal Square platform with a PATH train arriving and passengers waiting',
    credit: 'Image from web',
  },
  {
    src: 'images/06-train.jpg',
    label: 'Train',
    focus: 'Direction',
    title: 'Boarding',
    caption:
      'The doors open and the walking part of the route ends. Inside the train it is warmer again. From here, the system moves you.',
    alt: 'PATH train standing at the platform with its doors open',
    credit: 'Image from web',
  },
]

/* ---------------------------------------------------------------------
   02 — SENSORY ENVIRONMENT · How we feel and respond
   --------------------------------------------------------------------- */
var AUDIO = {
  src: 'audio/jsq-station.mp3', // <- change to .m4a / .wav if needed
  credit: 'Field recording, Journal Square Plaza',
  heading: 'LISTEN TO THE STATION',
  question: 'How do sensory conditions affect what we notice and how we respond in a public space?',
  description:
    'Even when we are not paying attention, our bodies keep reacting to what is around us. Press play and notice what catches you.',
  // Sensory factor -> possible response. These are things to look for,
  // based on my observations. They are not measured results.
  factors: [
    { factor: 'A train coming in, a loud noise', response: 'People look toward the tracks and get ready to board' },
    { factor: 'Crowds and noise', response: 'People are less likely to stay, or look for a quieter spot' },
    { factor: 'Cold at street level, warmer underground', response: 'People may pick where they wait' },
  ],
  factorsNote: 'Possible responses I am watching for, not measured results.',
}

/* ---------------------------------------------------------------------
   03 — INVISIBLE SYSTEMS · How our behavior is regulated
   Based on my observations and system analysis, not measured flows.
   --------------------------------------------------------------------- */
var SYSTEMS = {
  heading: 'Why can’t you just walk onto the platform?',
  intro:
    'There is a physical path. What stops you is the fare gate, and the gate is connected to payment rules, fare validation technology, access control, transit regulations, and decisions about how the station runs. Most of the time we only see the gate.',
  hint: 'Click a system, or a line between two systems.',
  power: 'Who gets to decide how a public space can be entered and used?',
  fine: 'Based on my observations and analysis, not measured data.',
}

var NODES = [
  {
    id: 'technology',
    label: 'TECHNOLOGY',
    x: 500,
    y: 120,
    summary:
      'Fare gates, card readers, sensors, screens, and signs. Technology checks who is allowed through and tells everyone where to go next.',
    parts: ['Fare gates', 'Fare validation', 'Sensors', 'Signage'],
  },
  {
    id: 'infrastructure',
    label: 'INFRASTRUCTURE',
    x: 200,
    y: 360,
    summary:
      'Corridors, stairs, escalators, platforms, and barriers. The layout sets which paths are possible before anyone arrives.',
    parts: ['Escalators', 'Stairs', 'Platforms', 'Corridors'],
  },
  {
    id: 'rules',
    label: 'RULES',
    x: 800,
    y: 360,
    summary:
      'Payment requirements, access control, transit regulations, and operating decisions. You rarely see rules directly. You see them through gates, signs, and staff.',
    parts: ['Payment rules', 'Access control', 'Regulations', 'Operations'],
  },
  {
    id: 'passengers',
    label: 'PASSENGERS',
    x: 500,
    y: 600,
    summary:
      'Commuters, staff, crowds, and people with different physical needs. This is where every other system shows up as behavior: walking, stopping, choosing, waiting.',
    parts: ['Commuters', 'Staff', 'Crowds', 'Physical needs'],
  },
]

var EDGES = [
  {
    id: 'tech-pass',
    from: 'technology',
    to: 'passengers',
    chain: ['TECHNOLOGY', 'FARE GATES', 'ACCESS', 'PASSENGER MOVEMENT'],
    text: 'The gate reads your card and decides whether you can go in. At that moment a moving crowd turns into a line of individuals, one tap at a time.',
    basis: 'Object-scale study of the fare gates',
  },
  {
    id: 'infra-pass',
    from: 'infrastructure',
    to: 'passengers',
    chain: ['INFRASTRUCTURE', 'STAIRS / ESCALATORS', 'ROUTE CHOICES'],
    text: 'Where the stairs, escalators, and corridors are decides where people can go and which way feels natural. The layout becomes a movement pattern.',
    basis: 'Field observation · flows and layout',
  },
  {
    id: 'pass-pass',
    from: 'passengers',
    to: 'passengers',
    chain: ['PASSENGERS', 'CROWDING', 'MOVEMENT ADJUSTMENTS'],
    text: 'People change speed and direction to avoid each other. In a crowded passage, people moving fast seem to have the advantage over people who need more time.',
    basis: 'Intersubjective-scale observation',
  },
  {
    id: 'rules-tech',
    from: 'rules',
    to: 'technology',
    chain: ['RULES', 'PAYMENT & ACCESS', 'FARE GATES'],
    text: 'Nobody stands at the door checking tickets. The fare rule is built into the gate: a sensor and a barrier. The gate is the part of the rule you can see.',
    basis: 'Object-scale study of the fare gates',
  },
  {
    id: 'rules-pass',
    from: 'rules',
    to: 'passengers',
    chain: ['RULES', 'WHO IS ALLOWED WHERE', 'HOW SPACE IS USED'],
    text: 'Commuters and staff use the same space in different ways because they have different permissions. Rules decide who moves, who waits, and where. The people who write those rules are not the people standing on the platform.',
    basis: 'Intersubjective-scale observation · rules',
  },
  {
    id: 'infra-tech',
    from: 'infrastructure',
    to: 'technology',
    chain: ['INFRASTRUCTURE', 'BARRIERS', 'FARE GATES'],
    text: 'A fare gate is technology and architecture at the same time. It is a metal and glass object that physically splits the station into paid and unpaid sides.',
    basis: 'Object-scale study · field observation',
  },
  {
    id: 'pass-infra',
    from: 'passengers',
    to: 'infrastructure',
    chain: ['PASSENGERS', 'GATHERING', 'USE OF SPACE'],
    text: 'An open question: do crowds, and places like Jollibee, change where people gather and stop? I am still observing this one. It is not a result yet.',
    basis: 'Feedback loop (open question)',
  },
]

/* ---------------------------------------------------------------------
   ENDING
   --------------------------------------------------------------------- */
var CLOSING = {
  statement:
    'We design public spaces to organize human movement, but in return, these spaces shape how we behave, perceive, and interact with the world around us.',
  // Each line below is one paragraph.
  conclusion: [
    'From what I observed, the space at Journal Square is not designed for people to stay. It is designed for movement. The signs, corridors, gates, and stairs all point people in a straight line toward the trains.',
    'But the design is not perfect. There are not enough elevators or escalators, and at rush hour the station gets so crowded that people get stuck. Accessibility is poor, especially for disabled people, people carrying heavy things, and parents with strollers. This is where the design fails the people using it.',
    'At the same time, the station is beautiful. The design is consistent, from the materials to the colors. The ceiling and the lighting above the PATH entrance are carefully designed and remind me of brutalist architecture. Even so, I could not find who designed it. The Journal Square Transportation Center was built by the Port Authority of New York and New Jersey, but the original 1970s structure has no publicly credited lead architect.',
    'Overall, I think a large part of how people behave here is shaped by the design of the space, and designers should keep this in mind when they design. The environment affects people much more than we notice, and that is what I found most interesting.',
  ],
}
