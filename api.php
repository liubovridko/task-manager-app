<?php
require_once(__DIR__ . '/configs/config.php');
require_once(__DIR__ .'/models/TaskManager.php');

$taskManager = new TaskManager($conn);
// Routing requests
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['completed'])) {
	$offset = isset($_GET['offset']) ? $_GET['offset'] : null;
	$limit = isset($_GET['limit']) ? $_GET['limit'] : null;
    // Request to receive completed tasks
    $completedTasks = $taskManager->getCompletedTasks($offset, $limit);
    echo json_encode($completedTasks);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
	$offset = isset($_GET['offset']) ? $_GET['offset'] : null;
	$limit = isset($_GET['limit']) ? $_GET['limit'] : null;
    // Request to receive a list of tasks
    $tasks = $taskManager->getTasksToDo($offset, $limit);
    usleep(500000); // Sleep for 0.5 seconds
    echo json_encode($tasks);
}  elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Request to create a new task
    $data = json_decode(file_get_contents("php://input"), true);
    $taskManager->createTask($data['title'], $data['description']);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Task update request
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['id'])) {
       $taskManager->updateTask($data['id'], $data['title'], $data['description'], $data['done']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Request to delete a task
    $taskId = isset($_GET['id']) ? $_GET['id'] : null;
    if ($taskId !== null) {
        $taskManager->deleteTask($taskId);
    }
} 


?>