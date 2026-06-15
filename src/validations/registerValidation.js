import {email, z} from "zod"


const registerSchema = z.object({
    firstName : z.string().min(1 ,{message : 'FirstName is Required'}),
    lastName : z.string().min(1 ,{message : 'LastName is Required'}),
    phone : z.string().min(1 ,{message :'Enter your Phone'})
            .regex(/^01[0-25][0-9]{8}$/,{message : 'Invalid Phone Namber'}),
    email : z.string().min(1 ,{message : 'Email is Required'})
            .email( {message : 'Invalid Email'}),
    password : z.string().min(1, { message :'Password is Required'})
        //     .regex(/[A-Z]{1,2}/, {message : 'Enter A Capital Character'})
            .regex(/[1-9]{3}/, {message : 'Enter 3 Namber or More'})
        //     .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, {message : 'Password Must Includes 1 Special Character at Least !'})
          //  .regex(/[a-z]{5}/, {message : 'Enter 5 Character or More'})
            .min(8 ,{message : 'Password must be 8 Character at Least'}),
    confirmPassword : z.string().min(1 , {message : 'ConfirmPassword is Required'}),
    gender : z.enum(['male' , 'female'], {message : 'Gender is Required'})        
})
.refine(schema=>schema.password ===schema.confirmPassword , {message : 'Password is not Matching' , path : ['confirmPassword']})

export default registerSchema