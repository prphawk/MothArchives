import fs from 'fs'
import ScheduleDataModel from '../types/ScheduleDataModel'

export default class ScheduleService {

  private static dataDir = 'data/ScheduleData.json'
  private static data = { day: -1, schedule: [] } as ScheduleDataModel

  static get isItTime () {

    const date = new Date()
    ScheduleService.resetDay(date.getDay())

    const index = ScheduleService.data.schedule
    .findIndex(e => date.getHours() === e)

    if(index >= 0) {
      ScheduleService.data.schedule.splice(index, 1)
      return true
    }
    
    return false
  }

  private static resetDay = (currDay: number) => {

    if(ScheduleService.data.day != currDay) {
      ScheduleService.data.day = currDay

      const data = fs.readFileSync(ScheduleService.dataDir).toString()

      try {
        const schedule = JSON.parse(data).schedule
        ScheduleService.setScheduleData(schedule)
      }
      catch (err) {
        console.warn('-> There has been an error parsing the JSON.')
        console.error(err)
      }
    }
  }

  static getSchedule = () => `-> Today's Schedule: ${ScheduleService.data.schedule} (GMT +00:00)`


  static setScheduleData = (newSchedule: number[]) => {

    const newData = { day: new Date().getDay(), schedule: newSchedule }

    fs.writeFile(ScheduleService.dataDir, 
      JSON.stringify(newData), (err) => {
        if (err) {
          console.warn('-> There has been an error saving the schedule data.')
          console.error(err.message);
        }
    })

    ScheduleService.data = newData

    return `-> New Schedule: ${ScheduleService.data.schedule}`
  }
}