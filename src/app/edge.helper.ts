import { Request } from "express";
import { readFileSync } from "fs";

export class EdgeHelpers {
  static createIsActiveLinkHelper(req: Request) {
    return function isActiveLink(
      linkUrl: string,
      exactMatch: boolean = false
    ): boolean {
      const currentPath = req.path;

      if (exactMatch) {
        return currentPath === linkUrl;
      }

      if (linkUrl === "/") {
        return currentPath === "/";
      }

      return (
        currentPath.startsWith(linkUrl) &&
        (currentPath.length === linkUrl.length ||
          currentPath[linkUrl.length] === "/")
      );
    };
  }

  static createAssetHelper(options: {
    developServerUrl: string;
    buildOutDir: string;
  }) {
    let manifest: Record<string, any> | null = null;

    return function asset(path: string): string {
      // 개발 환경에서는 Vite 개발 서버 URL을 반환
      if (process.env.NODE_ENV === "development") {
        return `${options.developServerUrl}/${path}`;
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

      return `/builds/${manifestEntry.file}`;
    };
  }
}
