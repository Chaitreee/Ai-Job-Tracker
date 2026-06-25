// Shared SVG icon components — consistent stroke style across the app

export function SunIcon({ className = 'w-4 h-4' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

export function MoonIcon({ className = 'w-4 h-4' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// 📋  → checklist / track applications
export function ChecklistIcon({ className = 'w-6 h-6' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M11 6L21 6"/>
      <path d="M11 12L21 12"/>
      <path d="M11 18L21 18"/>
      <path d="M3 7.39286C3 7.39286 4 8.04466 4.5 9C4.5 9 6 5.25 8 4" strokeLinejoin="round"/>
      <path d="M3 18.3929C3 18.3929 4 19.0447 4.5 20C4.5 20 6 16.25 8 15" strokeLinejoin="round"/>
    </svg>
  )
}

// 🗂️  → kanban / columns
export function KanbanIcon({ className = 'w-6 h-6' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 18.5L21 11.5C21 10.5694 21 10.104 20.8776 9.72746C20.6303 8.96636 20.0336 8.36965 19.2725 8.12236C18.896 8 18.4306 8 17.5 8C16.5694 8 16.104 8 15.7275 8.12236C14.9664 8.36965 14.3697 8.96636 14.1224 9.72746C14 10.104 14 10.5694 14 11.5L14 18.5C14 19.4306 14 19.896 14.1224 20.2725C14.3697 21.0336 14.9664 21.6303 15.7275 21.8776C16.104 22 16.5694 22 17.5 22C18.4306 22 18.896 22 19.2725 21.8776C20.0336 21.6303 20.6303 21.0336 20.8776 20.2725C21 19.896 21 19.4306 21 18.5Z"/>
      <path d="M10 18.5L10 11.5C10 10.5694 10 10.104 9.87764 9.72746C9.63035 8.96636 9.03364 8.36965 8.27254 8.12236C7.89596 8 7.43064 8 6.5 8C5.56936 8 5.10404 8 4.72746 8.12236C3.96636 8.36965 3.36965 8.96636 3.12236 9.72746C3 10.104 3 10.5694 3 11.5L3 18.5C3 19.4306 3 19.896 3.12236 20.2725C3.36965 21.0336 3.96636 21.6303 4.72746 21.8776C5.10404 22 5.56936 22 6.5 22C7.43064 22 7.89596 22 8.27254 21.8776C9.03364 21.6303 9.63035 21.0336 9.87764 20.2725C10 19.896 10 19.4306 10 18.5Z"/>
      <path d="M9 2.00002C9 2.00002 11.2095 4.99999 12 5C12.7906 5.00001 15 2 15 2"/>
    </svg>
  )
}

// 🤖  → AI / resume match
export function AIIcon({ className = 'w-6 h-6' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V10C2 6.22876 2 4.34315 3.17157 3.17157C4.34315 2 6.22876 2 10 2H12C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V10.5"/>
      <path d="M17.4069 14.4036C17.6192 13.8655 18.3808 13.8655 18.5931 14.4036L18.6298 14.4969C19.1482 15.8113 20.1887 16.8518 21.5031 17.3702L21.5964 17.4069C22.1345 17.6192 22.1345 18.3808 21.5964 18.5931L21.5031 18.6298C20.1887 19.1482 19.1482 20.1887 18.6298 21.5031L18.5931 21.5964C18.3808 22.1345 17.6192 22.1345 17.4069 21.5964L17.3702 21.5031C16.8518 20.1887 15.8113 19.1482 14.4969 18.6298L14.4036 18.5931C13.8655 18.3808 13.8655 17.6192 14.4036 17.4069L14.4969 17.3702C15.8113 16.8518 16.8518 15.8113 17.3702 14.4969L17.4069 14.4036Z"/>
      <path d="M7 7H15M7 11.5H15M7 16H11"/>
    </svg>
  )
}

// 📊  → analytics / chart
export function AnalyticsIcon({ className = 'w-6 h-6' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8.5" cy="10.5" r="1.5"/>
      <circle cx="14.5" cy="15.5" r="1.5"/>
      <circle cx="18.5" cy="7.5" r="1.5"/>
      <path d="M15.4341 14.2963L18 9M9.58251 11.5684L13.2038 14.2963M3 19L7.58957 11.8792" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 21H9C5.70017 21 4.05025 21 3.02513 19.9749C2 18.9497 2 17.2998 2 14V3" strokeLinecap="round"/>
    </svg>
  )
}
