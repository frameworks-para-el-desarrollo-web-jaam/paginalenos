import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import {Link} from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();    
  const {signin, errors: signinErrors, isAuthenticated} = useAuth(); 
  const navigate = useNavigate(); 

  useEffect(() => {
      if (isAuthenticated) navigate("/");
    }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)]">
      <div className="bg-red-800 max-w-md w-full p-10 rounded-md">
        
        {
            signinErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white" key = {i}>
                    {error}
                </div>

            ))
        }


        <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full bg-red-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500">Email es requerido</p>}

          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full bg-red-700 text-white px-4 py-2 rounded-md my-2"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">Password es requerido</p>
          )}
          <button type="submit" className="bg-orange-500 rounded-full flex w-full text-center font-bold justify-center items-center text-white py-2">Iniciar Sesión</button>

          <p className="flex gap-x-2 justify-between">
            ¿No tienes una Cuenta?<Link to="/register" className="text-blue-500">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
