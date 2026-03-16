export const CustomToggle = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
      checked
        ? "bg-[#2A3B5F] dark:bg-[#C5A059]"
        : "bg-slate-200 dark:bg-slate-700"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);
