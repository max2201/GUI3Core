export const NameCasting = (name: string): string => {
  switch (name) {
    case 'outgoingCall':
      return 'Исходящий звонок'
    case 'incomingCall':
      return 'Входящий звонок'
    case 'activeCall':
      return 'Входящий звонок'
    default:
      return ''
  }
}
