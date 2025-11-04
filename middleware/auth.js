const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      // User is logged in → continue
      return next();
    } else {
      // Not logged in → redirect to login
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home");
    } else {
      return next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
