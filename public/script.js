document.getElementById("addNote").addEventListener("click", () => {
  const noteTitle = document.getElementById("noteTitle").value.trim();
  const noteDescription = document
    .getElementById("noteDescription")
    .value.trim();
  if (noteTitle && noteDescription) {
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: noteTitle, description: noteDescription }),
    })
      .then((res) => res.json())
      .then(() => {
        document.getElementById("noteTitle").value = "";
        document.getElementById("noteDescription").value = "";
        loadNotes();
      });
  }
});

function loadNotes() {
  fetch("/api/notes")
    .then((res) => res.json())
    .then((notes) => {
      const notesList = document.getElementById("notesList");
      notesList.innerHTML = "";
      notes.forEach((note) => {
        const card = document.createElement("div");
        card.classList.add("note-card");
        card.innerHTML = `
                  <h3>${note.title}</h3>
                  <p>${note.description.replace(
                    /\n/g,
                    "<br>"
                  )}</p> <!-- Converts newlines to <br> -->
                  <div class="buttons">
                      <button class="edit-btn" onclick="showEditForm(${
                        note.id
                      }, '${note.title}', \`${
          note.description
        }\`)"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="delete-btn" onclick="deleteNote(${
                        note.id
                      })"><i class="fa-solid fa-trash"></i></button>
                  </div>
              `;
        notesList.appendChild(card);
      });
    });
}

function showEditForm(id, currentTitle, currentDescription) {
  const existingForm = document.querySelector(".edit-form");
  if (existingForm) existingForm.remove();

  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = true));

  const editForm = document.createElement("div");
  editForm.classList.add("edit-form");
  editForm.innerHTML = `
      <div class="edit-card">
          <h3>Edit Note</h3>
          <input type="text" id="editTitle" value="${currentTitle}" />
          <textarea id="editDescription">${currentDescription}</textarea>
          <div class="buttons">
              <button class="update-btn" onclick="updateNote(${id})"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="cancel-btn" onclick="cancelEdit()"><i class="fa-solid fa-ban"></i></button>
          </div>
      </div>
  `;
  document.body.appendChild(editForm);
}

function updateNote(id) {
  const newTitle = document.getElementById("editTitle").value;
  const newDescription = document.getElementById("editDescription").value;
  if (newTitle && newDescription) {
    fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, description: newDescription }),
    }).then(() => {
      cancelEdit();
      loadNotes();
    });
  }
}

function cancelEdit() {
  document.querySelector(".edit-form")?.remove();
  document
    .querySelectorAll("button")
    .forEach((button) => (button.disabled = false));
}

function deleteNote(id) {
  fetch(`/api/notes/${id}`, { method: "DELETE" }).then(() => loadNotes());
}

loadNotes();
