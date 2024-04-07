import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Logger } from "./logger";
import { LogFields } from "./log-data.interface";
import { EndpointsConfig } from "src/app/_config/endpoints.config";
import { StoreService } from "../state/store.service";
import { CommonConstants } from "../constants/common-constants.enum";
import { StoreType } from "../constants/store-type.enum";

@Injectable()
export class LogService {
  userId: string;
  logger: Logger;
  constructor(private store: StoreService) {
    this.userId = this.store.get(CommonConstants.CURRENT_USER, StoreType.LOCAL);
    this.initialize();
  }

  public initialize() {
    this.logger = new Logger(environment.appName, EndpointsConfig.logger.log);
  }

  public logHttpInfo(info: any, elapsedTime: number, requestPath: string) {
    // TODO: create and set correlation id
    const url = location.href;
    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath,
      elapsedTime,
      url,
    };

    this.logger.log("Information", `${info}`, logFields);
  }

  public error(errorMsg: string) {
    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath: "",
      elapsedTime: 0,
      url: location.href,
    };

    this.logger.log("Error", errorMsg, logFields);
  }

  public info(info: any) {
    const url = location.href;

    const logFields: LogFields = {
      environment: environment.env,
      userId: this.userId,
      requestPath: "",
      elapsedTime: 0,
      url,
    };

    this.logger.log("Information", info, logFields);
  }
}
