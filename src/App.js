import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import "./index.css";

const itemsFromBackEnd = [
  { id: uuid(), content: "1" },
  { id: uuid(), content: "2" },
  { id: uuid(), content: "3" },
];

const columnsFromBackend = {
  toDo: {
    name: "Todo",
    items: itemsFromBackEnd,
  },
  onProgress: {
    name: "On Progress",
    items: [],
  },
  done: {
    name: "Done",
    items: [],
  },
};

const handleDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destinationItems = [...destinationColumn.items];
    const [draggedItem] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, draggedItem);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        items: destinationItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const items = [...column.items];
    const [draggedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, draggedItem);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items,
      },
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  const [newItem, setNewItem] = useState("");

  const handleChange = (event) => {
    setNewItem(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newItem) return;
    const column = columns["toDo"];
    const itemsInTodo = [...column.items];
    console.log(itemsInTodo);
    const itemToPush = {
      id: uuid(),
      content: newItem,
    };

    itemsInTodo.push(itemToPush);
    setColumns({
      ...columns,
      toDo: {
        ...column,
        items: [...itemsInTodo],
      },
    });
    setNewItem("");
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <h1 style={{ color: "#46ACC2", marginBottom: "50px" }}> Kanban Board</h1>

      <form
        style={{
          width: "70%",
          marginBottom: "30px",
        }}
        onSubmit={(event) => handleSubmit(event)}
      >
        <input
          type="text"
          name="newItem"
          style={{
            width: "90%",
            margin: "auto",
            padding: "10px",
          }}
          value={newItem}
          placeholder="add new issue here"
          onChange={(event) => handleChange(event)}
        ></input>
        <input
          type="submit"
          style={{
            padding: "12px 15px 12px 15px",
            backgroundColor: "#498C8A",
            border: "none",
            width: "9%",
            marginLeft: "5px",
            color: "white",
          }}
        ></input>
      </form>

      <div
        style={{ display: "flex", justifyContent: "center", height: "100%" }}
      >
        <DragDropContext
          onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([id, column]) => (
            <Droppable droppableId={id} key={id}>
              {(provided, snapshot) => (
                <div>
                  <h2 style={{ textAlign: "center" }}>{column.name}</h2>
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{
                      backgroundColor: snapshot.isDraggingOver
                        ? "lightblue"
                        : "lightgrey",
                      padding: 4,
                      width: 400,
                      height: 500,
                      marginLeft: 8,
                    }}
                  >
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              userSelect: "none",
                              margin: "1px",
                              padding: 16,
                              height: "50px",
                              backgroundColor: snapshot.isDragging
                                ? "#263B4A"
                                : "#456C86",
                              color: "white",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {item.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
