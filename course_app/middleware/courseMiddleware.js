const { z, ZodError }  = require('zod');
const errorObj = require('../util/errorBuilder');


function courseValidation(req, res, next) {
    const courseSchema = z.object({
                            title : z.string()
                            .min(3, "Title should be atleast 3 characters long"),
                            description : z.string()
                            .min(3, "Description should be atleast 3 characters long"),
                            price : z.number()
                            .gte(50, "Price should be atleast 50"),
                            imageLink : z.string()
                            .min(3,"Image link should be atleast 3 charactes long")
                    });
    // try {
    //     const course = courseSchema.parse(req.body);
    //     return next();
    // } catch (error) {
    //     if(error instanceof ZodError) {
    //         error.message = 'Couse name input validation failed';
    //         error.status = 400;
    //          const errors = error.issues.map((issue)=>{
    //             return {
    //                 message : issue.message,
    //                 field : issue.path[0]
    //             }
    //         });
    //     return next(errorObj.errorBuilder(error.message, error.status, errors));
    //     }
    //     return next(errorObj.errorBuilder('Validation of course failed',400));
        
    const course = courseSchema.safeParse(req.body);
    if(!course.success) {
        //console.log(error);
        console.log("this is course object",course);
        const errors = course.error.issues.map((issue)=>{
            return {
                message : issue.message,
                field : issue.path[0]
            }
        });
        course.error.status = 400;
        course.error.message = 'Validation failed for course'
        return next(errorObj.errorBuilder(course.error.message,course.error.status,errors));
    }
    return next(errorObj.errorBuilder('Validation failed',400));
}



module.exports = courseValidation;




