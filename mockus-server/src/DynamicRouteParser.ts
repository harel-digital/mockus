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

    findRouteObject(url, method, documents) {
        return documents.find((doc:ProjectModel) => {
            let documentMethod = StringUtils.cleanAndLower(doc.method);
            let documentPath = StringUtils.cleanAndLower(doc.path);

            method = StringUtils.cleanAndLower(method);
            url = StringUtils.cleanAndLower(url);

            if(method !== documentMethod) return;

            if(documentPath.includes(":")) {
                const savedRouteParts = documentPath.split("/");
                const currentRouteParts = url.split("/");
                let builtRouteFromTemplatedUrl = '';
                savedRouteParts.forEach((part, i) => {
                    if(!part.length) return;
                    builtRouteFromTemplatedUrl += `/${part.includes(":") ? currentRouteParts[i] : part}`;
                });

                return builtRouteFromTemplatedUrl === url;
            }
            
            return url === documentPath;
        });
    }

    parseAndServeRoute() {
        const { url, method } = this.request;

        ProjectDAL.getAllProjects()
            .then((docs) => {
                if(!docs.length) {
                    this.response.status(500).json({
                        message: 'No projects exists'
                    });
                    return;
                }

                let foundDoc = this.findRouteObject(url, method, docs);

                if(foundDoc) {
                    const responseBody = JSON.parse(foundDoc.responseBody);

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
                    this.response.status(500).json({message: "bad request"});
                    return;
                }
            });
    }


}