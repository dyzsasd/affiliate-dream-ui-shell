import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { createApiClient } from '@/services/backendApi';
import { DomainAffiliate } from '@/generated-api/src/models';
import { OrganizationAssociationsApi } from '@/generated-api/src/apis';
import { ArrowLeft, Users, Mail, Calendar, AlertCircle } from 'lucide-react';

const AffiliateDetails: React.FC = () => {
  const { affiliateOrgId } = useParams<{ affiliateOrgId: string }>();
  const { organization } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [affiliates, setAffiliates] = useState<DomainAffiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization?.organizationId && affiliateOrgId) {
      fetchVisibleAffiliates();
    }
  }, [organization, affiliateOrgId]);

  const fetchVisibleAffiliates = async () => {
    try {
      setLoading(true);
      const api = await createApiClient(OrganizationAssociationsApi);
      
      const response = await api.organizationsAdvertiserOrgIdVisibleAffiliatesGet({
        advertiserOrgId: organization!.organizationId!,
        affiliateOrgId: parseInt(affiliateOrgId!),
      });

      setAffiliates(response || []);
    } catch (error) {
      console.error('Error fetching visible affiliates:', error);
      toast({
        title: "Error",
        description: "Failed to load affiliate details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading affiliate details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/associations')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Associations</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">Affiliate Organization Details</CardTitle>
                </div>
              </div>
            </div>
            <CardDescription>
              Visible affiliates for organization ID: {affiliateOrgId}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Affiliates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visible Affiliates</CardTitle>
            <CardDescription>
              List of affiliates that are visible to your organization
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {affiliates.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Visible Affiliates</h3>
                <p className="text-muted-foreground">
                  There are no visible affiliates for this organization.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Updated Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow key={affiliate.affiliateId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {affiliate.name?.charAt(0) || affiliate.contactEmail?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {affiliate.name || 'Unknown Name'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{affiliate.contactEmail || 'No email'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={affiliate.status === 'active' ? 'default' : 'secondary'}
                          className={
                            affiliate.status === 'active' 
                              ? 'text-green-600 border-green-600' 
                              : ''
                          }
                        >
                          {affiliate.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Organization ID: {affiliate.organizationId || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {affiliate.createdAt 
                              ? new Date(affiliate.createdAt).toLocaleDateString() 
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {affiliate.updatedAt 
                              ? new Date(affiliate.updatedAt).toLocaleDateString() 
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDetails;