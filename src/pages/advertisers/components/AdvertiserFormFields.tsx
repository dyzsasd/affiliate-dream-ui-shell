
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Building2, 
  Globe, 
  Settings, 
  Mail, 
  Code, 
  Clock,
  FileText
} from 'lucide-react';
import { AdvertiserFormData } from '../types/advertiser';

interface AdvertiserFormFieldsProps {
  form: UseFormReturn<AdvertiserFormData>;
}

const AdvertiserFormFields: React.FC<AdvertiserFormFieldsProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Basic Information - Mandatory Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('advertisers.basicInfo')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {t('advertisers.nameLabel')}
                  <Badge variant="destructive" className="text-xs">{t('common.required')}</Badge>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.namePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {t('advertisers.statusLabel')}
                  <Badge variant="destructive" className="text-xs">{t('common.required')}</Badge>
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('advertisers.selectStatus')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t('advertisers.statusActive')}</SelectItem>
                    <SelectItem value="pending">{t('advertisers.statusPending')}</SelectItem>
                    <SelectItem value="inactive">{t('advertisers.statusInactive')}</SelectItem>
                    <SelectItem value="rejected">{t('advertisers.statusRejected')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('advertisers.contactInfo')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.emailLabel')}</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder={t('advertisers.emailPlaceholder')} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountingContactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accounting Contact Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="accounting@example.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Platform Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Platform Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="platformName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Shopify, WooCommerce" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformUsername"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username/Login" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="platformUrl"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Platform URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Attribution & Tracking */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Attribution & Tracking</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="attributionMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attribution Method</FormLabel>
                <FormControl>
                  <Input placeholder="First-click, Last-click, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="attributionPriority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attribution Priority</FormLabel>
                <FormControl>
                  <Input placeholder="High, Medium, Low" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emailAttributionMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Attribution Method</FormLabel>
                <FormControl>
                  <Input placeholder="Email attribution method" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affiliateIdMacro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Affiliate ID Macro</FormLabel>
                <FormControl>
                  <Input placeholder="{affiliate_id}" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerIdMacro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offer ID Macro</FormLabel>
                <FormControl>
                  <Input placeholder="{offer_id}" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Settings</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="defaultCurrencyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Currency</FormLabel>
                <FormControl>
                  <Input placeholder="USD, EUR, GBP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reportingTimezoneId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reporting Timezone</FormLabel>
                <FormControl>
                  <Input placeholder="GMT, PST, EST" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Billing Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">{t('advertisers.billingDetailsLabel')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.addressLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.addressPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billingCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.cityLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.cityPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billingState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.stateLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.statePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billingCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.countryLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.countryPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="billingPostalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('advertisers.postalCodeLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('advertisers.postalCodePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="billingTaxId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID</FormLabel>
                <FormControl>
                  <Input placeholder="Tax identification number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator />

      {/* Internal Notes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Internal Notes</h3>
        </div>
        
        <FormField
          control={form.control}
          name="internalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any internal notes about this advertiser..."
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AdvertiserFormFields;
