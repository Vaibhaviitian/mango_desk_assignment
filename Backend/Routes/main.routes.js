import { Router } from "express";
import {getAiResponse,sendEmail} from "../Controller/airesponse.controller.js";
const  mainrouter = Router();

mainrouter.route('/apiresponse').post(getAiResponse);
mainrouter.route('/sendmail').post(sendEmail);

export default mainrouter;