const backendBase = import.meta.env.VITE_BACKEND_URL
console.log("backendBase", backendBase)
const Config = {
  backendUrl: backendBase,
  /**
   * POST generate routine timetable (auth).
   * Example:
   * curl --location 'http://localhost:8080/v1/api/user/schedule' \
   *   --header 'Content-Type: application/json' \
   *   --header 'Authorization: Bearer YOUR_TOKEN' \
   *   --data '{"startDate":"2026-03-24","deadline":"2026-04-10","preferredSlot":"evening","studyTime":{"weekdays":3,"weekends":5},"selectedTopics":[{"topicId":"...","priority":5}]}'
   */
  userScheduleUrl:
    import.meta.env.VITE_USER_SCHEDULE_URL || `${String(backendBase).replace(/\/?$/, '/')}user/schedule`,
  /** PUT update saved plan — requires schedule id from POST response `data.scheduleId`. */
  userScheduleByIdUrl: (scheduleId) =>
    `${String(backendBase).replace(/\/?$/, '/')}user/schedule/${scheduleId}`,
  /** GET today’s single-day slice (auth). */
  userTodayPlanUrl: `${String(backendBase).replace(/\/?$/, '/')}user/today-plan`,
  /** GET full saved timetable for the user (auth). */
  userActivePlanUrl: `${String(backendBase).replace(/\/?$/, '/')}user/active-plan`,
}

export default Config
