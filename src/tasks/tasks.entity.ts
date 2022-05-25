class Tasks {
  id?: string
  description: string
  isDone: boolean

  constructor (description: string, isDone: boolean) {
    this.description = description
    this.isDone = isDone
  }

  validate () {
    const errors = this.description.length < 255 
      ? 'Description should have less then 255 characters'
      : false

    return {
      success: !errors,
      errors,
      data: {
        email: this.description,
        password: this.isDone
      }
    }
  }
}

export default Tasks