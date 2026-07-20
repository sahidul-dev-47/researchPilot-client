"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp, signIn } from "@/lib/auth-client";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(50, "Name must not exceed 50 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterFormValues) {
    const toastId = toast.loading("Creating your account...");
    try {
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(
          error.message ?? "Registration failed. Please try again.",
          { id: toastId }
        );
        return;
      }

      toast.success("Account created! Welcome to ResearchPilot.", {
        id: toastId,
      });
      router.push(ROUTES.dashboard);
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred. Please try again.", {
        id: toastId,
      });
    }
  }

  async function handleGoogleSignIn() {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    const toastId = toast.loading("Redirecting to Google...");

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: ROUTES.dashboard,
      });

      if (error) {
        toast.error(error.message ?? "Google sign in failed", {
          id: toastId,
        });
        setIsGoogleLoading(false);
      } else {
        toast.dismiss(toastId);
      }
    } catch {
      toast.error("Google sign in failed. Please try again.", { id: toastId });
      setIsGoogleLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      {/* Google Sign Up */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3 h-11"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        id="google-signup-btn"
        aria-label="Continue with Google"
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">
            or sign up with email
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
        aria-label="Create account form"
      >
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="register-name">Full name</Label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              placeholder="Jane Smith"
              className={cn("pl-10", errors.name && "border-destructive")}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p
              id="register-name-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="register-email">Email address</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn("pl-10", errors.email && "border-destructive")}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p
              id="register-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-destructive"
              )}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
              }
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="register-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="register-confirm-password">Confirm password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="register-confirm-password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Re-enter password"
              className={cn(
                "pl-10 pr-10",
                errors.confirmPassword && "border-destructive"
              )}
              aria-describedby={
                errors.confirmPassword ? "register-confirm-error" : undefined
              }
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none"
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="register-confirm-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 gradient-primary border-0 text-white hover:opacity-90 shadow-md shadow-primary/25 font-medium"
          disabled={isSubmitting || isGoogleLoading}
          id="register-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-primary hover:underline"
          id="goto-login-link"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
