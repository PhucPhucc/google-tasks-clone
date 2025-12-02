export const responseFailer = (method, error) => {
  console.log(`Lỗi khi gọi ${method}: ' + ${error}`);
  return {
    success: false,
    status: 500,
    message: `Lỗi khi gọi ${method}: ' + ${error}`,
  };
};
