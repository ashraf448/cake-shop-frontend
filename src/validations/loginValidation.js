import {email, z} from "zod"


const loginSchema = z.object({
    email : z.string().min(1 ,{message : 'Email is Required'})
            .email( {message : 'Invalid Email'}),
    password : z.string().min(1, { message :'Password is Required'})
})

export default loginSchema