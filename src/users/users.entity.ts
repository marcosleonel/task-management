class Users {
  readonly email: string
  readonly password: string

  constructor (email: string, password: string) {
    this.email = email
    this.password = password
    Object.freeze(this)
  }

  validate () {
    const emailRegex = /^[^@\s]+@[^@\s.]+.[^@\s.]+$/
    const passwordRegEx = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/
    const isEmailNotValid = !(emailRegex.test(this.email))
    const isPasswordNotValid = !(passwordRegEx.test(this.password))

    const errors: Object[] = []

    if (isEmailNotValid) {
      errors.push({ message: 'E-mail is not in a valid format (ex: email@email.com)' })
    }

    if (isPasswordNotValid) {
      errors.push({ message: 'Password must contain at least 8 characters' })
    }

    return {
      success: !(errors.length > 0),
      errors: errors.toString(),
      data: {
        email: this.email,
        password: this.password
      }
    }
  }
}

export default Users
