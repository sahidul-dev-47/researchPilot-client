"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn } from "@/lib/auth-client";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl");
  // Ensure callbackUrl is a relative path to prevent open-redirect attacks
  const callbackUrl =
    rawCallback && rawCallback.startsWith("/")
      ? rawCallback
      : ROUTES.dashboard;

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    const toastId = toast.loading("Signing in...");
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe ?? false,
      });

      if (error) {
        toast.error(error.message ?? "Invalid credentials. Please try again.", {
          id: toastId,
        });
        return;
      }

      toast.success("Welcome back!", { id: toastId });
      router.push(callbackUrl);
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
      const res = await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        toast.error(res.error.message ?? "Google sign in failed", {
          id: toastId,
        });
        setIsGoogleLoading(false);
      } else if (res?.data?.url) {
        window.location.href = res.data.url;
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
      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3 h-11"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        id="google-signin-btn"
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
            or continue with email
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
        aria-label="Sign in form"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="login-email">Email address</Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={cn("pl-10", errors.email && "border-destructive")}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p
              id="login-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <button
              type="button"
              className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              id="forgot-password-btn"
              onClick={() =>
                toast.info("Password reset coming soon. Contact support.")
              }
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className={cn(
                "pl-10 pr-10",
                errors.password && "border-destructive"
              )}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
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
              id="login-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            {...register("rememberMe")}
          />
          <Label
            htmlFor="remember-me"
            className="text-sm font-normal cursor-pointer select-none"
          >
            Remember me for 30 days
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 gradient-primary border-0 text-white hover:opacity-90 shadow-md shadow-primary/25 font-medium"
          disabled={isSubmitting || isGoogleLoading}
          id="login-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-primary hover:underline"
          id="goto-register-link"
        >
          Create account
        </Link>
      </p>
    </motion.div>
  );
}