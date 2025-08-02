import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Target, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

const OrganizationTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const organizationTypes = [
    {
      type: 'Advertiser',
      title: t('organizations.typeAdvertiser'),
      description: 'Promote your products and services through affiliate partners',
      icon: Target,
      path: '/onboard/advertiser'
    },
    {
      type: 'Affiliate',
      title: t('organizations.typeAffiliate'),
      description: 'Earn commissions by promoting advertiser products',
      icon: Users,
      path: '/onboard/affiliate'
    },
    {
      type: 'Agency',
      title: 'Agency',
      description: 'Manage multiple advertiser and affiliate accounts',
      icon: Building2,
      path: '/onboard/agency'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to the Platform
          </h1>
          <p className="text-muted-foreground">
            Choose your organization type to get started
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {organizationTypes.map((orgType) => {
            const IconComponent = orgType.icon;
            
            return (
              <Card 
                key={orgType.type}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
                onClick={() => navigate(orgType.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{orgType.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-6">
                    {orgType.description}
                  </CardDescription>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrganizationTypeSelection;