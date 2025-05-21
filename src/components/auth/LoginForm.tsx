
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { signIn, isSubmitting } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: t("common.error"),
        description: t("auth.emailAndPasswordRequired"),
        variant: "destructive",
      });
      return;
    }
    
    try {
      await signIn({ email, password });
      
      // Remember email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled in the auth context
    }
  };

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          {t("auth.email")}
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          disabled={isSubmitting}
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            {t("auth.password")}
          </label>
          <Link
            to="/forgot-password"
            className="text-xs text-affiliate-primary hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            disabled={isSubmitting}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="rememberMe" 
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)} 
        />
        <label
          htmlFor="rememberMe"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("auth.rememberMe")}
        </label>
      </div>
      
      <Button
        type="submit"
        className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("auth.signingIn")}
          </>
        ) : (
          t("auth.signIn")
        )}
      </Button>
      
      <div className="mt-2 text-sm">
        {t("auth.demoCredentials")}
      </div>
    </form>
  );
};

export default LoginForm;
