import fs from 'fs'

export default class ScheduleService {

  private static dataDir = 'src/data/ScheduleData.json'
  private static day = new Date().getDay() 
  private static schedule = []

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

      const data = fs.readFileSync(ScheduleService.dataDir)

      try {
        ScheduleService.schedule = JSON.parse(data.toString())
      }
      catch (err) {
        console.warn('-> There has been an error parsing the JSON.')
        console.error(err)
      }
    }
  }

  static getSchedule = () => `-> Today's Schedule: ${ScheduleService.schedule} (GMT +00:00)`


  static setSchedule = (newSchedule: number[] ) => {

    fs.writeFile(ScheduleService.dataDir, JSON.stringify(newSchedule), (err) => {
      if (err) {
        console.warn('-> There has been an error saving the schedule data.')
        console.error(err.message);
        return
      }
    })

    ScheduleService.schedule = newSchedule

    return `-> New Schedule: ${ScheduleService.schedule}`
  }
}