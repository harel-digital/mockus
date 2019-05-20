import ProjectModel from "./DAL/Models/ProjectModel";
import ProjectDAL from "./DAL/ProjectDAL";
import ResponseObjectType from "./DAL/Enums/ResponseObjectType";
import StringUtils from "./Utils/StringUtils";

export default class DynamicRouteParser {
    request: any = {};
    response: any = {};
    projects: Array<ProjectModel> = [];

    constructor(req: any, res: any) {
        this.request = req;
        this.response = res;

        this.parseAndServeRoute();
    }

    parseAndServeRoute() {
        const { url, method } = this.request;

        ProjectDAL.getAllProjects()
            .then((docs) => {
                if(!docs.length) {
                    this.response.send("NO PROJECTS EXIST");
                    return;
                }

                let foundDoc = docs.find((doc:ProjectModel) =>
                    StringUtils.cleanAndLower(doc.method) ===  StringUtils.cleanAndLower(method)
                    && StringUtils.cleanAndLower(url).startsWith(StringUtils.cleanAndLower(doc.path)));

                if(foundDoc) {
                    const responseBody = JSON.parse( foundDoc.responseBody);

                    const response = this.response;
                    let responseAction = "send";

                    switch(foundDoc.responseObjectType) {
                        case ResponseObjectType.JSON:
                            responseAction = "json";
                            break;
                        
                        case ResponseObjectType.CUSTOM:
                        case ResponseObjectType.TEXT:
                            responseAction = "send";
                            break;

                        case ResponseObjectType.XML:
                            responseAction = "xml";
                            break;
                    }

                    foundDoc.headers.forEach((headerObj) => {
                        const { key, value } = headerObj;
                        if(key && StringUtils.clean(key) && StringUtils.clean(value)) {
                            response.header(key, value);
                        }
                    });

                    setTimeout((() => response.status(foundDoc.responseCode)[responseAction](responseBody)), foundDoc.delay);
                    return;
                } else {
                    this.response.status(500).json({status: "bad request"});
                    return;
                }
            });
    }
}