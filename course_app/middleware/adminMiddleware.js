
const zod = require('zod');

function adminValidation(req, res, next) {
    const username = req.body.username;
    const password = req.body.password
    const adminSchema = zod.object( {
        username : zod.string()
                    .min(3,'Username cant be less that 3 characters')
                    .max(10,'Usernmae cant be more thatn 10 characters'),
        password : zod.string()
                    .min(3,'Password cant be less that 3 characters')
                    .max(10,'Password cant be more thatn 10 characters')
        
    });
    console.log(adminSchema);

    const admin = adminSchema.safeParse({username, password});
    console.log(admin);

    if(!admin.success)
        return res.status(400).json({
            message : 'Username / password is not corrrect'
        });

    return next();

}

module.exports = adminValidation;