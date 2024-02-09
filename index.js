const infoList = document.querySelector("#infoList");
const createButton = document.querySelector("#createBlog");
const title = document.querySelector("#title");
const author = document.querySelector("#author");
const content = document.querySelector("#blogContent");
const filter = document.querySelector("#filter");

async function getBlogs() {
  try {
    const response = await fetch("http://localhost:3000/blogs");

    if (!response.ok) throw new Error("There is no response from server");

    return response.json();
  } catch (e) {
    console.error(e);
  } finally {
    filter.value = "";
  }
}

async function createBlog() {
  if (!title.value || title.value.length === 0) {
    alert("There has to be a title");
    return;
  }
  if (!author.value || author.value.length === 0) {
    author = "anonym";
  }
  if (!content.value || content.value.length === 0) {
    alert("There has to be content");
    return;
  }
  const blog = {
    title: title.value.length,
    author: author.value,
    content: content.value,
    publication_date: new Date().toISOString().slice(0, 10),
  };
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(blog),
  };
  try {
    const response = await fetch("http://localhost:3000/blogs", options);

    if (!response.ok) throw new Error("There is no response from server");

    return response.json();
  } catch (e) {
    console.error(e);
  } finally {
    showBlogs();
  }
}

async function deleteBlog(id) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  };

  const element = document.getElementById("div" + id);
  element.parentNode.removeChild(element);

  try {
    const response = await fetch("http://localhost:3000/blogs/" + id, options);

    if (!response.ok) throw new Error("There is no response from server");

    return response.json();
  } catch (e) {
    console.error(e);
  }
}

async function updateBlog(id, publication_date) {
  const title = document.querySelector("#title" + id).value;
  const author = document.querySelector("#author" + id).value;
  const content = document.querySelector("#content" + id).value;
  if (!title || title.length === 0) {
    alert("There has to be a title");
    return;
  }
  if (!author || author.length === 0) {
    author = "anonym";
  }
  if (!content || content.length === 0) {
    alert("There has to be content");
    return;
  }
  const unit = document.getElementById(id);
  unit.innerHTML = /*html*/ `
        <h2>${title}</h2>
        <p>${content}</p>
        <b>${author}</b>
        <small>${publication_date}</small>
        <button data-bs-toggle="modal" data-bs-target="#updateModal${id}" style="position: absolute; top: 0px; right: 35px; border: none">
        <i class="fa-solid fa-pen-to-square fa-lg" style="margin: 5px"></i>
        </button>
        <button style="position: absolute; top: 0px; right: 0px; border: none" onclick="deleteBlog('${id}')">
        <i class="fa-solid fa-trash fa-lg" style="color: #ff0000; margin: 5px"></i>
        </button>
        `;

  const options = {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id, title, author, content }),
  };

  try {
    const response = await fetch("http://localhost:3000/blogs", options);

    if (!response.ok) throw new Error("There is no response from server");

    return response.json();
  } catch (e) {
    console.error(e);
  }
}

function showBlogs() {
  const blogs = getBlogs();

  blogs.then((res) => {
    let result = "";
    res.forEach((item) => {
      result += /*html*/ `
      <div id="div${item._id}">
              <li id="${item._id}" style="border: 2px solid; position: relative;">
                  <h2>${item.title}</h2>
                  <p>${item.content}</p>
                  <b>${item.author}</b>
                  <small>${item.publication_date}</small>
                  <button data-bs-toggle="modal" data-bs-target="#updateModal${item._id}" style="position: absolute; top: 0px; right: 35px; border: none">
                  <i class="fa-solid fa-pen-to-square fa-lg" style="margin: 5px"></i>
                  </button>
                  <button style="position: absolute; top: 0px; right: 0px; border: none" onclick="deleteBlog('${item._id}')">
                  <i class="fa-solid fa-trash fa-lg" style="color: #ff0000; margin: 5px"></i>
                  </button>
                  
              </li>
              <br>
              <div class="modal fade" id="updateModal${item._id}" tabindex="-1" aria-labelledby="s" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">  
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <form>
                                  <h3 style="text-align: center;">Update the blog</h3>
                                <label class="form-label">The title of the blog</label>
                                <input id="title${item._id}" type="text" class="form-control" value="${item.title}"/>
                                <label class="form-label">Your name</label>
                                <input id="author${item._id}" type="text" class="form-control"value="${item.author}"/>
                                <label class="form-label">Content</label>
                                <textarea id="content${item._id}"
                                  class="form-control"
                                  rows="5"
                                >${item.content}</textarea>
                              </form>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="updateBlog('${item._id}', '${item.publication_date}')">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
      </div>
          `;
    });
    infoList.innerHTML = result;
  });
}

showBlogs();

createButton.addEventListener("click", (e) => {
  createBlog();
});
