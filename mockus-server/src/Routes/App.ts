import express, { Router } from 'express';
import path from 'path';
import ProjectDAL from '../DAL/ProjectDAL';

const router = express.Router();

router.get("/", (req, res) => {
    ProjectDAL.getAllProjects()
        .then(data => res.json(data));
});

router.delete("/:id", (req, res) => {
    ProjectDAL.deleteProject(req.params.id)
        .then(data => res.json(data));
});

router.post("/", (req, res) => {
    ProjectDAL.insertNewProject(req.body)
        .then(data => res.json(data));
});

router.post("/:id", (req, res) => {
    ProjectDAL.updateProject(req.body)
        .then(data => res.json(data));
});

router.get("/export", (req, res) => {
    const filePath = path.join(process.cwd(), 'DB', 'mockus.db');
    res.download(filePath, 'mockus.db');
});

export default router;