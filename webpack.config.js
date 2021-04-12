const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const StylelintBarePlugin = require('stylelint-bare-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminPngquant = require('imagemin-pngquant');
const imageminOptipng = require('imagemin-optipng');
const imageminZopfli = require('imagemin-zopfli');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const settings = require('./webpack.settings');

const {
  basePath,
  devServerContentBase,
  devServerOpenBrowser,
  isDev,
  isStatic,
  paths,
  dist,
  filenames,
  bladeOptions,
  pages,
  useFontsDirectory,
  useVideosDirectory,
  isShopify,
  openAnalyzer,
} = settings;

const jsFilename = isShopify ? `${dist.js}[name].js` : `${dist.js}[name].[contenthash].js`;
const cssFilename = isShopify
  ? `${dist.css}[name].css.liquid`
  : `${dist.css}[name].[contenthash].css`;
const spriteFilename = isShopify ? 'snippets/svg-sprite.liquid' : `${dist.svgSprite}icons.svg`;

const copy = [
  {
    from: `./${paths.images}`,
    to: isDev
      ? `${dist.images}${filenames.devPathIncluded}`
      : `${dist.images}${filenames.prodPathIncluded}`,
    globOptions: {
      ignore: filenames.ignore,
    },
  },
  {
    from: `./${paths.manifest}`,
    to: `${dist.manifest}${filenames.dev}`,
    globOptions: {
      ignore: filenames.ignore,
    },
  },
];

if (useFontsDirectory) {
  copy.push({
    from: `./${paths.fonts}`,
    to: isDev
      ? `${dist.fonts}${filenames.devPathIncluded}`
      : `${dist.fonts}${filenames.prodPathIncluded}`,
    globOptions: {
      ignore: filenames.ignore,
    },
  });
}

if (useVideosDirectory) {
  copy.push({
    from: `./${paths.videos}`,
    to: isDev
      ? `${dist.videos}${filenames.devPathIncluded}`
      : `${dist.videos}${filenames.prodPathIncluded}`,
    globOptions: {
      ignore: filenames.ignore,
    },
  });
}

let devtool = isDev ? 'source-map' : 'nosources-source-map';
if (isShopify) {
  devtool = isDev ? 'inline-source-map' : 'inline-nosources-source-map';
}

module.exports = {
  devtool,
  entry: {
    app: [`./${paths.js}app.js`],
    'browser-support': [`./${paths.js}components/browserSupport/browserSupport.js`],
    style: [`./${paths.sass}style.scss`],
    sprite: glob.sync(`./${paths.svgSprite}*.svg`),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: {
          test: path.resolve(__dirname, 'node_modules'),
          exclude: [
            path.resolve(__dirname, 'node_modules/hyperform'),
            path.resolve(__dirname, 'node_modules/swiper'),
            path.resolve(__dirname, 'node_modules/dom7'),
          ],
        },
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: 3,
                shippedProposals: true,
              },
            ],
          ],
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              url: !isDev,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|svg|gif|webp|ico)$/,
        exclude: [path.resolve(__dirname, paths.svgSprite)],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDev ? `${dist.images}${filenames.dev}` : `${dist.images}${filenames.prod}`,
            },
          },
        ],
      },
      {
        test: /\.*\.svg$/,
        include: [path.resolve(__dirname, paths.svgSprite)],
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              spriteFilename,
              symbolId: filePath => `icon-${path.basename(filePath, '.svg')}`,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDev ? `${dist.fonts}${filenames.dev}` : `${dist.fonts}${filenames.prod}`,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: isDev ? `${dist.videos}${filenames.dev}` : `${dist.videos}${filenames.prod}`,
            },
          },
        ],
      },
    ],
  },
  output: {
    path: path.join(basePath, dist.root),
    filename: jsFilename,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
    namedChunks: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    new StylelintBarePlugin({
      files: `./${paths.sass}**/*.s?(a|c)ss`,
    }),
    new FixStyleOnlyEntriesPlugin({
      extensions: ['less', 'scss', 'sass', 'css', 'svg'],
    }),
    new MiniCssExtractPlugin({
      filename: cssFilename,
    }),
    new CopyWebpackPlugin({
      patterns: copy,
    }),
    new ImageminPlugin({
      disable: isDev,
      test: /\.(jpe?g|png|gif|svg)$/i,
      cacheFolder: paths.cache,
      plugins: [
        imageminPngquant({
          strip: true,
        }),
        imageminOptipng({
          optimizationLevel: 3,
        }),
        imageminZopfli(),
        imageminJpegRecompress({
          accurate: true,
          quality: 'low',
          min: 45,
          max: 85,
          strip: true,
        }),
        imageminMozjpeg({
          progressive: true,
          quality: 80,
        }),
        imageminGifsicle({
          interlaced: true,
          optimizationLevel: 3,
        }),
        imageminSvgo({
          removeViewBox: false,
        }),
      ],
    }),
    new ImageminWebpWebpackPlugin(),
    new ManifestPlugin({
      fileName: `${dist.revManifest}rev-manifest.json`,
      map: file => ({ ...file, name: file.name.replace(/(\.[a-f0-9]{8})(\..*)$/, '$2') }),
    }),
    new SpriteLoaderPlugin({
      plainSprite: true,
    }),
    new WebpackNotifierPlugin({
      title: process.env.npm_package_description,
      contentImage: path.join(basePath, 'notification.png'),
      excludeWarnings: true,
    }),
  ],
  devServer: {
    port: 3000,
    contentBase: devServerContentBase,
    open: devServerOpenBrowser,
    watchContentBase: true,
    stats: {
      children: false, // Suppress "Entrypoint undefined" warnings
    },
  },
  stats: {
    children: false, // Suppress "Entrypoint undefined" warnings
  },
};

if (isStatic) {
  module.exports.module.rules.push({
    test: /\.blade\.php$/,
    use: [
      {
        loader: 'html-srcsets-loader',
        options: {
          attrs: ['audio:src', 'img:src', 'img:srcset', 'video:src', 'source:src', 'source:srcset'],
          interpolate: true,
        },
      },
      {
        loader: 'webpack-blade-native-loader',
        options: bladeOptions,
      },
    ],
  });

  module.exports.plugins.push(...pages);

  // Static webp extension fix
  module.exports.plugins.push({
    apply: compiler => {
      compiler.hooks.compilation.tap('ReplaceWebpExtensionPlugin', compilation => {
        HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
          'ReplaceWebpExtensionPlugin',
          (data, cb) => {
            // eslint-disable-next-line no-param-reassign
            data.html = data.html.replace(
              /.(png|jpg)" type="image\/webp"/,
              '.webp" type="image/webp"',
            );
            cb(null, data);
          },
        );
      });
    },
  });
}

if (!isShopify) {
  if (isDev) {
    module.exports.plugins.push(
      new CleanWebpackPlugin([path.join(dist.root, dist.css), path.join(dist.root, dist.js)]),
    );
  } else {
    module.exports.plugins.push(
      new CleanWebpackPlugin([path.join(dist.root, dist.assets)]),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer,
        reportFilename: 'bundle-analyzer-report.html',
      }),
    );
  }
}
