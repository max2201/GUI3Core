import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

export default (app: any) => {
  app.use(VCalendar, {})
}
