
$(document).ready(function() {

var offset = 0;
var limit = 7; // Initial number of tasks to load per request
var todoLimit=7;
var increment= 2;
var isLoading = false;
var allTasksLoaded = false;

   //load task todo
    function loadTasks(offset, limit) {

        if (!isLoading) {
            isLoading = true;
            // Show loading indicator
            $('#loading').show();
        $.ajax({
            url: 'api.php?offset=' + offset + '&limit=' + limit,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                displayTasks(data);
                  if (data.length < todoLimit) {
                      allTasksLoaded=true;
                    } 
                // Hide loading indicator
                $('#loading').hide();
                isLoading = false;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error loading tasks:', textStatus, errorThrown);
            }
        });

       }
    }

     //load task done
     function loadCompletedTasks(offset, limit) {
        $.ajax({
            url: 'api.php?completed&offset=' + offset + '&limit=' + limit,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                displayCompletedTasks(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error loading completed tasks:', textStatus, errorThrown);
            }
        });
    }


    function displayTasks(tasks) {
        $('#task-list').empty();
        tasks.forEach(function(task) {
            var checkbox = $('<input type="checkbox">').prop('checked', task.done);
            var taskItem = $('<li class="task-item" data-id="' + task.id + '">');
            taskItem.append('<div>' + checkbox.prop('outerHTML') + task.title + ' - ' + task.description + '</div>');
            appendActions(taskItem, task);
            $('#task-list').append(taskItem);
        });
    }

    function displayCompletedTasks(completedTasks) {
        $('#done-list').empty();
        completedTasks.forEach(function(task) {
            var checkbox = $('<input type="checkbox" checked disabled>');
            var taskItem = $('<li class="task-item" data-id="' + task.id + '">');
            taskItem.append('<div>' + checkbox.prop('outerHTML') + task.title + ' - ' + task.description + '</div>');
            appendActions(taskItem, task);
            $('#done-list').append(taskItem);
        });
    }

    function appendActions(taskItem, task) {
        var actionsContainer = $('<div class="task-actions">');
        actionsContainer.append('<button class="edit-btn" data-id="' + task.id + '" data-title="' + task.title + '" data-description="' + task.description + '">Edit</button>');
        actionsContainer.append('<button class="delete-btn" data-id="' + task.id + '">Delete</button></div>');
        taskItem.append(actionsContainer);
    }


    // Display initial tasks
    loadTasks(offset, limit);
    loadCompletedTasks(offset, limit);

    // Event handler for infinite scrolling
    $(window).on('scroll', function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100) {
            // Load more tasks when reaching near the bottom only if not all tasks are loaded
            if (!allTasksLoaded) {
                todoLimit += increment;
                loadTasks(offset, todoLimit);
            }
        }
    });

    function addTask(title, description) {
        $.ajax({
            url: 'api.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({title: title, description: description}),
            success: function () {
                 loadTasks(offset, todoLimit);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error adding task:', textStatus, errorThrown);
            }
        });
    }

    function updateTask(id, title, description, completed) {
    $.ajax({
        url: 'api.php',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({ id: id, title: title, description: description, done: completed }),
        success: function () {
            loadTasks(offset, todoLimit);
            loadCompletedTasks(offset, limit);
        },
        error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error Update task:', textStatus, errorThrown);
        }
    });
}

    function deleteTask(id) {
        $.ajax({
            url: 'api.php?id=' + id,
            type: 'DELETE',
            success: function () {
                loadTasks(offset, todoLimit);
                loadCompletedTasks(offset, limit);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Error delete task:', textStatus, errorThrown);
            }
        });
    }

      // Event handler for the task addition form
     $("#add-task-form").submit(function(event) {
            event.preventDefault(); // We prevent the standard behavior of the form
            var title = $("#title").val();
            var description = $("#description").val();

            // We call the function of adding a task
            addTask(title, description);

            // Clear the input fields after adding the task
            $("#title").val('');
            $("#description").val('');
        });

        // Event handlers for buttons in the task list
      $('#task-list').on('change', 'li :checkbox', function() {
            var taskId = $(this).closest('li').data('id');
            var done = $(this).is(':checked');
            updateTask(taskId, null, null, done);
        });

      function createButtonHandler(action) {
        return function() {
            console.log(action + ' button clicked');
            var taskId = $(this).data('id');
            var title = $(this).data('title');
            var description = $(this).data('description');

            if (action === 'Edit') {
               var $editForm = $('<form class="edit-form">' +
                                    '<label for="edit-title">Edit Title:</label>' +
                                    '<input type="text" id="edit-title" name="edit-title" value="' + title + '" required></br>' +
                                    '<label for="edit-description">Edit Description:</label>' +
                                    '<textarea id="edit-description" name="edit-description">' + description + '</textarea>' +
                                    '<button type="submit">Save</button>' +
                                  '</form>');

                // Replace the task content with the edit form
                $(this).closest('li').html($editForm);

                // Set up the submit event for the edit form
                $editForm.submit(function(event) {
                    event.preventDefault();
                    var updatedTitle = $("#edit-title").val();
                    var updatedDescription = $("#edit-description").val();
                    updateTask(taskId, updatedTitle, updatedDescription, null);
                });
            } else if (action === 'Delete') {
                deleteTask(taskId);
            }
        };
    }

    // Attach event handlers for the buttons in the task list
    $('#task-list').on('click', '.edit-btn', createButtonHandler('Edit'));
    $('#task-list').on('click', '.delete-btn', createButtonHandler('Delete'));

    // Attach event handlers for the buttons in the done list
    $('#done-list').on('click', '.edit-btn', createButtonHandler('Edit'));
    $('#done-list').on('click', '.delete-btn', createButtonHandler('Delete'));
});