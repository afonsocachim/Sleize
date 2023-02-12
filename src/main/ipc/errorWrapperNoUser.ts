export const errorWrapperNoUser = <T extends any[]>(
  func: (
    ...args: T
  ) => Promise<{ message: string; data: any[] | { [x: string]: any } | null }>
) => {
  return async (...args: T) => {
    try {
      const result = await func(...args);
      return {
        error: false,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      return {
        error: true,
        message: (error as Error).message,
        data: null,
      };
    }
  };
};
