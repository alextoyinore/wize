export default function CloseIcon({ className, ...props }) {
  return (
    <svg className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5L5 15M5 5L15 15" />
    </svg>
  );
}
