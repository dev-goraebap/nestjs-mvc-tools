import { EdgeRenderer } from "edge.js/build/src/edge/renderer";
import { Request } from "express";
import { NestMvcFlash } from "./nest-mvc-flash";

/** Extended Express Request with view renderer and flash message functionality */
export type NestMvcReq = Request & {
  /** Edge.js template renderer instance */
  view: EdgeRenderer;
  /** Flash message handler for storing temporary messages */
  flash: NestMvcFlash;
};
