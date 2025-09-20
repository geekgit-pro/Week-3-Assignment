const {z, ZodError}= require('zod');
const errorObj = require('../util/errorBuilder');


function adminValidation(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const adminSchema = z.object({
        username : z.string()
                    .min(3,'Username cant be less that 3 characters')
                    .max(10,'Usernmae cant be more thatn 10 characters'),
        password : z.string()
                    .min(3,'Password cant be less that 3 characters')
                    .max(10,'Password cant be more thatn 10 characters')
        
    });
    console.log(adminSchema);

    try {
        const admin = adminSchema.parse({username, password});
        console.log("hi this is ",admin);
        return next();
    } catch (error) {
        if(error instanceof ZodError) {
            console.log("This is the big error object", JSON.stringify(error));
            console.log("hi this is array of zod.issues", error.issues)
            error.status = 400;
            error.message = 'Username or password validation failed'
            const errors = error.issues.map((issue)=>{
                return {
                    message : issue.message,
                    field : issue.path[0]
                }
            });
        console.log("hi this is errors array", errors);
            
            return next(errorObj.errorBuilder(error.message,error.status,errors));
        }
        return next(errorObj.errorBuilder(error.message,error.status));
    }

}

module.exports = adminValidation;