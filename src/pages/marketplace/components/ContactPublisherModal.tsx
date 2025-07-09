import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";
import type { DomainAnalyticsPublisherResponse } from '@/generated-api/src/models';

interface ContactPublisherModalProps {
  publisher: DomainAnalyticsPublisherResponse;
  isOpen: boolean;
  onClose: () => void;
}

const ContactPublisherModal: React.FC<ContactPublisherModalProps> = ({
  publisher,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);

  const publisherData = publisher.publisher;
  const domain = publisherData?.domain || "Unknown";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    
    // Mock sending delay
    setTimeout(() => {
      toast({
        title: t("marketplace.messageSent"),
        description: t("marketplace.messagesentDescription", { name: domain }),
      });
      setSending(false);
      setFormData({ subject: "", message: "" });
      onClose();
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact {domain}
          </DialogTitle>
          <DialogDescription>
            Send a message to this publisher to start a partnership discussion.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Partnership opportunity"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              disabled={sending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Hi, I'm interested in partnering with your website. I represent..."
              rows={6}
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              disabled={sending}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={sending || !formData.subject.trim() || !formData.message.trim()}
              className="min-w-[100px]"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPublisherModal;