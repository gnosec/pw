const packageConfig: any = require('../package.json');

export interface ApplicationInfo {
  readonly name: string;
  readonly version: string;
}

export const applicationInfo: ApplicationInfo = <ApplicationInfo>packageConfig;