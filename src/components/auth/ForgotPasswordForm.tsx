import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, isSubmitting } = useAuth();
  const { t } = useTranslation();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 font-medium">
          {t("auth.resetEmailSent")}
        </div>
        <p className="text-sm text-gray-600">
          {t("auth.checkEmailInstructions")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.email")}
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{t("auth.emailRequired")}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("auth.sendingResetEmail")}
          </>
        ) : (
          t("auth.sendResetEmail")
        )}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;