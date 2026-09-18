import type { ReactNode } from 'react'

export type IconName =
  | 'arrow-right'
  | 'calendar'
  | 'card'
  | 'cash'
  | 'chart'
  | 'chevron-down'
  | 'clock'
  | 'dashboard'
  | 'history'
  | 'logout'
  | 'package'
  | 'paw'
  | 'pix'
  | 'plus'
  | 'receipt'
  | 'search'
  | 'trash'
  | 'user'

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
}

const paths: Record<IconName, ReactNode> = {
  'arrow-right': <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h2" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 10h.01M17 14h.01" /><circle cx="12" cy="12" r="2" /></>,
  chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" /></>,
  package: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4.5 7.5 7.5 4 7.5-4M12 21v-9.5" /></>,
  paw: <><ellipse cx="12" cy="15" rx="5" ry="4" /><circle cx="6" cy="10" r="2" /><circle cx="10" cy="6" r="2" /><circle cx="14" cy="6" r="2" /><circle cx="18" cy="10" r="2" /></>,
  pix: <><path d="m12 3 4.5 4.5a2 2 0 0 0 2.8 0L21 6" /><path d="m12 21-4.5-4.5a2 2 0 0 0-2.8 0L3 18" /><path d="m3 6 6.5 6.5a3.5 3.5 0 0 0 5 0L21 6" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  receipt: <><path d="M5 3v18l3-2 2 2 2-2 2 2 2-2 3 2V3l-3 2-2-2-2 2-2-2-2 2Z" /><path d="M9 9h6M9 13h6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
}

export function Icon({ name, size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
    >
      {paths[name]}
    </svg>
  )
}
