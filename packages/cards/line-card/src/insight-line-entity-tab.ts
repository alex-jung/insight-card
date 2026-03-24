import { normaliseEntityConfig, type InsightEntityConfig } from "@insight-chart/core";

export class InsightEntityTab {
  index: number;
  config: InsightEntityConfig;

  constructor(index: number, config: InsightEntityConfig | string | undefined) {
    this.index = index;
    this.config = config !== undefined ? normaliseEntityConfig(config) : { entity: "" };
  }
}
