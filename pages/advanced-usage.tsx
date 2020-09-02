import Layout from '../src/Layout';
import FooterLinks from '../src/FooterLinks';
import EditPageLink from '../src/EditPageLink';
import AdvancedUsageDocs from '../docs-content/advanced-usage.mdx';

export default function AdvancedUsage() {
  return (
    <Layout>
      <AdvancedUsageDocs />
      <EditPageLink path="advanced-usage.mdx" />
      <FooterLinks step={2} prev={{ link: '/getting-started', label: 'Getting Started' }} />
    </Layout>
  );
}
