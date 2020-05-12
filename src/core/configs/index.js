import { DevelopmentConfig } from "../configs/dev";
import { ProductionConfig } from "../configs/production";
import { TestConfig } from "../configs/test";

const env = process.env.NODE_ENV || "development";
let config = new DevelopmentConfig();
if (env === "test") {
    config = new TestConfig()
} else if (env === "production") {
    config = new ProductionConfig()
}

export default config;
