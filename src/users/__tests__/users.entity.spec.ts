import Users from '../users.entity'

describe('Users Entity', () => {
  it('should have email and password fields', () => {
    const email = 'email@email.com'
    const password = '123qwe!@#QWE'
    const newUser = new Users(email, password)

    expect(newUser.email).toBe(email)
  })

  it('should return an error when the email is invalid', () => {
    const email = 'invalid e-mail'
    const password = '123qwe!@#QWE'
    const newUser = new Users(email, password)
    const validation = newUser.validate()

    expect(validation.errors.length).toBeTruthy()
  })

  it('should return an error when the password is invalid', () => {
    const email = 'email@email.com'
    const password = 'lowercase'
    const newUser = new Users(email, password)
    const validation = newUser.validate()

    expect(validation.errors.length).toBeTruthy()
  })
})