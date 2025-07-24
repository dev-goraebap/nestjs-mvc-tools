import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";

import { NestMvcOptionsService } from "./nest-mvc-options.service";
import { ViteAssetsPipelineOptions } from "./nest-mvc.options";

@Injectable()
export class ViteAssetPathHelperFactory {
  private readonly options: ViteAssetsPipelineOptions;

  constructor(private readonly optionsService: NestMvcOptionsService) {
    this.options = this.optionsService.assetOptions;
  }

  create(): (path: string) => string {
    let manifest: Record<string, any> | null = null;

    const options = this.options;

    return function viteAssetPath(path: string): string {
      // 개발 환경에서는 Vite 개발 서버 URL을 반환
      if (options.mode === "development") {
        return `${options.devServerUrl}/${path}`;
      }

      // 프로덕션 환경에서는 매니페스트 파일을 통해 해시된 에셋 경로를 반환
      if (!manifest) {
        try {
          const manifestPath = `${options.buildOutDir}/.vite/manifest.json`;
          const manifestContent = readFileSync(manifestPath, "utf-8");
          manifest = JSON.parse(manifestContent);
        } catch (error) {
          console.error(
            `Error reading manifest file at ${options.buildOutDir}/manifest.json:`,
            error
          );
          return "";
        }
      }

      const manifestEntry = manifest![path];

      if (!manifestEntry) {
        console.warn(`Asset not found in manifest: ${path}`);
        return "";
      }

      return `${options.staticAssetPrefix}/builds/${manifestEntry.file}`;
    };
  }
}
