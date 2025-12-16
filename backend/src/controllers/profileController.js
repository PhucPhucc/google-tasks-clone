export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json("server bi loi roi");
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { newPassword } = req.body;

    if (newPassword.length <= 6 && newPassword === null) {
      return res
        .status(400)
        .json("password phai co do dai lon hon 6 hoac khong duoc null");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json("password da duoc thay doi thanh cong");
  } catch (error) {
    return res.status(500).json("server bi loi roi");
  }
};
