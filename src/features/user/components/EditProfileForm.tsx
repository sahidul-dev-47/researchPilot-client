"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Image, AlignLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateProfile } from "@/features/user/hooks/useUser";
import type { User as UserType } from "@/types/user";

const editProfileSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be at most 160 characters").optional().or(z.literal("")),
  image: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
  user: UserType;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      image: user.image || "",
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    // Backend takes name, image, bio
    updateProfile.mutate(
      {
        name: values.name,
        bio: values.bio || "",
        image: values.image || "",
      },
      {
        onSuccess: () => {
          router.push("/profile");
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border bg-card/60 backdrop-blur-md shadow-lg">
        <CardHeader className="pb-4 border-b border-border/50 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5">
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            Edit User Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                className={`w-full bg-background/50 border ${errors.name ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                {...register("name")}
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs font-semibold text-destructive mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Profile Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Image className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Profile Image URL
              </Label>
              <Input
                id="image"
                placeholder="https://example.com/avatar.jpg"
                className={`w-full bg-background/50 border ${errors.image ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                {...register("image")}
                aria-invalid={errors.image ? "true" : "false"}
                aria-describedby={errors.image ? "image-error" : undefined}
              />
              {errors.image && (
                <p id="image-error" className="text-xs font-semibold text-destructive mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlignLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Biography
              </Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                rows={4}
                className={`w-full bg-background/50 border ${errors.bio ? 'border-destructive focus-visible:ring-destructive' : 'border-border'} resize-none`}
                {...register("bio")}
                aria-invalid={errors.bio ? "true" : "false"}
                aria-describedby={errors.bio ? "bio-error" : undefined}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio ? (
                  <p id="bio-error" className="text-xs font-semibold text-destructive">
                    {errors.bio.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="text-[10px] text-muted-foreground">Max 160 characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile")}
                disabled={updateProfile.isPending}
                className="flex items-center gap-1.5"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
