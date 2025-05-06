import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });

const testUserId = '123';
export const testUser = {
  id: testUserId,
  name: 'JohnDoe',
  email: 'johndoe@mail.com',
  emailVerified: null,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  teamRoles: [
    {
      role: 'ADMIN',
      userId: testUserId,
      teamId: 1,
    },
    {
      role: 'MEMBER',
      userId: testUserId,
      teamId: 3,
    },
    {
      role: 'ADMIN',
      userId: testUserId,
      teamId: 4,
    },
    {
      role: 'MEMBER',
      userId: testUserId,
      teamId: 6,
    },
    {
      role: 'ADMIN',
      userId: testUserId,
      teamId: 25,
    },
  ],
  spaceRoles: [
    {
      role: 'MEMBER',
      userId: testUserId,
      spaceId: 3,
    },
    {
      role: 'ADMIN',
      userId: testUserId,
      spaceId: 4,
    },
    {
      role: 'MEMBER',
      userId: testUserId,
      spaceId: 5,
    },
  ],
};

export const mockUseCurrentUser = jest.fn();

mockUseCurrentUser.mockReturnValue({ user: testUser, isLoading: false });

jest.mock('@/contexts', () => ({
  ...jest.requireActual('@/contexts'),
  useCurrentUser: mockUseCurrentUser,
}));
