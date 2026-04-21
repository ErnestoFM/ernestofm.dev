jest.mock('next-auth/react', () => {
  throw new Error('next-auth/react should not be imported at module load time');
});

describe('admin auth components', () => {
  it('imports the admin login page without evaluating next-auth/react', () => {
    expect(() => {
      require('@/app/admin/login/page');
    }).not.toThrow();
  });

  it('imports the admin dashboard without evaluating next-auth/react', () => {
    expect(() => {
      require('@/components/admin/AdminDashboard');
    }).not.toThrow();
  });
});
