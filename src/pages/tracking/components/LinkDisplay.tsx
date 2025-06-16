
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Copy, Link } from "lucide-react";
import LinkDetailsSection from "./LinkDetailsSection";

interface LinkDisplayProps {
  generatedLink: string;
  campaignName: string;
  affiliateName: string;
  sub1?: string;
  sub2?: string;
  sub3?: string;
  deepLink?: string;
  onCopyToClipboard: () => void;
}

const LinkDisplay: React.FC<LinkDisplayProps> = ({
  generatedLink,
  campaignName,
  affiliateName,
  sub1,
  sub2,
  sub3,
  deepLink,
  onCopyToClipboard,
}) => {
  const { t } = useTranslation();

  return (
    <Card className={`${!generatedLink && "opacity-60"}`}>
      <CardHeader>
        <CardTitle>{t("trackingLinks.yourTrackingLink")}</CardTitle>
        <CardDescription>
          {generatedLink
            ? t("trackingLinks.linkFor", { campaign: campaignName, affiliate: affiliateName })
            : t("trackingLinks.generateLinkToSee")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedLink ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 break-all">
              <div className="flex items-center mb-2">
                <Link className="h-4 w-4 text-affiliate-primary mr-2" />
                <span className="text-sm font-medium">{t("trackingLinks.trackingUrl")}</span>
              </div>
              <p className="text-sm">{generatedLink}</p>
            </div>
            
            <Button
              onClick={onCopyToClipboard}
              variant="outline"
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              {t("trackingLinks.copyToClipboard")}
            </Button>
            
            <Separator />
            
            <LinkDetailsSection
              campaignName={campaignName}
              affiliateName={affiliateName}
              sub1={sub1}
              sub2={sub2}
              sub3={sub3}
              deepLink={deepLink}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Link className="h-8 w-8 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">{t("trackingLinks.noLinkGenerated")}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {t("trackingLinks.fillFormToGenerate")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkDisplay;
