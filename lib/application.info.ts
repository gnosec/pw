const packageConfig: any = require('../package.json');

export interface ApplicationInfo {
  readonly name: string;
  readonly version: string;
}

export const applicationInfo: ApplicationInfo = {
  name: Object.keys(packageConfig.bin)[0],
  version: packageConfig.version
}