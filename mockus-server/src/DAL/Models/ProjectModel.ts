import HTTPMethods from "../Enums/HTTPMethods";
import ResponseObjectType from "../Enums/ResponseObjectType";
import HeaderModel from "./HeaderModel";

export default class ProjectModel {
    _id: string = "";
    path : string = "";
    method : HTTPMethods = HTTPMethods.GET;
    responseObjectType : ResponseObjectType = ResponseObjectType.JSON;
    responseCode : number = 200;
    delay : number = 0;
    responseBody: object | string = "";
    headers : Array<HeaderModel> = [];
}