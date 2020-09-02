import Layout from '../src/Layout';
import FooterLinks from '../src/FooterLinks';
import EditPageLink from '../src/EditPageLink';
import GettingStartedDocs from '../docs-content/getting-started.mdx';

export default function GettingStarted() {
  return (
    <Layout>
      <GettingStartedDocs />
      <EditPageLink path="getting-started.mdx" />
      <FooterLinks
        step={1}
        prev={{ link: '/', label: 'Home' }}
        next={{ link: '/advanced-usage', label: 'Advanced Usage' }}
      />
    </Layout>
  );
}
