<?php
require_once(__DIR__ . '/../configs/config.php');
require_once('Task.php');

class TaskManager {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }
    //get tasks to do
    public function getTasksToDo($offset, $limit) {
        $result = $this->conn->query("SELECT * FROM tasks WHERE done = 0 LIMIT $limit OFFSET $offset");
        $tasks = array();

        while ($row = $result->fetch_assoc()) {
            $task = new Task($row['title'], $row['description']);
            $task->id = $row['id'];
            $task->created_at = $row['created_at'];
            $task->updated_at = $row['updated_at'];
            $tasks[] = $task;
        }
        $result->free_result();
        return $tasks;
    }
    //create new task
    public function createTask($title, $description) {
        $task = new Task($title, $description);
        $sql = "INSERT INTO tasks (title, description, created_at, updated_at) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $task->title, $task->description, $task->created_at, $task->updated_at);
        $stmt->execute();
        $stmt->close();

        return $task;
    }
    //update task
   public function updateTask($id, $title, $description, $done) {
        $task = new Task($title, $description);
        $task->id = $id;
        if ($done) {
            // Mark the task as completed
            $sql = "UPDATE tasks SET done = 1, updated_at = ? WHERE id = ?";
        } else {
            // Update task
            $sql = "UPDATE tasks SET title = ?, description = ?, updated_at = ? WHERE id = ?";
        }

        $stmt = $this->conn->prepare($sql);

        if ($done) {
            $stmt->bind_param("si", $task->updated_at, $task->id);
        } else {
            $stmt->bind_param("sssi", $task->title, $task->description, $task->updated_at, $task->id);
        }

        $stmt->execute();
        $stmt->close();
        return $task;
    }
    //delete task
    public function deleteTask($id) {
        $sql = "DELETE FROM tasks WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
    }

    //get all completed tasks
    public function getCompletedTasks($offset, $limit) {
        $result = $this->conn->query("SELECT * FROM tasks WHERE done = 1 LIMIT $limit OFFSET $offset");
        $tasks = array();
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {

                $task = new Task($row['title'], $row['description']);
                $task->id = $row['id'];
                $task->created_at = $row['created_at'];
                $task->updated_at = $row['updated_at'];
                $task->done = $row['done'];
                $tasks[] = $task;
            }
            $result->free_result();
       }

       return $tasks;
    }

}
?>