import { Step } from './step-type';

export class SeleniumServiceResponse {
    status: string
    proccessedSteps: Step[]
    message?:String
}