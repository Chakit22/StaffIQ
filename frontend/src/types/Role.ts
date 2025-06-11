import { Application } from "./Application";

export interface Role {
  id: string;
  name: string;
  applications: Application[];
}
