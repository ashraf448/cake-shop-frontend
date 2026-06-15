import { useState } from "react";
import {
  TextField,
  FormControl,
  Button,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink , useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import loginSchema from "../../validations/loginValidation";
import useAuth from '../../zustand/AuthSlice'
import { success } from "zod";
import toast from 'react-hot-toast'
export default function Register() {
  const { register, handleSubmit, formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode :'all'
  });

  const navigate = useNavigate()
  const loginHandler =useAuth ( s=>s.loginHandler)
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);

  const onSubmit =async (data) => {
   const res =await loginHandler(data);
    if (res.success) {
        setErr(null)
        navigate('/')
        scrollTo({top:0})
        toast.success("Success Login")
    }else{
        setErr(res.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-112.5"
      >
        <Typography variant="h4" textAlign="center" mb={3} fontWeight="bold">
          Login
        </Typography>

        

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

       

        {/* Password */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            {...register("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          <p className="text-red-500 text-sm">
            {errors.password?.message}
          </p>
        </FormControl>
            {
                err &&
                <div className="bg-red-100 text-red-700 text-center rounded shadow">{err}</div>
            }
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>

        {/* <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <NavLink to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
            Login
          </NavLink>
        </Typography> */}
      </form>
    </div>
  );
}