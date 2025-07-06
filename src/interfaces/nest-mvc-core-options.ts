export interface NestMvcCoreOptions {
  edgeTemplate: {
    rootDir: string;
    disks: string[];
    cache: boolean;
  };
  vite: {
    mode: "development" | "production";
    buildOutDir: string;
    developServerUrl: string;
  };
  debug: boolean;
}
export const NEST_MVC_CORE_OPTIONS = "NEST_MVC_CORE_OPTIONS";

export interface NestMvcCoreOptionsFactory {
  create(): Promise<Partial<NestMvcCoreOptions>> | Partial<NestMvcCoreOptions>;
}
