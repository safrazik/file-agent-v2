const githubUrl = 'https://github.com/safrazik/file-agent';
const basePath = '/file-agent-v2';
const baseUrl = 'https://safrazik.com/file-agent';
export default {
  basePath,
  path(part?: string) {
    return basePath + (part === undefined ? '' : part);
  },
  url(part?: string) {
    return baseUrl + (part === undefined ? '' : part);
  },
  pageTitle: 'File Agent',
  description:
    'High performant file upload component with elegant and distinguishable previews for every file type and support for drag and drop, validations, default uploader with progress support and externally customizable via props and methods',
  baseUrl,
  githubUrl,
  //   githubBasePath: githubUrl + '/packages/docs',
  githubEditBaseUrl: githubUrl + '/edit/master/packages/docs/docs-content',
  apiUrl: 'https://safrazik.github.io/file-agent/api',
};
