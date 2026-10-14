/** Arrow glyphs shared by the auth surfaces — ported verbatim from prototype/{signin,signup}.html. */

export function BackArrow() {
  return (
    <span className="g">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="0.8em"
        height="0.8em"
      >
        <path d="M16 5v5a3 3 0 0 1-3 3H5" />
        <path d="M9 9l-4 4 4 4" />
      </svg>
    </span>
  );
}

export function ForwardArrow() {
  return (
    <span className="g">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="0.8em"
        height="0.8em"
      >
        <path d="M4 10h11" />
        <path d="M11 5l5 5-5 5" />
      </svg>
    </span>
  );
}
