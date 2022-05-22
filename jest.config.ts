import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    testEnvironment: 'node'
  }
}
