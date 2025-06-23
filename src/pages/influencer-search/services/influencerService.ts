
import { Influencer } from '../types/influencer';
import { mockInfluencers } from '../data/mockInfluencers';

export class InfluencerService {
  /**
   * Get all influencers
   */
  static getAllInfluencers(): Influencer[] {
    return mockInfluencers;
  }

  /**
   * Get influencer by ID
   */
  static getInfluencerById(id: string): Influencer | null {
    const influencer = mockInfluencers.find(inf => inf.id === id);
    return influencer || null;
  }

  /**
   * Search influencers by name, bio, or industry
   */
  static searchInfluencers(query: string): Influencer[] {
    if (!query.trim()) {
      return mockInfluencers;
    }

    const lowercaseQuery = query.toLowerCase();
    return mockInfluencers.filter(influencer => 
      influencer.name.toLowerCase().includes(lowercaseQuery) ||
      influencer.bio.toLowerCase().includes(lowercaseQuery) ||
      influencer.industries.some(industry => 
        industry.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Get influencers by category
   */
  static getInfluencersByCategory(category: string): Influencer[] {
    return mockInfluencers.filter(influencer => 
      influencer.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get influencers by language
   */
  static getInfluencersByLanguage(language: string): Influencer[] {
    return mockInfluencers.filter(influencer => 
      influencer.language.toLowerCase() === language.toLowerCase()
    );
  }

  /**
   * Get verified influencers only
   */
  static getVerifiedInfluencers(): Influencer[] {
    return mockInfluencers.filter(influencer => influencer.isVerified);
  }
}

export default InfluencerService;
