const isLogin=async (req,res,next) => {
    try {
        
        if (req.session.admin_id) {
            //  Already logged in — proceed to next middleware or route
            next();
        } else {
            return res.redirect('/admin')
            
        }
        
    } catch (error) {
        console.log(error.message);
        return res.redirect('/admin')
        
    }
}
const isLogout=async (req,res,next) => {
    try {
        if (req.session.admin_id) {
            // If logged in, don’t allow visiting login page again
            return res.redirect('/admin/home');
        }
        // continue to login page if not logged in
        next();
        
    } catch (error) {
        console.log(error.message);
        return res.redirect('/admin/home');
        
    }
}
module.exports={
    isLogin,
    isLogout
}


