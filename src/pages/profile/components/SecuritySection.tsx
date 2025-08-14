import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import { Key, Mail } from 'lucide-react';

const SecuritySection: React.FC = () => {
  const { user, forgotPassword } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      await forgotPassword(user.email);
      toast({
        title: t("auth.resetEmailSent"),
        description: t("auth.checkEmailInstructions"),
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          {t("profile.securitySettings")}
        </CardTitle>
        <CardDescription>
          {t("profile.securitySettingsDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{t("profile.resetPassword")}</p>
              <p className="text-sm text-muted-foreground">
                {t("profile.resetPasswordDescription")}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleResetPassword}
            disabled={isLoading || !user?.email}
          >
            {isLoading ? t("auth.sendingResetEmail") : t("profile.resetPassword")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;