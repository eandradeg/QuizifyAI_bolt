
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useTranslatedToast = () => {
  const { t } = useLanguage();

  const showToast = {
    success: (message?: string) => {
      toast({
        title: t('success'),
        description: message || t('success'),
      });
    },
    
    error: (message?: string) => {
      toast({
        title: t('error'),
        description: message || t('error'),
        variant: 'destructive',
      });
    },
    
    loading: (message?: string) => {
      toast({
        title: t('loading'),
        description: message || t('loading'),
      });
    },
    
    saveSuccess: () => {
      toast({
        title: t('success'),
        description: t('saveSuccess'),
      });
    },
    
    saveError: () => {
      toast({
        title: t('error'),
        description: t('saveError'),
        variant: 'destructive',
      });
    },
    
    deleteSuccess: () => {
      toast({
        title: t('success'),
        description: t('deleteSuccess'),
      });
    },
    
    deleteError: () => {
      toast({
        title: t('error'),
        description: t('deleteError'),
        variant: 'destructive',
      });
    },
    
    updateSuccess: () => {
      toast({
        title: t('success'),
        description: t('updateSuccess'),
      });
    },
    
    updateError: () => {
      toast({
        title: t('error'),
        description: t('updateError'),
        variant: 'destructive',
      });
    },
    
    connectionError: () => {
      toast({
        title: t('error'),
        description: t('connectionError'),
        variant: 'destructive',
      });
    },
    
    requiredField: (fieldName: string) => {
      toast({
        title: t('error'),
        description: `${t('requiredField')}: ${fieldName}`,
        variant: 'destructive',
      });
    },
    
    custom: (title: string, description: string, variant?: 'default' | 'destructive') => {
      toast({
        title,
        description,
        variant,
      });
    }
  };

  return showToast;
};
