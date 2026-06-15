import { useState, useEffect, useCallback } from "react";
import {
  fetchProjects,
  addProject as addProjectToFirebase,
} from "../utils/projectsStorage";

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects. Check your Firebase configuration.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addProject = useCallback(
    async (project) => {
      const newProject = await addProjectToFirebase(project);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    },
    []
  );

  return { projects, loading, error, addProject, refresh };
};
