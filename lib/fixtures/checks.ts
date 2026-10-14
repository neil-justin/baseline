import type { CheckQuestion } from "@/lib/types";

/**
 * Comprehension checks — 5 Qs, pass ≥ 4/5 (LOCKED, M9). Hand-authored
 * fixtures (13a). The demo's money-shot check is the Power BI resource;
 * the Python check gates the onboarding goal's resource.
 */
export const DASHBOARDS_CHECK: CheckQuestion[] = [
  {
    stem: "In Power BI, what is a dashboard mainly for?",
    options: [
      "Showing key numbers and charts on one readable screen",
      "Storing raw spreadsheet files",
      "Writing the code that runs the reports",
      "Deleting old data automatically",
    ],
    answer: 0,
  },
  {
    stem: "Which Power BI element is a live visual you place on a page?",
    options: ["A tile", "A cell", "A macro", "A formula bar"],
    answer: 0,
  },
  {
    stem: "Where does Power BI Desktop get its data for a model?",
    options: [
      "From sources you connect (files, databases) into its data model",
      "Only from the internet",
      "From your screen recorder",
      "It types the numbers itself",
    ],
    answer: 0,
  },
  {
    stem: "What does refreshing a dashboard do?",
    options: [
      "Pulls the latest data into the visuals",
      "Deletes all visuals",
      "Changes the fonts",
      "Publishes a new report file",
    ],
    answer: 0,
  },
  {
    stem: "A good dashboard tile is",
    options: [
      "One clear number or chart a manager can read at a glance",
      "Every dataset you own, dumped on one page",
      "A paragraph of small print",
      "A password-protected folder",
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
  "res-powerbi-dashboards": DASHBOARDS_CHECK,
  "res-python-basics": PYTHON_CHECK,
};

export function getCheck(resourceId: string): CheckQuestion[] | null {
  return CHECKS[resourceId] ?? null;
}
