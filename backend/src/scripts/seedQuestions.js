const Question = require('../models/Question');

const placementQuestions = [
  // ==========================================
  // 1. QUANTITATIVE APTITUDE
  // ==========================================
  {
    title: 'Time, Speed and Distance - Train Crossing Platform',
    description: 'A train 240 m long passes an electric pole in 24 seconds. How long will it take to pass a railway platform 650 m long at the same uniform speed?',
    category: 'Quantitative',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '65 seconds', isCorrect: false },
      { optionId: 'opt-2', text: '89 seconds', isCorrect: true },
      { optionId: 'opt-3', text: '100 seconds', isCorrect: false },
      { optionId: 'opt-4', text: '75 seconds', isCorrect: false },
    ],
    explanation:
      'Speed of train = Length of train / Time = 240 m / 24 s = 10 m/s. Total distance to cross platform = Length of train + Length of platform = 240 + 650 = 890 m. Time taken = Total Distance / Speed = 890 / 10 = 89 seconds.',
    tags: ['Aptitude', 'Time-Speed-Distance', 'Campus-Placements'],
  },
  {
    title: 'Time and Work - Joint Project Execution',
    description: 'A can complete a software module in 12 days, and B can complete the same module in 15 days. If they work together for 4 days, what fraction of the total work is left unfinished?',
    category: 'Quantitative',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '2/5', isCorrect: true },
      { optionId: 'opt-2', text: '3/5', isCorrect: false },
      { optionId: 'opt-3', text: '1/3', isCorrect: false },
      { optionId: 'opt-4', text: '1/4', isCorrect: false },
    ],
    explanation:
      "A's 1-day work = 1/12. B's 1-day work = 1/15. Combined 1-day work = 1/12 + 1/15 = (5+4)/60 = 9/60 = 3/20. In 4 days, work completed = 4 * (3/20) = 3/5. Work left unfinished = 1 - 3/5 = 2/5.",
    tags: ['Aptitude', 'Time-Work', 'TCS-Ninja'],
  },
  {
    title: 'Profit and Loss - Markup and Successive Discount',
    description: 'A retailer marks his goods 25% above the cost price and allows a discount of 12% on the marked price. What is his net profit percentage?',
    category: 'Quantitative',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '8%', isCorrect: false },
      { optionId: 'opt-2', text: '10%', isCorrect: true },
      { optionId: 'opt-3', text: '12%', isCorrect: false },
      { optionId: 'opt-4', text: '15%', isCorrect: false },
    ],
    explanation:
      'Let Cost Price (CP) = 100. Marked Price (MP) = 100 + 25 = 125. Selling Price (SP) = 125 * (1 - 0.12) = 125 * 0.88 = 110. Profit = 110 - 100 = 10. Profit % = (10 / 100) * 100 = 10%.',
    tags: ['Aptitude', 'Profit-Loss'],
  },
  {
    title: 'Probability - Drawing Cards without Replacement',
    description: 'Two cards are drawn simultaneously at random from a standard deck of 52 cards. What is the probability that one is a spade and one is a heart?',
    category: 'Quantitative',
    difficulty: 'Hard',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '13/102', isCorrect: true },
      { optionId: 'opt-2', text: '1/16', isCorrect: false },
      { optionId: 'opt-3', text: '13/204', isCorrect: false },
      { optionId: 'opt-4', text: '1/4', isCorrect: false },
    ],
    explanation:
      'Total outcomes = 52C2 = (52 * 51) / 2 = 1326. Favorable outcomes = (13C1 * 13C1) = 13 * 13 = 169. Probability = 169 / 1326 = 13 / 102.',
    tags: ['Aptitude', 'Probability', 'Product-Companies'],
  },
  {
    title: 'Percentages - Population Growth Calculation',
    description: 'The population of a tech hub increases at the rate of 10% per annum. If the present population is 1,21,000, what was its population 2 years ago?',
    category: 'Quantitative',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '1,00,000', isCorrect: true },
      { optionId: 'opt-2', text: '1,05,000', isCorrect: false },
      { optionId: 'opt-3', text: '95,000', isCorrect: false },
      { optionId: 'opt-4', text: '1,10,000', isCorrect: false },
    ],
    explanation:
      'Let population 2 years ago = P. P * (1 + 10/100)^2 = 1,21,000 => P * (1.1)^2 = 1,21,000 => P * 1.21 = 1,21,000 => P = 1,21,000 / 1.21 = 1,00,000.',
    tags: ['Aptitude', 'Percentages'],
  },
  {
    title: 'Simple and Compound Interest',
    description: 'The difference between simple and compound interest compounded annually on a certain sum of money for 2 years at 10% per annum is ₹65. What is the principal sum?',
    category: 'Quantitative',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '₹6,000', isCorrect: false },
      { optionId: 'opt-2', text: '₹6,500', isCorrect: true },
      { optionId: 'opt-3', text: '₹7,000', isCorrect: false },
      { optionId: 'opt-4', text: '₹5,500', isCorrect: false },
    ],
    explanation:
      'Difference for 2 years = P * (R/100)^2. 65 = P * (10/100)^2 = P * (1/100) => P = 65 * 100 = ₹6,500.',
    tags: ['Aptitude', 'Interest'],
  },

  // ==========================================
  // 2. LOGICAL REASONING
  // ==========================================
  {
    title: 'Coding-Decoding Pattern Series',
    description: 'In a certain cryptographic cipher, "CLOUD" is coded as "DMPVE". Using the same alphabetical shift rule, how is "SMILE" coded?',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'TNJMF', isCorrect: true },
      { optionId: 'opt-2', text: 'TMJMF', isCorrect: false },
      { optionId: 'opt-3', text: 'TNIMF', isCorrect: false },
      { optionId: 'opt-4', text: 'TOJNF', isCorrect: false },
    ],
    explanation:
      'Each character is incremented by +1 in the alphabet: C(+1)=D, L(+1)=M, O(+1)=P, U(+1)=V, D(+1)=E. Applying +1 to SMILE: S->T, M->N, I->J, L->M, E->F => TNJMF.',
    tags: ['Logical', 'Coding-Decoding', 'Campus'],
  },
  {
    title: 'Syllogisms and Deductive Logic',
    description: 'Statements: All engineers are problem solvers. Some problem solvers are designers. Conclusions: I. Some engineers are designers. II. All designers are problem solvers.',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Only Conclusion I follows', isCorrect: false },
      { optionId: 'opt-2', text: 'Only Conclusion II follows', isCorrect: false },
      { optionId: 'opt-3', text: 'Neither Conclusion I nor II follows', isCorrect: true },
      { optionId: 'opt-4', text: 'Both Conclusions I and II follow', isCorrect: false },
    ],
    explanation:
      'Engineers are a subset of problem solvers, while designers only overlap with some problem solvers. There is no guaranteed overlap between engineers and designers (Conclusion I fails). Nor is it stated that all designers are within problem solvers (Conclusion II fails). Neither follows.',
    tags: ['Logical', 'Syllogisms'],
  },
  {
    title: 'Blood Relations - Deductive Lineage',
    description: 'Pointing to a photograph, a woman says: "He is the son of the only son of my grandfather." How is the man in the photograph related to the woman?',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Brother', isCorrect: true },
      { optionId: 'opt-2', text: 'Cousin', isCorrect: false },
      { optionId: 'opt-3', text: 'Nephew', isCorrect: false },
      { optionId: 'opt-4', text: 'Father', isCorrect: false },
    ],
    explanation:
      '"Only son of my grandfather" refers to the woman\'s father. The son of the woman\'s father is her brother.',
    tags: ['Logical', 'Blood-Relations'],
  },
  {
    title: 'Direction Sense and Distance',
    description: 'Rahul walks 10 meters towards the North. He turns left and walks 6 meters. Then, he turns left again and walks 10 meters. How far and in which direction is he from his starting point?',
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: '6 meters West', isCorrect: true },
      { optionId: 'opt-2', text: '6 meters East', isCorrect: false },
      { optionId: 'opt-3', text: '10 meters South', isCorrect: false },
      { optionId: 'opt-4', text: '16 meters West', isCorrect: false },
    ],
    explanation:
      'North 10m (+Y). Left turn (West) 6m (-X). Left turn (South) 10m (-Y). The North and South 10m cancel out, leaving him 6 meters due West of the origin.',
    tags: ['Logical', 'Direction-Sense'],
  },
  {
    title: 'Seating Arrangement Logic',
    description: 'Five colleagues (P, Q, R, S, T) sit in a row facing North. S is between T and Q. Q is to the immediate left of R. P is to the immediate left of T. Who is sitting in the exact middle?',
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'S', isCorrect: true },
      { optionId: 'opt-2', text: 'Q', isCorrect: false },
      { optionId: 'opt-3', text: 'T', isCorrect: false },
      { optionId: 'opt-4', text: 'R', isCorrect: false },
    ],
    explanation:
      'Arranging from left to right: P is to the left of T => P, T. S is between T and Q => P, T, S, Q. Q is immediately left of R => P, T, S, Q, R. S sits in the middle position (3rd of 5).',
    tags: ['Logical', 'Seating-Arrangement'],
  },

  // ==========================================
  // 3. VERBAL ABILITY
  // ==========================================
  {
    title: 'Sentence Correction - Subject-Verb Agreement',
    description: 'Identify the grammatically correct sentence conforming to standard English rules:',
    category: 'Verbal Ability',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Neither the team lead nor the developers was present at the sprint retrospective.', isCorrect: false },
      { optionId: 'opt-2', text: 'Neither the team lead nor the developers were present at the sprint retrospective.', isCorrect: true },
      { optionId: 'opt-3', text: 'Neither the team lead or the developers was present at the sprint retrospective.', isCorrect: false },
      { optionId: 'opt-4', text: 'Neither the team lead nor the developers is present at the sprint retrospective.', isCorrect: false },
    ],
    explanation:
      'In a "neither...nor" construction with compound subjects of different numbers, the verb agrees with the closer subject. Since "developers" is plural and adjacent to the verb, the plural verb "were" is grammatically required.',
    tags: ['Verbal', 'Grammar'],
  },
  {
    title: 'Contextual Vocabulary - Synonyms',
    description: 'Select the word that is most nearly identical in meaning to "PRAGMATIC" in professional engineering:',
    category: 'Verbal Ability',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Idealistic', isCorrect: false },
      { optionId: 'opt-2', text: 'Realistic and practical', isCorrect: true },
      { optionId: 'opt-3', text: 'Theoretical', isCorrect: false },
      { optionId: 'opt-4', text: 'Hesitant', isCorrect: false },
    ],
    explanation:
      'Pragmatic denotes dealing with problems sensibly and realistically in a way that is based on practical tradeoffs rather than theoretical ideals.',
    tags: ['Verbal', 'Vocabulary'],
  },
  {
    title: 'Idioms and Professional Phrasing',
    description: 'What is the true meaning of the corporate idiom "burn the midnight oil"?',
    category: 'Verbal Ability',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'To work or study late into the night', isCorrect: true },
      { optionId: 'opt-2', text: 'To waste precious computational resources', isCorrect: false },
      { optionId: 'opt-3', text: 'To cause friction between team members', isCorrect: false },
      { optionId: 'opt-4', text: 'To start a project without proper planning', isCorrect: false },
    ],
    explanation:
      '"Burn the midnight oil" historically referred to working by the light of an oil lamp late at night, and now universally means working or studying intensely late into the night.',
    tags: ['Verbal', 'Idioms'],
  },

  // ==========================================
  // 4. COMPUTER SCIENCE CORE SUBJECTS
  // ==========================================
  {
    title: 'Operating Systems - Virtual Memory Thrashing',
    description: 'What technical condition characterizes "Thrashing" in an Operating System virtual memory subsystem?',
    category: 'CS Core',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'A process consuming 100% CPU cycles due to an infinite loop.', isCorrect: false },
      { optionId: 'opt-2', text: 'The CPU spending more time swapping pages in and out of disk than executing user instructions.', isCorrect: true },
      { optionId: 'opt-3', text: 'A deadlock condition caused by circular wait among multiple threads.', isCorrect: false },
      { optionId: 'opt-4', text: 'Fragmentation of disk inodes in secondary persistent storage.', isCorrect: false },
    ],
    explanation:
      'Thrashing occurs when the sum of working set sizes of all active processes exceeds physical RAM capacity. The OS continuously encounters page faults, keeping disk I/O saturated while CPU utilization drops to near zero.',
    tags: ['CS Core', 'Operating-Systems', 'Viva-Must-Know'],
  },
  {
    title: 'Operating Systems - Deadlock Conditions',
    description: 'Which of the following is NOT one of the 4 Coffman conditions required for a Deadlock to occur?',
    category: 'CS Core',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Mutual Exclusion', isCorrect: false },
      { optionId: 'opt-2', text: 'Hold and Wait', isCorrect: false },
      { optionId: 'opt-3', text: 'Preemptive Scheduling', isCorrect: true },
      { optionId: 'opt-4', text: 'Circular Wait', isCorrect: false },
    ],
    explanation:
      'The 4 Coffman conditions are: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption (resources cannot be forcibly confiscated), and 4. Circular Wait. Preemptive scheduling actually prevents or breaks deadlocks.',
    tags: ['CS Core', 'Operating-Systems'],
  },
  {
    title: 'DBMS - ACID Transaction Isolation',
    description: 'Which ACID property guarantees that concurrent execution of transactions leaves the database in the exact same state as if they were executed serially?',
    category: 'CS Core',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Atomicity', isCorrect: false },
      { optionId: 'opt-2', text: 'Consistency', isCorrect: false },
      { optionId: 'opt-3', text: 'Isolation', isCorrect: true },
      { optionId: 'opt-4', text: 'Durability', isCorrect: false },
    ],
    explanation:
      'Isolation ensures that intermediate states of concurrent transactions are invisible to one another, preventing Dirty Reads, Non-repeatable Reads, and Phantom Reads.',
    tags: ['CS Core', 'DBMS', 'Viva-Must-Know'],
  },
  {
    title: 'DBMS - Normalization (3NF vs BCNF)',
    description: 'A relation R is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:',
    category: 'CS Core',
    difficulty: 'Hard',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'X is a Super Key of relation R', isCorrect: true },
      { optionId: 'opt-2', text: 'Y is a Prime Attribute of relation R', isCorrect: false },
      { optionId: 'opt-3', text: 'No transitive dependencies exist in R', isCorrect: false },
      { optionId: 'opt-4', text: 'Every attribute is functionally dependent on the primary key', isCorrect: false },
    ],
    explanation:
      'BCNF is a stricter version of 3NF. While 3NF allows X -> Y if Y is a prime attribute, BCNF strictly requires that X must be a super key for EVERY functional dependency X -> Y.',
    tags: ['CS Core', 'DBMS', 'Normalization'],
  },
  {
    title: 'Computer Networks - TCP 3-Way Handshake vs UDP',
    description: 'Why is a 2-way handshake insufficient for TCP to establish a reliable full-duplex connection?',
    category: 'CS Core',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Delayed duplicate SYN packets from old connections could trigger phantom sessions on the server without client acknowledgment.', isCorrect: true },
      { optionId: 'opt-2', text: 'TCP headers lack sequence number fields without the third ACK packet.', isCorrect: false },
      { optionId: 'opt-3', text: 'IP routing tables require three distinct hops to calculate path MTU.', isCorrect: false },
      { optionId: 'opt-4', text: 'UDP sockets require an extra handshake step for NAT traversal.', isCorrect: false },
    ],
    explanation:
      'The 3-way handshake (SYN, SYN-ACK, ACK) ensures both client and server independently verify each other\'s initial sequence numbers (ISN) and confirms that neither side is processing an obsolete delayed packet.',
    tags: ['CS Core', 'Computer-Networks'],
  },
  {
    title: 'Data Structures - Balanced Binary Search Trees',
    description: 'What is the guaranteed worst-case search, insertion, and deletion time complexity in an AVL Tree with N elements?',
    category: 'CS Core',
    difficulty: 'Easy',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'O(N)', isCorrect: false },
      { optionId: 'opt-2', text: 'O(log N)', isCorrect: true },
      { optionId: 'opt-3', text: 'O(N log N)', isCorrect: false },
      { optionId: 'opt-4', text: 'O(1)', isCorrect: false },
    ],
    explanation:
      'AVL trees strictly maintain a balance factor between -1 and +1 at every node via tree rotations. Consequently, height is strictly bounded by 1.44 * log2(N), guaranteeing O(log N) worst-case time.',
    tags: ['CS Core', 'Data-Structures'],
  },
  {
    title: 'Object-Oriented Programming - SOLID Principles',
    description: 'Which SOLID design principle states: "Subtypes must be substitutable for their base types without altering the correctness of the program"?',
    category: 'CS Core',
    difficulty: 'Medium',
    type: 'mcq',
    options: [
      { optionId: 'opt-1', text: 'Single Responsibility Principle', isCorrect: false },
      { optionId: 'opt-2', text: 'Open/Closed Principle', isCorrect: false },
      { optionId: 'opt-3', text: 'Liskov Substitution Principle', isCorrect: true },
      { optionId: 'opt-4', text: 'Dependency Inversion Principle', isCorrect: false },
    ],
    explanation:
      'Liskov Substitution Principle (LSP), introduced by Barbara Liskov, ensures that derived classes only extend base class behavior without violating contracts or invariants.',
    tags: ['CS Core', 'OOP', 'Software-Engineering'],
  },

  // ==========================================
  // 5. CODING CHALLENGES (AUTHENTIC LEETCODE PROBLEMS)
  // ==========================================
  {
    title: 'LeetCode #1: Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #1 - Two Sum
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Optimal Approach: Use a Hash Map for O(N) Time and O(N) Space
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      sampleInput: 'nums = [2, 7, 11, 15], target = 9',
      sampleOutput: '[0, 1]',
      testCases: [
        { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isHidden: false },
        { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isHidden: false },
        { input: '[3, 3], 6', expectedOutput: '[0, 1]', isHidden: true },
      ],
    },
    explanation:
      'Optimal Approach: Traverse the array while storing each number and its index in a Hash Map. For each element nums[i], check if (target - nums[i]) already exists in the map. Time Complexity: O(N), Space Complexity: O(N).',
    tags: ['Coding', 'LeetCode-1', 'Arrays', 'Hash-Table'],
  },
  {
    title: 'LeetCode #20: Valid Parentheses',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #20 - Valid Parentheses
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };

  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}`,
      sampleInput: 's = "()[]{}"',
      sampleOutput: 'true',
      testCases: [
        { input: '"()"', expectedOutput: 'true', isHidden: false },
        { input: '"()[]{}"', expectedOutput: 'true', isHidden: false },
        { input: '"(]"', expectedOutput: 'false', isHidden: false },
        { input: '"([)]"', expectedOutput: 'false', isHidden: true },
      ],
    },
    explanation:
      'Optimal Approach: Use a LIFO Stack. Push opening brackets onto the stack. When encountering a closing bracket, pop the top of stack and verify match. If stack is empty at end, string is valid. Time: O(N), Space: O(N).',
    tags: ['Coding', 'LeetCode-20', 'Stack', 'Strings'],
  },
  {
    title: 'LeetCode #121: Best Time to Buy and Sell Stock',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #121 - Best Time to Buy and Sell Stock
 * @param {number[]} prices
 * @return {number}
 */
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (let price of prices) {
    if (price < minPrice) {
      minPrice = price;
    } else if (price - minPrice > maxProfit) {
      maxProfit = price - minPrice;
    }
  }

  return maxProfit;
}`,
      sampleInput: 'prices = [7, 1, 5, 3, 6, 4]',
      sampleOutput: '5',
      testCases: [
        { input: '[7, 1, 5, 3, 6, 4]', expectedOutput: '5', isHidden: false },
        { input: '[7, 6, 4, 3, 1]', expectedOutput: '0', isHidden: false },
        { input: '[2, 4, 1]', expectedOutput: '2', isHidden: true },
      ],
    },
    explanation:
      'Optimal Approach: Single pass through prices. Track minimum buying price seen so far and calculate profit if selling on current day. Update maximum profit accordingly. Time: O(N), Space: O(1).',
    tags: ['Coding', 'LeetCode-121', 'Arrays', 'Dynamic-Programming'],
  },
  {
    title: 'LeetCode #53: Maximum Subarray (Kadane Algorithm)',
    description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    category: 'Coding',
    difficulty: 'Medium',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #53 - Maximum Subarray (Kadane's Algorithm)
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}`,
      sampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
      sampleOutput: '6',
      testCases: [
        { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', isHidden: false },
        { input: '[1]', expectedOutput: '1', isHidden: false },
        { input: '[5, 4, -1, 7, 8]', expectedOutput: '23', isHidden: true },
      ],
    },
    explanation:
      "Kadane's Algorithm: At each index, decide whether to add current element to existing subarray or start a new subarray with current element. Update maximum sum. Time: O(N), Space: O(1).",
    tags: ['Coding', 'LeetCode-53', 'Kadane', 'Dynamic-Programming'],
  },
  {
    title: 'LeetCode #217: Contains Duplicate',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #217 - Contains Duplicate
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  const seen = new Set();
  for (let num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`,
      sampleInput: 'nums = [1, 2, 3, 1]',
      sampleOutput: 'true',
      testCases: [
        { input: '[1, 2, 3, 1]', expectedOutput: 'true', isHidden: false },
        { input: '[1, 2, 3, 4]', expectedOutput: 'false', isHidden: false },
        { input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expectedOutput: 'true', isHidden: true },
      ],
    },
    explanation:
      'Optimal Approach: Use a Hash Set. For each element, if already present in Set, return true. Otherwise insert. If loop finishes, return false. Time: O(N), Space: O(N).',
    tags: ['Coding', 'LeetCode-217', 'Hash-Table', 'Arrays'],
  },
  {
    title: 'LeetCode #242: Valid Anagram',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #242 - Valid Anagram
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const count = {};
  for (let char of s) {
    count[char] = (count[char] || 0) + 1;
  }

  for (let char of t) {
    if (!count[char]) return false;
    count[char]--;
  }

  return true;
}`,
      sampleInput: 's = "anagram", t = "nagaram"',
      sampleOutput: 'true',
      testCases: [
        { input: '"anagram", "nagaram"', expectedOutput: 'true', isHidden: false },
        { input: '"rat", "car"', expectedOutput: 'false', isHidden: false },
      ],
    },
    explanation:
      'Optimal Approach: If lengths differ, return false. Count character frequencies in string s, then decrement with string t. If any count drops below 0, return false. Time: O(N), Space: O(1) bounded by 26 English lowercase characters.',
    tags: ['Coding', 'LeetCode-242', 'Hash-Table', 'Strings'],
  },
  {
    title: 'LeetCode #70: Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #70 - Climbing Stairs
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  if (n <= 2) return n;

  let first = 1;
  let second = 2;

  for (let i = 3; i <= n; i++) {
    const third = first + second;
    first = second;
    second = third;
  }

  return second;
}`,
      sampleInput: 'n = 3',
      sampleOutput: '3',
      testCases: [
        { input: '2', expectedOutput: '2', isHidden: false },
        { input: '3', expectedOutput: '3', isHidden: false },
        { input: '5', expectedOutput: '8', isHidden: true },
      ],
    },
    explanation:
      'Dynamic Programming / Fibonacci Relation: To reach step n, you can either come from step (n-1) with a 1-step leap, or step (n-2) with a 2-step leap. dp[n] = dp[n-1] + dp[n-2]. Space optimized to O(1). Time: O(N).',
    tags: ['Coding', 'LeetCode-70', 'Dynamic-Programming', 'Math'],
  },
  {
    title: 'LeetCode #125: Valid Palindrome',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.',
    category: 'Coding',
    difficulty: 'Easy',
    type: 'coding',
    options: [],
    codingDetails: {
      language: 'javascript',
      starterCode: `/**
 * LeetCode #125 - Valid Palindrome
 * @param {string} s
 * @return {boolean}
 */
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;

  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }

  return true;
}`,
      sampleInput: 's = "A man, a plan, a canal: Panama"',
      sampleOutput: 'true',
      testCases: [
        { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true', isHidden: false },
        { input: '"race a car"', expectedOutput: 'false', isHidden: false },
        { input: '" "', expectedOutput: 'true', isHidden: true },
      ],
    },
    explanation:
      'Two-Pointer Approach: Sanitize the string to lowercase alphanumeric characters. Use two pointers starting at opposite ends moving inwards. If any characters mismatch, return false. Time: O(N), Space: O(N) or O(1) in-place.',
    tags: ['Coding', 'LeetCode-125', 'Two-Pointers', 'Strings'],
  },
];

const seedQuestions = async () => {
  await Question.deleteMany({});
  await Question.insertMany(placementQuestions);
  console.log(`[Seed] Seeded ${placementQuestions.length} aptitude, CS Core, and LeetCode coding questions.`);
};

module.exports = { seedQuestions, placementQuestions };
