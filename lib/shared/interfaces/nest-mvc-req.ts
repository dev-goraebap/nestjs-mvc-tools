import { EdgeRenderer } from "edge.js/build/src/edge/renderer";
import { Request } from "express";
import { NestMvcFlash } from "../flash";

export type NestMvcView = EdgeRenderer;

export interface NestMvcReq extends Request {
  view: NestMvcView;
  flash: NestMvcFlash;
}
