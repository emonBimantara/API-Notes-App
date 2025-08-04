const container = document.querySelector(".container");
const form = document.getElementById("form");
const titleValue = document.getElementById("title");
const contentValue = document.getElementById("content");
const API_URL = "https://notes-api.dicoding.dev/v2/notes";

getNotes(API_URL);

async function getNotes(url) {
    try {
        const resp = await fetch(url);
        const respData = await resp.json();
        showNotes(respData.data);
    } catch (error) {
        console.error("Failed to fetch API");
    }
}

function showNotes(notes){
    container.innerHTML = "";
    
    notes.forEach(note => {
        const {id, title, body, createdAt} = note;

        container.innerHTML += `
        <div class="box w-80 bg-[#2A2A2A] shadow-lg p-5 flex flex-col gap-3 rounded-lg text-gray-200">
            <div class="flex justify-between place-items-center">
                <h1 class="font-bold text-2xl text-white">${title}</h1>
                <i class="ri-delete-bin-line text-2xl hover:bg-gray-700 p-1 cursor-pointer rounded-lg delete-btn" data-id="${id}"></i>
            </div>
            <p class="text-gray-300">${body}</p>
            <h1 class="text-sm text-gray-400">${dateFormat(createdAt)}</h1>
        </div>
        `
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            swal({
                title: "Are you sure?",
                text: "This note will be permanently deleted and cannot be recovered.",
                icon: "warning",
                buttons: ["Cancel", "Yes, delete it!"],
                dangerMode: true,
            }).then(async (willDelete) => {
                if (willDelete) {
                    await deleteNote(id);
                    getNotes(API_URL);
                    swal("Deleted!", "Your note has been successfully deleted.", "success");
                }
            });
        });
    });
}

async function createNotes(title, body){
    try {
        const resp = await fetch(API_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: body
            })
        });
        const respData = await resp.json();
        console.log(respData);
    } catch (error) {
        console.error(error);
    }
}

async function deleteNote(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        getNotes(API_URL);
    } catch(error) {
        console.error(error);
    }
}

form.addEventListener("submit", (e) => {
    const title = titleValue.value;
    const body = contentValue.value;

    if(title === "" || body === "") {
        swal("Oops!", "Please fill in both the title and content.", "error");
        e.preventDefault();
        return;
    }else{
        createNotes(title, body);
        form.reset(); 
    }      
})

function dateFormat(pubDate) {
    const date = new Date(pubDate);
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        timeZone: 'Asia/Jakarta' 
    };
    return date.toLocaleDateString('id-ID', options);
}