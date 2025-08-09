export const getVersion = () => {
    const packageJson = require('../package.json')
    return packageJson.version;
}