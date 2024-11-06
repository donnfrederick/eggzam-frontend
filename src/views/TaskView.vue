<script setup lang="ts">
import { Modal } from 'bootstrap';
import { ref, onMounted } from 'vue';
import api from '../api/task';

// Interface to define the structure of a task object.
interface TaskData {
    id: number,
    title: string,
    description: string,
    status: string,
    created_at: Date
}

// State variables to manage loading, task list, modals, etc.
const loading: any = ref(true);
const taskList = ref<TaskData[]>([]);  // List of tasks to display
const newTaskData: any = ref({});  // Data for a new task
const editTaskdata: any = ref({});  // Data for editing a task
const deleteTaskId: any = ref(0);  // ID for a single task to delete
const deleteMultipleTaskId: any = ref([]);  // Array of IDs for multiple tasks to delete

// Modal references and instances for managing task modals (Add, Edit, Delete)
const addTaskModalRef = ref<HTMLElement | null>(null);
let addTaskModalInstance: Modal | null = null;

const editTaskModalRef = ref<HTMLElement | null>(null);
let editTaskModalInstance: Modal | null = null;

const deleteTaskModalRef = ref<HTMLElement | null>(null);
let deleteTaskModalInstance: Modal | null = null;

const deleteMultipleTaskModalRef = ref<HTMLElement | null>(null);
let deleteMultipleTaskModalInstance: Modal | null = null;

// Toast message reference to show success messages
const toastMessage: any = ref(null);

// Fetch tasks based on status
const fetchTasks = async (status: string) => {
    try {
        // Calls API to fetch tasks based on their status
        const { data } = await api.getTasks(status);
        taskList.value = data?.result;  // Updates the task list with the fetched data
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    }
}

// Lifecycle hook to run the fetch and modal setup on component mount
onMounted(async () => {
    await fetchTasks('all');  // Fetch all tasks initially

    // Initialize new and edit task modal data
    newTaskData.value = { title: '', description: '' };

    // Initialize modals using Bootstrap's Modal class
    if (addTaskModalRef.value) {
        addTaskModalInstance = new Modal(addTaskModalRef.value, {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
    }

    if (editTaskModalRef.value) {
        editTaskModalInstance = new Modal(editTaskModalRef.value, {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
    }

    if (deleteTaskModalRef.value) {
        deleteTaskModalInstance = new Modal(deleteTaskModalRef.value, {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
    }

    if (deleteMultipleTaskModalRef.value) {
        deleteMultipleTaskModalInstance = new Modal(deleteMultipleTaskModalRef.value, {
            backdrop: 'static',
            keyboard: false,
            focus: true
        });
    }

    loading.value = false;  // Hide loading spinner after data is loaded
});

// Function to search tasks by their status
const searchByStatus = async (event: Event) => {
    loading.value = true;  // Show loading spinner while fetching data
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    await fetchTasks(selectedValue.toLowerCase());  // Fetch tasks by selected status
    loading.value = false;  // Hide loading spinner after data is loaded
}

// Function to open the "Add Task" modal
const openAddTaskModal = () => {
    if (addTaskModalInstance) {
        addTaskModalInstance.show();  // Show the modal if it's initialized
    }
};

// Function to open the "Edit Task" modal with task data
const openEditTaskModal = (task: TaskData) => {
    editTaskdata.value = task;  // Set task data for editing
    if (editTaskModalInstance) {
        editTaskModalInstance.show();  // Show the modal if it's initialized
    }
};

// Function to open the "Delete Task" modal with the task ID
const openDeleteTaskModal = (deleteId: number) => {
    deleteTaskId.value = deleteId;  // Set task ID to be deleted
    if (deleteTaskModalInstance) {
        deleteTaskModalInstance.show();  // Show the modal if it's initialized
    }
}

// Function to open the "Delete Multiple Tasks" modal
const openDeleteMultipleTaskModal = () => {
    if (deleteMultipleTaskModalInstance) {
        deleteMultipleTaskModalInstance.show();  // Show the modal if it's initialized
    }
}

// Function to update the status of a task
const updateStatus = async (task: TaskData, event: Event) => {
    loading.value = true;  // Show loading spinner while updating task status
    const selectedValue = (event.target as HTMLSelectElement).value;

    try {
        // Calls API to update the task status
        await api.updateStatus(task.id, selectedValue);
        task.status = selectedValue;
        toastMessage.value = "Status have been updated";  // Show success toast message

        setTimeout(() => {
            toastMessage.value = null;  // Hide the toast message after 5 seconds
        }, 5000);
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    } finally {
        loading.value = false;  // Hide loading spinner
    }
}

// Function to handle adding a new task
const addTaskHandler = async () => {
    addTaskModalInstance?.hide();  // Hide the modal after adding the task
    loading.value = true;  // Show loading spinner while adding task
    try {
        // Calls API to save the new task
        const { data } = await api.saveTask(newTaskData.value);
        toastMessage.value = "Added one (1) row to Task";  // Show success toast message

        newTaskData.value = { title: '', description: '' }; // Clear newTaskData

        taskList.value.push(data.result);  // Add the new task to the list

        setTimeout(() => {
            toastMessage.value = null;  // Hide the toast message after 5 seconds
        }, 5000);
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    } finally {
        loading.value = false;  // Hide loading spinner
    }
}

// Function to handle editing a task
const editTaskHandler = async () => {
    editTaskModalInstance?.hide();  // Hide the modal after editing the task
    loading.value = true;  // Show loading spinner while updating task
    try {
        // Calls API to update the task with new data
        await api.updateTask(editTaskdata.value);
        toastMessage.value = "Task have been updated";  // Show success toast message

        setTimeout(() => {
            toastMessage.value = null;  // Hide the toast message after 5 seconds
        }, 5000);
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    } finally {
        loading.value = false;  // Hide loading spinner
    }
}

// Function to handle deleting a single task
const deleteTaskHandler = async () => {
    deleteTaskModalInstance?.hide();  // Hide the modal after deleting the task
    loading.value = true;  // Show loading spinner while deleting task
    try {
        const deleteId = [deleteTaskId.value];
        await api.deleteTask(JSON.stringify(deleteId));  // Calls API to delete task
        toastMessage.value = "Task(s) have been deleted";  // Show success toast message

        setTimeout(() => {
            toastMessage.value = null;  // Hide the toast message after 5 seconds
        }, 5000);
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    } finally {
        loading.value = false;  // Hide loading spinner
        window.location.reload();  // Reload the page after deleting the task
    }
}

// Function to handle deleting multiple tasks
const deleteMultipleIdsHandler = async () => {
    deleteMultipleTaskModalInstance?.hide();  // Hide the modal after deleting tasks
    loading.value = true;  // Show loading spinner while deleting tasks
    try {
        await api.deleteTask(JSON.stringify(deleteMultipleTaskId.value));  // Calls API to delete multiple tasks

        deleteMultipleTaskId.value = [];  // Clear the selected task IDs

        toastMessage.value = "Task(s) have been deleted";  // Show success toast message

        setTimeout(() => {
            toastMessage.value = null;  // Hide the toast message after 5 seconds
        }, 5000);
    } catch (error) {
        console.log(error);  // Logs error if API request fails
    } finally {
        loading.value = false;  // Hide loading spinner
        window.location.reload();  // Reload the page after deleting tasks
    }
}
</script>


<template>
    <div v-if="loading" class="loader">
        <i class="fa fa-spinner fa-spin" style="font-size: 300%;"></i>
    </div>
    <div v-if="toastMessage != null" class="toast-success">
        <span><i class="fa fa-info-circle"></i> {{ toastMessage }}</span>
    </div>
    <div class="container-body">
        <div class="panels col-dm-12">
            <div class="d-flex align-items-center justify-content-between">
                <h5>Tasks</h5>
                <button class="btn btn-success" @click="openAddTaskModal"><i class="fa fa-plus-circle"></i> Add Task</button>
            </div>
            <div class="row">
                <div class="col-md-3 d-flex align-items-center">
                    <span>Filter by status: </span>
                    <select class="filter-by-status" @change="searchByStatus">
                        <option>All</option>
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>
                </div>
                <div v-if="deleteMultipleTaskId.length > 0" class="col-md-3">
                    <button class="btn btn-danger" @click="openDeleteMultipleTaskModal"><i class="fa fa-trash"></i> Delete {{ deleteMultipleTaskId.length }} selected row(s)</button>
                </div>
            </div>
            <table v-if="taskList.length > 0">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Date Created</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, key) in taskList" :key="key">
                        <td>
                            <input type="checkbox" style="cursor: pointer;" v-model="deleteMultipleTaskId" :value="task.id">
                        </td>
                        <td>{{ task.id }}</td>
                        <td>{{ task.title }}</td>
                        <td>{{ task.description }}</td>
                        <td>{{ task.created_at }}</td>
                        <td>
                            <select
                                class="status-select"
                                :value="task.status"
                                @change="(event) => {
                                    updateStatus(task, event);
                                }"
                            >
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                        </td>
                        <td>
                            <button class="btn btn-primary btn-icons" style="margin-right: 5px;" @click="openEditTaskModal(task)"><i class="fa fa-edit"></i></button>
                            <button class="btn btn-danger btn-icons" style="margin-left: 5px;" @click="openDeleteTaskModal(task.id)"><i class="fa fa-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <span v-if="taskList.length > 0" style="margin-top: 1rem;display: block;">Showing {{ taskList.length }} of {{ taskList.length }} result(s)</span>
            <span v-else class="text-danger"><i class="fa fa-times"></i> No result found</span>
        </div>
    </div>

    <div ref="addTaskModalRef" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-plus-circle"></i> Add Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="form-control" v-model="newTaskData.title">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control" rows="2" v-model="newTaskData.description"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="addTaskHandler">Save</button>
                </div>
            </div>
        </div>
    </div>

    <div ref="editTaskModalRef" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-edit"></i> Edit Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="form-control" v-model="editTaskdata.title">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control" rows="2" v-model="editTaskdata.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <select class="form-control" v-model="editTaskdata.status">
                            <option>Pending</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" @click="editTaskHandler">Update</button>
                </div>
            </div>
        </div>
    </div>

    <div ref="deleteTaskModalRef" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-trash"></i> Delete Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <i style="font-size: 250%;" class="fa fa-exclamation-circle"></i>
                    <br>
                    <span>Are you sure?</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="deleteTaskHandler">Confirm</button>
                </div>
            </div>
        </div>
    </div>

    <div ref="deleteMultipleTaskModalRef" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fa fa-trash"></i> Delete Task</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <i style="font-size: 250%;" class="fa fa-exclamation-circle"></i>
                    <br>
                    <span>Are you sure?</span>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" @click="deleteMultipleIdsHandler">Confirm</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container-body {
    position: fixed;
    width: 82%;
    max-height: 100%;
    overflow-y: scroll;
    left: 18%;
    padding: 6.5rem 1rem;
}
.panels {
    background: #191C24;
    border-radius: 5px;
    padding: 1rem;
}
table {
    width: 100%;
    margin-top: 1rem;
    border-collapse: collapse;
    overflow-x: scroll;
}
th, td {
    text-align: center;
    border: 1px solid #6C7293;
    padding: 8px;
}
.status-select {
    background: transparent;
    outline: none;
    border: none;
    color: #6C7293;
    cursor: pointer;
}
.filter-by-status {
    margin-left: 1rem;
    background-color: #6C7293;
    color: #191C24;
    border: none;
    outline: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: bold;
    cursor: pointer;
}
@media only screen and (max-width: 1250px) {
    .container-body {
        width: 100%;
        left: 0;
    }
}
.toast-success {
    position: absolute;
    background: rgba(85, 137, 85, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 5px;
    z-index: 2;
    color: #fff;
    right: 0;
    margin-top: 6rem;
    margin-right: 2rem;
}
.loader {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>