import { AdvertiserAssociationInvitationsApi } from '@/generated-api/src/apis';
import { 
  DomainCreateInvitationRequest,
  DomainUpdateInvitationRequest,
  DomainUseInvitationRequest
} from '@/generated-api/src/models';
import { createApiClient, createPublicApiClient } from './backendApi';

// Authenticated invitation service
export class InvitationService {
  private static async getClient() {
    return createApiClient(AdvertiserAssociationInvitationsApi);
  }

  static async createInvitation(request: DomainCreateInvitationRequest) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsPost({ request });
  }

  static async getInvitations(params?: {
    advertiserOrgId?: number;
    status?: any;
    createdByUserId?: string;
    includeExpired?: boolean;
    limit?: number;
    offset?: number;
  }) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsGet(params || {});
  }

  static async getInvitation(id: number) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsIdGet({ id });
  }

  static async updateInvitation(id: number, request: DomainUpdateInvitationRequest) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsIdPut({ id, request });
  }

  static async deleteInvitation(id: number) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsIdDelete({ id });
  }

  static async generateInvitationLink(id: number, baseUrl?: string) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsIdLinkGet({ id, baseUrl });
  }

  static async getUsageHistory(id: number, limit?: number) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsIdUsageHistoryGet({ id, limit });
  }

  static async useInvitation(request: DomainUseInvitationRequest) {
    const client = await this.getClient();
    return client.advertiserAssociationInvitationsUsePost({ request });
  }
}

// Public invitation service (no authentication)
export class PublicInvitationService {
  private static getClient() {
    return createPublicApiClient(AdvertiserAssociationInvitationsApi);
  }

  static async getPublicInvitation(token: string) {
    const client = this.getClient();
    return client.publicInvitationsTokenGet({ token });
  }
}