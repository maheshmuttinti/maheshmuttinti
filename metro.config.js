// /**
//  * Metro configuration for React Native
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// const path = require('path');
// const {readdirSync} = require('fs');
// const projectRoot = __dirname;
// const workspaceRoot = path.resolve(__dirname, '../..');
// const rootPackage = require('./package.json');
// const workspacePackage = require('../../package.json');

// function findSharedPackages(workspaceRoot, sharedPackagesFolder) {
//   const sharedPackageRoots = sharedPackagesFolder.map(packageFolder =>
//     path.resolve(workspaceRoot, packageFolder),
//   );

//   return sharedPackageRoots
//     .map(sharedPackageRoot =>
//       readdirSync(sharedPackageRoot, {
//         withFileTypes: true,
//       })
//         .filter(dir => dir.isDirectory() && !dir.name.startsWith('.'))
//         .map(dir => dir.name)
//         .map(packageFolder => {
//           const packagePath = path.resolve(sharedPackageRoot, packageFolder);

//           const packageName = require(`${packagePath}/package.json`).name;

//           return {packageName, packagePath};
//         }),
//     )
//     .flat();
// }

// const monoRepoFolders = workspacePackage.workspaces.packages.map(pkg =>
//   pkg.substring(0, pkg.search(RegExp('\\/\\*'))),
// );

// const dependencies = {
//   ...rootPackage.dependencies,
//   ...rootPackage.devDependencies,
// };

// const usedDeps = Object.keys(dependencies).filter(
//   dep => dependencies[dep] === '*',
// );

// const allRepoPackages = findSharedPackages(
//   path.resolve(workspaceRoot),
//   monoRepoFolders,
// );

// const watchFolders = allRepoPackages
//   .filter(pkg => Boolean(usedDeps.find(dep => pkg.packageName === dep)))
//   .map(pkg => pkg.packagePath);

// const unusedRepoPackages = allRepoPackages
//   .filter(pkg => pkg.packageName !== rootPackage.name)
//   .filter(pkg => !usedDeps.find(dep => pkg.packageName === dep))
//   .map(
//     ({packagePath}) =>
//       new RegExp(`^${escape(path.resolve(packagePath))}\\/.*$`),
//   );
// const usedRepoPackages = allRepoPackages
//   .filter(pkg => pkg.packageName !== rootPackage.name)
//   .filter(pkg => usedDeps.find(dep => pkg.packageName === dep))
//   .map(
//     ({packagePath}) =>
//       new RegExp(`^${escape(path.resolve(packagePath, 'node_modules'))}\\/.*$`),
//   );

// const config = {
//   resolver: {},
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };

// config.watchFolders = [
//   path.resolve(__dirname, '../../node_modules'),
//   ...watchFolders,
// ];

// config.resolver.nodeModulesPath = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ];

// config.resolver.blockList = [...unusedRepoPackages, ...usedRepoPackages];

// console.log('config.resolver.blockList', config.resolver.blockList);
// console.log('watchFolders', config.watchFolders);

// config.resolver.extraNodeModules = {
//   'react-native': path.resolve(__dirname, 'node_modules/react-native'),
//   react: path.resolve(__dirname, 'node_modules/react'),
//   // '@react-navigation/native': path.resolve(
//   //   __dirname,
//   //   '../../node_modules/@react-navigation/native',
//   // ),

//   // '@react-navigation/native-stack': path.resolve(
//   //   __dirname,
//   //   '../../node_modules/@react-navigation/native-stack',
//   // ),
// };

// module.exports = config;

const exclusionList = require('metro-config/src/defaults/exclusionList');
const {
  getMetroTools,
  getMetroAndroidAssetsResolutionFix,
} = require('react-native-monorepo-tools');

const monorepoMetroTools = getMetroTools();

const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix();

console.log('monorepoMetroTools.watchFolders', monorepoMetroTools.watchFolders);

module.exports = {
  transformer: {
    // Apply the Android assets resolution fix to the public path...
    publicPath: androidAssetsResolutionFix.publicPath,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  server: {
    // ...and to the server middleware.
    enhanceMiddleware: middleware => {
      return androidAssetsResolutionFix.applyMiddleware(middleware);
    },
  },
  // Add additional Yarn workspace package roots to the module map.
  // This allows importing importing from all the project's packages.
  watchFolders: monorepoMetroTools.watchFolders,
  resolver: {
    // Ensure we resolve nohoist libraries from this directory.
    blockList: exclusionList(monorepoMetroTools.blockList),
    extraNodeModules: monorepoMetroTools.extraNodeModules,
  },
};
