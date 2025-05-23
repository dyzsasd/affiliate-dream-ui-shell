
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { AdvertiserFormData } from '../types/advertiser';

interface AdvertiserFormFieldsProps {
  form: UseFormReturn<AdvertiserFormData>;
}

const AdvertiserFormFields: React.FC<AdvertiserFormFieldsProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('advertisers.nameLabel')}</FormLabel>
            <FormControl>
              <Input placeholder={t('advertisers.namePlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('advertisers.statusLabel')}</FormLabel>
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

      <div className="pt-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5" />
          <h3 className="text-lg font-medium">{t('advertisers.billingDetailsLabel')}</h3>
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
        </div>
      </div>
    </div>
  );
};

export default AdvertiserFormFields;
