"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/providers/axios";
import { loginSchema } from "@/schemas";
import { useUserStore } from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    reset,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("auth/login", data);

      return res.data;
    },
    onSuccess: (data) => {
      useUserStore.getState().setUser(data?.user);
      toast.success("Login successfull");
      reset();
      router.replace("/");
    },
    onError: (error) => {
      toast.error("Error logging : " + error.message);
      reset();
    },
  });

  const onSubmit = (formData: any) => {
    loginMutation.mutate(formData);
  };

  return (
    <section className="w-full h-auto flex justify-center items-center bg-[#f8f6fc] pb-8">
      <div className="lg:w-[30%] h-full flex flex-col gap-5 justify-center items-center pt-8">
        <div className="flex justify-start items-center gap-2">
          <div className="w-5 h-5 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              fill="none"
            >
              <path
                d="M 100 136 C 111.046 136 120 144.954 120 156 L 120 256 L 100 256 C 44.772 256 0 211.228 0 156 L 0 136 Z M 256 256 L 136 256 L 136 156 C 136 144.954 144.954 136 156 136 L 256 136 Z M 120 100 C 120 111.046 111.046 120 100 120 L 0 120 L 0 100 C 0 44.772 44.772 0 100 0 L 120 0 Z M 156 0 C 211.228 0 256 44.772 256 100 L 256 120 L 156 120 C 144.954 120 136 111.046 136 100 L 136 0 Z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <h4 className="text-sm font-semibold">TaskFlow</h4>
        </div>
        <div className="w-full flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { required: true })}
                      placeholder="m@example.com"
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: true })}
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="bg-[#f87941]"
                      disabled={!isValid || loginMutation.isPending}
                    >
                      Login
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account?{" "}
                      <Link href="/register">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
