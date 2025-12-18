import { LegalPageLayout } from "@/components/auth/legal-page-layout";
import { termsSections, LAST_UPDATED } from "@/components/auth/login-policies";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      title="服务条款"
      lastUpdated={LAST_UPDATED}
      sections={termsSections}
      description={
        <p className="text-muted-foreground text-sm leading-relaxed">
          欢迎使用 LINUX DO Credit。请仔细阅读以下条款，它们规定了您对我们服务的访问和使用。通过使用我们的服务，即表示您同意受这些条款的约束。如果您不同意这些条款，请立即停止使用此平台。
        </p>
      }
    />
  );
}
