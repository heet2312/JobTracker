export * from './job.types'
export * from './resume.types'
export * from './application.types'
export * from './ai.types'
export * from './user.types'

export interface ActionResult<T> {
  success: boolean
  data?: T
  error?: string
}
