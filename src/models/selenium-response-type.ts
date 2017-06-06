import { Step } from './step-type';

export class SeleniumServiceResponse {
    status: string
    steps: Step[]
    message?:String
}