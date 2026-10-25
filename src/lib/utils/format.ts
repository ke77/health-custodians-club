// dates in the dashboard and emails, always in Ghana time (Africa/Accra, GMT all year)
const timeZone = 'Africa/Accra'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone })
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone })

export function formatDate(value: string | Date) {
  return dateFormat.format(new Date(value))
}

export function formatDateTime(value: string | Date) {
  return dateTimeFormat.format(new Date(value))
}
