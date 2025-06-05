
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { OrganizationsApi } from "@/generated-api/src/apis/OrganizationsApi";
import { DomainOrganization } from "@/generated-api/src/models";
import { createApiClient } from "@/services/backendApi";
import { useToast } from "@/hooks/use-toast";

const OrganizationList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<DomainOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);
      const organizationsApi = await createApiClient(OrganizationsApi);
      const data = await organizationsApi.organizationsGet({
        page: 1,
        pageSize: 100
      });
      setOrganizations(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case 'advertiser': return 'bg-blue-100 text-blue-800';
      case 'affiliate': return 'bg-green-100 text-green-800';
      case 'platform_owner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-affiliate-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage all organizations on the platform
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizations List */}
      <div className="grid gap-4">
        {filteredOrganizations.map((org) => (
          <Card key={org.organizationId}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {org.organizationId}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-2">
                    <Badge className={getTypeColor(org.type)}>
                      {org.type}
                    </Badge>
                    <Badge variant={getStatusColor(org.status)}>
                      {org.status || 'unknown'}
                    </Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Created: {org.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrganizations.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No organizations match your search.' : 'No organizations have been created yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrganizationList;
