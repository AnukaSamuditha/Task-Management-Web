"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axiosInstance from "@/providers/axios";
import { verificationCodeSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function VerifyEmail() {
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(`/auth/verify`, data);

      return res.data;
    },
    onSuccess: () => {
      reset({
        code: "",
      });
      router.push("/login");
      toast.success("Email verified successfully");
      toast.info("Account is created successfully");
    },
    onError: (error) => {
      toast.error("Error in verifying the email : " + error.message);
      reset({
        code: "",
      });
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/code", { email });

      return res.data;
    },
    onSuccess: () => {
      toast.success("Verification code is resent");
    },
    onError: (error) => {
      toast.error("Error in sending verification code! " + error.message);
    },
  });

  const onSubmit = (formData: any) => {
    verifyMutation.mutate(formData);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[#f8f6fc]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Verify your Email</CardTitle>
            <CardDescription>
              Enter the verification code we sent to your email address:{" "}
              {email && <span className="font-medium">{email}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="otp-verification">
                  Verification code
                </FieldLabel>
                <Button
                  onClick={() => resendCodeMutation.mutate()}
                  disabled={resendCodeMutation.isPending}
                  variant="outline"
                  size="xs"
                >
                  <RefreshCwIcon />
                  Resend Code
                </Button>
              </div>
              <div className="w-full flex justify-center items-center">
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <InputOTP
                      value={field.value}
                      maxLength={4}
                      onChange={field.onChange}
                      id="otp-verification"
                      required
                    >
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="mx-2" />
                      <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>
              <FieldDescription>
                <Link href="#">
                  I no longer have access to this email address.
                </Link>
              </FieldDescription>
            </Field>
          </CardContent>
          <CardFooter>
            <Field>
              <Button
                type="submit"
                className="w-full bg-[#f87941]"
                disabled={verifyMutation.isPending || !isValid}
              >
                Verify
              </Button>
              <div className="text-muted-foreground text-sm">
                Having trouble signing in?{" "}
                <Link
                  href="#"
                  className="hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Contact support
                </Link>
              </div>
            </Field>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
