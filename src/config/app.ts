const configuredName = import.meta.env.VITE_APP_NAME?.trim()
const configuredInitials = import.meta.env.VITE_APP_INITIALS?.trim()

export const appConfig = {
  name: configuredName || 'Starter Kit',
  initials: (configuredInitials || 'SK').slice(0, 3).toUpperCase(),
}
