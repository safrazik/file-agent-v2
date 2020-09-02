const path = require('path');
const toc = require('remark-toc');
const slug = require('remark-slug');

const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [slug, toc],
    rehypePlugins: [],
  },
});
module.exports = withMDX({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    config.module.rules.push({
      test: /\.html$/i,
      loader: 'html-loader',
      options: {
        minimize: {
          removeComments: true,
          collapseWhitespace: true,
        },
      },
    });
    if (dev) {
      // config.resolve.alias['@file-agent/core'] = path.resolve(__dirname, '../core/src');
      // config.resolve.alias['@file-agent/react'] = path.resolve(__dirname, '../react/src');
      // config.resolve.alias['@file-agent/core/dist/file-agent.min.js$'] = '@file-agent/core/dist/file-agent.js';
      // config.resolve.alias['@file-agent/react/dist/react-file-agent.min.js$'] =
      //   '@file-agent/react/dist/react-file-agent.js';
      // config.resolve.alias['@file-agent/uploader/dist/file-agent-uploader.min.js$'] =
      //   '@file-agent/uploader/dist/file-agent-uploader.js';
      //
      // config.module.rules.push({
      //   test: /\.(ts|tsx)$/,
      //   include: [path.join(__dirname, '../core/src')],
      //   use: [
      //     {
      //       loader: 'next-babel-loader',
      //       options: {
      //         // asyncToPromises: false,
      //         cwd: path.join(__dirname, '../core/src'),
      //         // isServer: false,
      //       },
      //     },
      //   ],
      // });
    }

    // Important: return the modified config
    return config;
  },
});

// next.config.js
// const withMDX = require('@next/mdx')({
//   extension: /\.mdx?$/,
// })
// module.exports = withMDX({
//   pageExtensions: ['js', 'jsx', 'mdx'],
// })
