class APIGateway {
    baseUrl = "/api/";

    static getBaseAPIUrl() {
        const { hostname, protocol } = window.location;
        let port = 80;    

        if(process && process.env && process.env.NODE_ENV && process.env.NODE_ENV === "development") {
            port = 4000;
        }

        return `${protocol}//${hostname}:${port}`;
    }
    
    getAllProjects() {
        return fetch(this.baseUrl)
            .then(res => res.json());
    }

    deleteProject(id) {
        return fetch(this.baseUrl + id, {
            method: "delete"
        });
    }

    updateProject(project) {
        return fetch(`${this.baseUrl}${project._id}`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
    }

    insertNewProject(project) {
        return fetch(this.baseUrl, {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
    }
}

export const ApiGateway = APIGateway;
export default new APIGateway();