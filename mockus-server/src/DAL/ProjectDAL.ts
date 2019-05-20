import path from 'path';
import Datastore from 'nedb';
import ProjectModel from './Models/ProjectModel';

class ProjectDAL {
    db: Nedb;
    
    constructor() {
        this.db = new Datastore({
            filename: path.join(process.cwd(), 'DB', 'mockus.db'),
            autoload: true
        });
    }

    getAllProjects() : Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err: any, docs: any) => resolve(docs));
        });
    }

    deleteProject(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id : id }, {}, () => {
                this.getAllProjects()
                    .then(res => resolve(res))
            });
        });
    }

    updateProject(project: ProjectModel): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.update({ _id : project._id }, project, {}, () => {
                this.getAllProjects()
                    .then(res => resolve(res))
            });
        });
    }

    insertNewProject(project: ProjectModel): Promise<any> {
        delete project._id;
        return new Promise((resolve, reject) => {
            this.db.insert(project, () => {
                this.getAllProjects()
                    .then(res => resolve(res))
            });
        });
    }
}

export default new ProjectDAL();