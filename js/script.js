$(document).ready(function() {

	var json_data = JSON.parse(localStorage.getItem('json_data'));

	if (json_data) {
		json_data.forEach(element => {
			if (element) {
				newTodo(element.title, element.description, element.id, element.completed);
			}
		});
	}

	registerEventListeners();
	
	openEditId = -1;

	function registerEventListeners() {
		$(".delete").on("click", function() {
			var todoID = $(this).parent().attr('data-id');
			deleteTodo(todoID);
		});
		$("a[data-target='#todoModal']").on("click", function() {
			var todoID = $(this).parent().attr('data-id');
			var currentTodo = getTodo(todoID);
			console.log(currentTodo);
			$("input#todo-title:text").val(currentTodo.title);
			$("input#todo-description:text").val(currentTodo.description);
			openEditId = todoID;
		})
		
	}

	function getTodo(id) {
		var json_temp = JSON.parse(localStorage.getItem('json_data'));
		return json_temp[id];
	}

	function deleteTodo(todoID) {
		$("li[data-id=" + todoID + "]").slideUp();

		var json_temp = JSON.parse(localStorage.getItem('json_data'));
		delete json_temp[todoID];
		localStorage.setItem('json_data',
			JSON.stringify(json_temp)
		);

	}

	function newTodo(todoTitle, todoDesc, todoID, checked) {
		if (!todoTitle && !todoID) {
			todoTitle = document.getElementById("todoTitle").value;
			todoDesc = document.getElementById("todoDesc").value;
			if (todoTitle) {
				var todoID = storeTodoLocal(todoTitle, todoDesc, false);
			}
		}
		if (todoTitle) {
			var todoHTML = '<li style="display:none" data-id="' + todoID + '"><a href="#" data-toggle="modal" data-target="#todoModal">' + todoTitle + '</a> <input type="checkbox" id="cb'+todoID+'" checked="'+checked+'"> <a href="#" class="btn btn-sm btn-danger m-1 delete">Delete</a></li>';
			$("#todo-list").append(todoHTML);
			$("li[data-id=" + todoID + "]").fadeIn();
			$("input#cb"+todoID+":checkbox")[0].checked = checked;
			$("input#cb"+todoID).click(function(){
				registerComplete(todoID, $("input#cb"+todoID+":checkbox")[0].checked);
			})
			registerEventListeners();
		}
	}
	
	function registerComplete(id, checked){
		var json_temp = JSON.parse(localStorage.getItem('json_data'));
		json_temp[id].completed = checked;
		localStorage.setItem('json_data',
			JSON.stringify(json_temp)
		);
	}

	function storeTodoLocal(todoTitle, todoDesc, complete) {

		// retrieve and parse existing JSON from localstorage
		var json_temp = JSON.parse(localStorage.getItem('json_data'));

		if (!json_temp) {
			json_temp = [];
		}

		// creating a new todo ID based on length of existing localstorage array
		var todoID = json_temp.length;

		// add new todo object to JSON
		json_temp.push({
			"id": todoID,
			"title": todoTitle,
			"description": todoDesc,
			"completed": complete
		});

		// log updated JSON to console
		console.log(json_temp);

		// stringify updated JSON and store back in localStorage
		localStorage.setItem('json_data',
			JSON.stringify(json_temp)
		);

		// return ID of new todo
		return todoID;

	}

	function deleteAllTodos() {
		if (confirm("Are you sure you want to delete all of your Todos?")) {
			localStorage.removeItem('json_data');
			$("#todo-list").empty();
		}
	}
	
	function editTodo(){
		var newTitle = $("input#todo-title:text").val();
		var newDesc = $("input#todo-description:text").val();
		var todoID = openEditId;
		deleteTodo(todoID);
		var newID = storeTodoLocal(newTitle, newDesc, false);
		newTodo(newTitle, newDesc, newID, false);
	}

	$("#addButton").click(function(){
		newTodo();
	});
	$("#deleteAllButton").click(function(){
		deleteAllTodos();
	});
	$("#saveChangesButton").click(function(){
		editTodo()
	});
	

})