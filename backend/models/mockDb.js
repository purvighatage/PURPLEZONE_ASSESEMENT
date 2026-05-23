const bcrypt = require('bcryptjs');

// Seed statements with expected correct versions and helpful grammar tips
const initialStatements = [
  {
    id: "s1",
    text: "she dont like going to the store on sundays",
    corrections: [
      "She doesn't like going to the store on Sundays.",
      "She does not like going to the store on Sundays."
    ],
    explanation: "Capitalize the first word 'She' and the proper noun 'Sundays'. Use the correct subject-verb agreement and contraction 'doesn't' (or 'does not') instead of 'dont'. End with a period.",
    errors: [
      { type: "capitalization", description: "Capitalize the first letter of the sentence ('she' -> 'She')." },
      { type: "spelling/grammar", description: "Use 'doesn't' or 'does not' instead of 'dont' to match 'she' (singular third-person)." },
      { type: "capitalization", description: "Days of the week must be capitalized ('sundays' -> 'Sundays')." },
      { type: "punctuation", description: "Sentences must end with a period ('.')." }
    ]
  },
  {
    id: "s2",
    text: "their going to there house because they're car is broken",
    corrections: [
      "They're going to their house because their car is broken."
    ],
    explanation: "Fix the homophone confusion: use 'They're' (They are) going to 'their' (possessive) house because 'their' (possessive) car is broken.",
    errors: [
      { type: "homophone", description: "Use 'They're' (contraction of 'they are') at the beginning instead of 'their'." },
      { type: "homophone", description: "Use 'their' (possessive) house instead of 'there' (location)." },
      { type: "homophone", description: "Use 'their' (possessive) car instead of 'they're' (contraction)." },
      { type: "punctuation", description: "Sentences must end with a period ('.')." }
    ]
  },
  {
    id: "s3",
    text: "the dog wagged its tail when it saw it's owner",
    corrections: [
      "The dog wagged its tail when it saw its owner."
    ],
    explanation: "Capitalize 'The'. Use the possessive pronoun 'its' instead of the contraction 'it's' (it is) when describing ownership of the tail and owner.",
    errors: [
      { type: "capitalization", description: "Capitalize the first letter of the sentence ('the' -> 'The')." },
      { type: "grammar", description: "Use the possessive 'its' instead of the contraction 'it's' (which means 'it is') before 'owner'." },
      { type: "punctuation", description: "Sentences must end with a period ('.')." }
    ]
  }
];

const users = [];
const submissions = [];
const statements = [...initialStatements];

// Helper to seed standard mock user for testing if needed
const seedMockUser = async () => {
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    users.push({
      id: "u1",
      username: "testuser",
      password: hashedPassword,
      createdAt: new Date()
    });
  }
};

seedMockUser();

module.exports = {
  users,
  statements,
  submissions,
  initialStatements
};
