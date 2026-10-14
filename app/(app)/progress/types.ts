/** Serializable shapes shared between the Progress server page and its client components. */

export interface CheckResourceLite {
  id: string;
  title: string;
  /** "guide · Microsoft Learn — Power BI · free" style meta line (prebuilt server-side) */
  target: string;
  /** full skill name on the career map ("Dashboards (Power BI)") */
  skill: string;
  /** spoken short form ("dashboards") */
  skillShort: string;
}

export interface CheckQuestionLite {
  stem: string;
  options: string[];
  answer: number;
}
