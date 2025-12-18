import { LegalPageLayout } from "@/components/auth/legal-page-layout";
import { privacySections, LAST_UPDATED } from "@/components/auth/login-policies";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="隐私政策"
      lastUpdated={LAST_UPDATED}
      sections={privacySections}
      description={
        <p className="text-muted-foreground text-sm leading-relaxed">
          感谢您使用 LINUX DO Credit。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
        </p>
      }
    />
  );
}
