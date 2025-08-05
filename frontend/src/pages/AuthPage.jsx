import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register, reset } from "../app/features/authSlice";
import { LogIn, UserPlus, AtSign, Lock, User, AlertCircle } from "lucide-react";

const InputField = ({ icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-500">
      {icon}
    </div>
    <input
      className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
      {...props}
    />
  </div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // TODO: You toast notification library here instead
      console.error(message);
    }

    if (isSuccess || userInfo) {
      navigate("/");
    }

    dispatch(reset());
  }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const userData = { email, password };
      dispatch(login(userData));
    } else {
      const userData = { name, email, password };
      dispatch(register(userData));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-pink-500 text-white items-center justify-center font-bold text-3xl leading-[4rem]">
            R
          </div>
          <h1 className="text-4xl font-bold text-white mt-4">Dev Dashboard</h1>
          <p className="text-gray-400">
            {isLogin
              ? "Welcome back! Please login to continue."
              : "Create an account to start your journey."}
          </p>
        </div>

        <div className="bg-black/30 border border-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <form onSubmit={onSubmit} className="space-y-6">
            {!isLogin && (
              <InputField
                icon={<User size={20} />}
                type="text"
                id="name"
                name="name"
                value={name}
                placeholder="Enter your name"
                onChange={onChange}
                required
              />
            )}
            <InputField
              icon={<AtSign size={20} />}
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={onChange}
              required
            />
            <InputField
              icon={<Lock size={20} />}
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={onChange}
              required
            />

            {isError && message && (
              <div className="flex items-center text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                <AlertCircle size={16} className="mr-2" />
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:from-violet-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={20} />
                  <span>Login</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-violet-400 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
