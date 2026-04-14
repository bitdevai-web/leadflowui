import { Controller, useForm } from "react-hook-form";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { LoginSchma, loginSchema } from "../../schema/auth.schema";

import Button from "../ui/button/Button";
import ErrorMessage from "../form/form-elements/ErrorMessage";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { login } from "../../service/auth.service";
import { queryClient } from "../../main";
import { setAuthToken } from "../../service/token.service";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginSchma>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@leadflow.io",
      password: "VitaminC3#",
    },
  });
  const navigate = useNavigate();

  const { mutate: handleLogin } = useMutation({
    mutationFn: login,
    mutationKey: ["login"],
    async onSuccess(data) {
      toast.success("Login Success!");
      setAuthToken(data.token);
      await queryClient.refetchQueries({
        queryKey: ["user-profile"],
      });
      navigate("/");
    },
    onError() {
      toast.error("Invalid Credentials");
    },
  });

  
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={form.handleSubmit((data) => handleLogin(data))}>
              <div className="space-y-6">
                <div>
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <>
                        <Label>
                          Email <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Input placeholder="info@gmail.com" {...field} />
                        <ErrorMessage fieldState={fieldState} />
                      </>
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                      <>
                        <Label>
                          Password <span className="text-error-500">*</span>{" "}
                        </Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                        </div>
                        <ErrorMessage fieldState={fieldState} />
                      </>
                    )}
                  />
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
