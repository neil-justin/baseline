import type { CheckQuestion } from "@/lib/types";

/**
 * Comprehension checks — 5 Qs, pass ≥ 4/5 (LOCKED, M9). Hand-authored
 * fixtures (13a). Catalog round 9: the demo's money-shot check is the
 * software-testing resource (roster 2.2 walk); the Python check gates the
 * onboarding goal's resource on the Associate Software Developer map.
 */

/** res-qa-testing — the money-shot check (canon beats 6–7). Every answer index 0. */
export const TESTING_CHECK: CheckQuestion[] = [
  {
    stem: "What is the main purpose of software testing?",
    options: [
      "Finding out whether the software does what it should — before users hit the bugs",
      "Writing more features while someone else checks them",
      "Logging into the production database to spot-check numbers",
      "Replacing the developers' definition of done",
    ],
    answer: 0,
  },
  {
    stem: "A test case is best written from",
    options: [
      "A requirement or user story — an expected result you can compare against",
      "The final demo recording",
      "Whatever the developer pastes into the ticket",
      "Your memory of a similar app",
    ],
    answer: 0,
  },
  {
    stem: "You hit a bug that repeats every time. The defect report should include",
    options: [
      "Steps to reproduce, expected vs actual behavior, and the environment",
      "Just the page screenshot",
      "A personal note in your own spreadsheet",
      "Nothing — tell the tester next door verbally",
    ],
    answer: 0,
  },
  {
    stem: "What is regression testing?",
    options: [
      "Re-running existing tests to confirm a fix didn't break something that worked",
      "Testing only the newest feature",
      "Skipping tests when time is short",
      "Deleting old test data after release",
    ],
    answer: 0,
  },
  {
    stem: "Which practice keeps the account's quality standard consistent across testers?",
    options: [
      "Calibration — comparing scores on the same cases against a shared rubric",
      "Each tester scores by personal preference",
      "Only testing on Fridays",
      "Assigning the same bug to a different team each sprint",
    ],
    answer: 0,
  },
];
export const PYTHON_CHECK: CheckQuestion[] = [
  {
    stem: "In Python, what does `for i in range(3):` do?",
    options: [
      "Runs the indented block 3 times",
      "Runs the block once",
      "Repeats forever until you stop it",
      "Checks if i equals 3",
    ],
    answer: 0,
  },
  {
    stem: "Which is a Python list?",
    options: ["[1, 2, 3]", "(1, 2, 3)", "{1: 'a'}", "# 1 2 3"],
    answer: 0,
  },
  {
    stem: "What does `len(\"hello\")` return?",
    options: ["5", "4", "hello", "None"],
    answer: 0,
  },
  {
    stem: "How do you define a function in Python?",
    options: ["def my_func():", "function my_func()", "func my_func():", "define my_func:"],
    answer: 0,
  },
  {
    stem: "Which one prints text in Python 3?",
    options: ["print(\"hi\")", "echo \"hi\"", "console.log(\"hi\")", "printf(\"hi\")"],
    answer: 0,
  },
];

/** Resource id → its comprehension check. */
export const CHECKS: Record<string, CheckQuestion[]> = {
  "res-qa-testing": TESTING_CHECK,
  "res-python-basics": PYTHON_CHECK,
};

export function getCheck(resourceId: string): CheckQuestion[] | null {
  return CHECKS[resourceId] ?? null;
}
