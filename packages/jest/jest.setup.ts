beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
});

afterEach(() => {
    jest.resetModules();
});
