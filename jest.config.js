/** @type {import('ts-jest').JestConfigWithTsJest} */ 
module.exports = { 
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], 
  moduleNameMapper: { 
    "^@/(.*)$": "<rootDir>/src/$1", // 
  }, 
  transform: { 
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", 
  }, 
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js|jsx)"], 
};

