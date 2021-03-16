export default class ScheduleService {

  private static HOURS_TO_POST = [20] //GMT +00:00, conversão pra BR é -3 
  private static day = new Date().getDay() 
  private static schedule = ScheduleService.HOURS_TO_POST

  static get isItTime () {
    const date = new Date()
    ScheduleService.resetDay(date)
    const index = ScheduleService.schedule.findIndex(e => date.getHours() === e)
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
      ScheduleService.schedule = ScheduleService.HOURS_TO_POST
    }
  }

  static getSchedule = () => `-> Today's Schedule: ${ScheduleService.schedule} (GMT +00:00)`

  static setSchedule = (newSchedule: number[] ) => {
    ScheduleService.HOURS_TO_POST = newSchedule
    ScheduleService.schedule = ScheduleService.HOURS_TO_POST
    return `-> New Schedule: ${ScheduleService.HOURS_TO_POST}`
  }
}