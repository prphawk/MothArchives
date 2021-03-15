export default class ScheduleService {

  private static HOURS_TO_POST = [15] as const //GMT +00:00, conversão pra BR é -3 
  private static day = new Date().getDay() 
  private static schedule = [...ScheduleService.HOURS_TO_POST]

  static get isItTime () {
    const date = new Date()
    ScheduleService.resetDay(date)
    const index = ScheduleService.schedule.findIndex(e => date.getHours() >= e)
    if(index >= 0) {
      ScheduleService.schedule.splice(index, 1)
      return true
    }
    return false
  }

  private static resetDay = (date: Date) => {
    const currDay = date.getDay()
    if(ScheduleService.day != currDay) {
      ScheduleService.day = currDay
      ScheduleService.schedule = [...ScheduleService.HOURS_TO_POST]
    }
  }
}