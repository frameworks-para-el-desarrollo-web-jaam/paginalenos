import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function RegisterPage() {
  //Esto es un hook que nos permite manejar el estado del formulario, la validación y el envío de datos de manera sencilla. Nos proporciona funciones y objetos para registrar campos, manejar errores y enviar el formulario.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors : registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/pedidos");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    //Vamos a crear un formiulario
    <div className="bg-red-800 max-w-md p-10 rounded-md">
        {
            registerErrors.map((error, i) => (
                <div className="bg-red-500 p-2 text-white" key = {i}>
                    {error}
                </div>

            ))
        }
      <form onSubmit={onSubmit}>
        <input
          type="text"
          {...register("username", { required: true })}
          className="w-full bg-red-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Username"
        />
        {
            errors.username && (
                <p className="text-red-500">
                    Username es requerido
                </p>
            )
        }
        <input
          type="email"
          {...register("email", { required: true })}
          className="w-full bg-red-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Email"
        />
        {
            errors.email && (
                <p className="text-red-500">
                    Email es requerido
                </p>
            )
        }
        
        <input
          type="password"
          {...register("password", { required: true })}
          className="w-full bg-red-700 text-white px-4 py-2 rounded-md my-2"
          placeholder="Password"
        />
        {
            errors.password && (
                <p className="text-red-500">
                    Password es requerido
                </p>
            )
        }
        <button type="submit" className="bg-orange-500 rounded-full flex w-full text-center font-bold justify-center items-center text-white py-2">Registrarme</button>
        <p className="flex gap-x-2 justify-between">
            ¿Ya tienes una Cuenta?<Link to="/login" className="text-blue-500">Iniciar Sesión</Link>
          </p>
      </form>
    </div>
  );
}

export default RegisterPage;
