import { EdgeView } from "../../services/edge.view";

declare global {
  namespace Express {
    export interface Request {
      view: EdgeView;
    }
  }
}
