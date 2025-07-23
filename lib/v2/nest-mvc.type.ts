import { EdgeRenderer } from "edge.js/build/src/edge/renderer";
import { Request } from "express";

export type NestMvcReq = Request & {
  view: EdgeRenderer;
};
