// README: For use this file add it to jest config
// "setupFilesAfterEnv": ["<rootDir>/test/utils/setupTests.ts"],

// Configure Jest to run tests serially
jest.setTimeout(30000); // Set a timeout for each test
jest.useFakeTimers(); // Use fake timers for setTimeout and setInterval

// Add any setup code that you want to run before all tests
beforeAll(() => {
    // await Context.getInstance();
  // Add your setup code here
});

// Optionally, you can also add a global teardown function
afterAll(() => {
  // Add your teardown code here
});
