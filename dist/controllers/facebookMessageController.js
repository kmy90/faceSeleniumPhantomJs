"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seleniumService_1 = require("../shared/seleniumService");
class FacebookMessageController {
    constructor() { }
    sendAutomatedMessage(request, response) {
        let selService = new seleniumService_1.SeleniumService('phantomjs');
        //get Url
        selService.getUrl(request.body.endpoint).then(() => {
            let steps = request.body.steps;
            FacebookMessageController.processSteps(steps.reverse(), selService).then(() => {
                response.status(201).send('Done');
                //getting errors processing step       
            }, (err) => { response.status(500).send(err); console.log('getting errors processing step'); });
            //getting errors processing url
        }, (err) => { response.status(500).send(err); console.log('getting errors processing url'); });
    }
    static processSteps(steps, selService) {
        return new Promise((resolve, reject) => {
            let step = steps.pop();
            selService.setStep(step).then(() => {
                if (steps.length == 0) {
                    resolve();
                }
                else {
                    this.processSteps(steps, selService).then(resolve, reject);
                }
            }, (err) => { reject(err); });
        });
    }
}
exports.FacebookMessageController = FacebookMessageController;
