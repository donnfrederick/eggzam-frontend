import axios from 'axios';

interface TaskData {
    title: string,
    description: string
}

const apiClient = axios.create({
    baseURL: 'http://localhost:8001/api', // Your Laravel backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    getTasks(status: string) {
        return apiClient.get(`/tasks/${status}`);
    },
    saveTask(taskData: TaskData) {
        return apiClient.post('/tasks', taskData);
    },
    updateTask(taskData: TaskData) {
        return apiClient.put('/tasks', taskData);
    },
    deleteTask(deleteIds: string) {
        return apiClient.delete(`/tasks?deleteIds=${deleteIds}`);
    },
    updateStatus(taskId: number, status: string) {
        status = status.toLowerCase();
        return apiClient.put(`/tasks/${taskId}/update-status/${status}`)
    }
};