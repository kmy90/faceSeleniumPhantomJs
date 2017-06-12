"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_service_1 = require("../services/selenium-service");
const models_1 = require("../models");
class FacebookMessageController {
    constructor() { }
    sendAutomatedMessage(request, response) {
        let selService = new selenium_service_1.default();
        let proccessedSteps = [];
        //get Url
        selService.getUrl(request.body.endpoint_x).then(() => {
            var steps = request.body.steps_x;
            FacebookMessageController.processSteps(steps.reverse(), selService, proccessedSteps).then((processedSteps) => {
                response.status(200).send(FacebookMessageController.buildSeleniumServiceResponse("Success", proccessedSteps, null));
                //getting errors processing step       
            }, (err) => { response.status(500).send(FacebookMessageController.buildSeleniumServiceResponse("Fail", proccessedSteps, err)); });
            //getting errors processing url
        }, (err) => { response.status(500).send(FacebookMessageController.buildSeleniumServiceResponse("Fail", proccessedSteps, err)); });
    }
    static processSteps(steps, selService, processedSteps) {
        return new Promise((resolve, reject) => {
            let step = steps.pop();
            selService.setStep(step).then(() => {
                processedSteps.push(step);
                if (steps.length == 0) {
                    resolve(processedSteps);
                }
                else {
                    this.processSteps(steps, selService, processedSteps).then(resolve, reject);
                }
            }, (err) => { reject(err); });
        });
    }
    static buildSeleniumServiceResponse(status, processedSteps, failReason) {
        let response = new models_1.SeleniumServiceResponse();
        response.status_x = status;
        response.steps_x = processedSteps;
        if (failReason)
            response.message_x = failReason;
        return response;
    }
}
exports.FacebookMessageController = FacebookMessageController;
exports.default = FacebookMessageController;
