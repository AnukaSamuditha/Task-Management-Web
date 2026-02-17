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
import { userSchema } from "@/schemas";
import { useUserStore } from "@/stores/user.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const accountMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/register", data);

      return res.data;
    },
    onSuccess: (data) => {
      useUserStore.getState().setUser(data?.user);

      reset({
        fullName: "",
        email: "",
        password: "",
      });
      router.push(`/register/verify?email=${data?.user?.email}`);
      toast.info("Verify your email");
    },
    onError: (error) => {
      toast.error("Error in creating the account : " + error.message);
      reset({
        fullName: "",
        email: "",
        password: "",
      });
    },
  });

  const onSubmit = (formData: any) => {
    accountMutation.mutate(formData);
  };
  return (
    <section className="w-full h-auto flex justify-center items-center bg-[#f8f6fc] pb-8">
      <div className="w-full md:w-[45%] lg:w-[35%] h-full flex flex-col gap-5 justify-center items-center pt-8">
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
        <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      {...register("fullName", { required: true })}
                    />
                    {errors.fullName && (
                      <span className="text-xs text-red-500">
                        *{errors.fullName?.message}
                      </span>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500">
                        *{errors.email?.message}
                      </span>
                    )}
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <span className="text-xs text-red-500">
                        *{errors.password?.message}
                      </span>
                    )}
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  <FieldGroup>
                    <Field>
                      <Button
                        type="submit"
                        className="bg-[#f87941]"
                        disabled={!isValid || accountMutation.isPending}
                      >
                        Create Account
                      </Button>
                      <FieldDescription className="px-6 text-center">
                        Already have an account?{" "}
                        <Link href="/login">Sign in</Link>
                      </FieldDescription>
                    </Field>
                  </FieldGroup>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
