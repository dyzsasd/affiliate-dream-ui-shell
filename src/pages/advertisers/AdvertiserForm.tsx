
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAdvertiserForm } from './hooks/useAdvertiserForm';
import AdvertiserFormFields from './components/AdvertiserFormFields';
import { LoadingState } from './components/LoadingState';

const AdvertiserForm: React.FC = () => {
  const { t } = useTranslation();
  const { advertiserId } = useParams<{ advertiserId: string }>();
  
  const { 
    form, 
    isEditMode, 
    isSubmitting, 
    isAdvertiserLoading, 
    onSubmit, 
    handleCancel 
  } = useAdvertiserForm({ advertiserId });

  if (isAdvertiserLoading && isEditMode) {
    return <LoadingState />;
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? t('advertisers.editAdvertiser') : t('advertisers.createAdvertiser')}
          </CardTitle>
          <CardDescription>
            {isEditMode 
              ? t('advertisers.editAdvertiserDescription') 
              : t('advertisers.createAdvertiserDescription')}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <AdvertiserFormFields form={form} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? t('common.saveChanges') : t('common.create')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdvertiserForm;
