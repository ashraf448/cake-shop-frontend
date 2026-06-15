import { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Radio,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Typography,
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink , useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import registerSchema from "../../validations/registerValidation";
import useAuth from '../../zustand/AuthSlice'
import { success } from "zod";
import toast from 'react-hot-toast'
export default function Register() {
  const { register, handleSubmit, formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode :'all'
  });

  const navigate = useNavigate()
  const registerHandler =useAuth ( s=>s.registerHandler)
//   const isPendingRegister =useAuth ( s=>s.isPendingRegister)
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit =async (data) => {
   const res =await registerHandler(data);
    if (res.success) {
        setErr(null)
        navigate('/')
        scrollTo({top:0})
        toast.success("Success SignUp")
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
          Create Account
        </Typography>

        {/* First + Last Name */}
        <div className="flex gap-2 mb-2">
          <TextField
            label="First Name"
            fullWidth
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            fullWidth
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </div>

        {/* Email */}
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        {/* Phone */}
        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone?.message}
        />

        {/* Gender */}

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

        {/* Confirm Password */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Confirm Password</InputLabel>
          <OutlinedInput
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
          <p className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </p>
        </FormControl>
        <FormControl margin="normal">
          <FormLabel>Gender</FormLabel>
          <RadioGroup row {...register("gender")}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
          </RadioGroup>
          <p className="text-red-500 text-sm">
            {errors.gender?.message}
          </p>
        </FormControl>
            {
                err &&
                <div className="bg-red-100 text-red-700 text-center rounded shadow">{err}</div>
            }
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>

        <Typography textAlign="center" mt={2}>
          Already have an account?{" "}
          <NavLink to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
            Login
          </NavLink>
        </Typography>
      </form>
    </div>
  );
}