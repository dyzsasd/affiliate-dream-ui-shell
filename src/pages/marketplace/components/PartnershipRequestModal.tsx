
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Publisher } from "../types/publisher";

interface PartnershipRequestModalProps {
  publisher: Publisher;
  isOpen: boolean;
  onClose: () => void;
}

const PartnershipRequestModal: React.FC<PartnershipRequestModalProps> = ({
  publisher,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignType: "",
    budget: "",
    duration: "",
    payoutModel: "",
    payoutAmount: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: t("marketplace.partnershipRequestSent"),
      description: t("marketplace.partnershipRequestSentDescription", { name: publisher.name }),
    });

    setIsLoading(false);
    onClose();
    setFormData({
      campaignType: "",
      budget: "",
      duration: "",
      payoutModel: "",
      payoutAmount: "",
      message: ""
    });
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("marketplace.requestPartnershipWith", { name: publisher.name })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaignType">{t("marketplace.campaignType")}</Label>
              <Select 
                value={formData.campaignType} 
                onValueChange={(value) => updateFormData("campaignType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("marketplace.selectCampaignType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product-promotion">{t("marketplace.productPromotion")}</SelectItem>
                  <SelectItem value="brand-awareness">{t("marketplace.brandAwareness")}</SelectItem>
                  <SelectItem value="lead-generation">{t("marketplace.leadGeneration")}</SelectItem>
                  <SelectItem value="content-collaboration">{t("marketplace.contentCollaboration")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{t("marketplace.budget")}</Label>
              <Input
                id="budget"
                type="number"
                placeholder="0"
                value={formData.budget}
                onChange={(e) => updateFormData("budget", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t("marketplace.campaignDuration")}</Label>
              <Select 
                value={formData.duration} 
                onValueChange={(value) => updateFormData("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("marketplace.selectDuration")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 {t("marketplace.week")}</SelectItem>
                  <SelectItem value="2-weeks">2 {t("marketplace.weeks")}</SelectItem>
                  <SelectItem value="1-month">1 {t("marketplace.month")}</SelectItem>
                  <SelectItem value="3-months">3 {t("marketplace.months")}</SelectItem>
                  <SelectItem value="6-months">6 {t("marketplace.months")}</SelectItem>
                  <SelectItem value="ongoing">{t("marketplace.ongoing")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutModel">{t("marketplace.preferredPayoutModel")}</Label>
              <Select 
                value={formData.payoutModel} 
                onValueChange={(value) => updateFormData("payoutModel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("marketplace.selectPayoutModel")} />
                </SelectTrigger>
                <SelectContent>
                  {publisher.payoutModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payoutAmount">{t("marketplace.proposedPayoutAmount")}</Label>
            <Input
              id="payoutAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.payoutAmount}
              onChange={(e) => updateFormData("payoutAmount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t("marketplace.message")}</Label>
            <Textarea
              id="message"
              placeholder={t("marketplace.messagePlaceholder")}
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t("marketplace.sending") : t("marketplace.sendRequest")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipRequestModal;
