import { EdgeRenderer } from "edge.js/build/src/edge/renderer";
import { Request } from "express";
import { NestMvcFlash } from "./nest-mvc-flash";

export type NestMvcReq = Request & {
  view: EdgeRenderer;
  flash: NestMvcFlash;
};
