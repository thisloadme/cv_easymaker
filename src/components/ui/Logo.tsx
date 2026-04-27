export function Logo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      aria-label="CV EasyMaker logo"
    >
      <rect width="100" height="100" fill="#c45a3b" />
      <text
        y="70"
        x="15"
        fontSize="60"
        fill="white"
        fontFamily="serif"
        fontWeight="500"
      >
        C
      </text>
    </svg>
  )
}
