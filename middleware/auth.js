// middleware/auth.js

const isLogin = (req, res, next) => {
  try {
    if (!req.session.user_id) {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.redirect("/login");
  }
};

const isLogout = (req, res, next) => {
  try {
    if (req.session.user_id) {
      return res.redirect("/home");  // IMPORTANT
    }
    next();
  } catch (error) {
    console.log(error.message);
    return res.redirect("/login");
  }
};

module.exports = { isLogin, isLogout };
