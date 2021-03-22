async function updateFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector("input[name= 'post-title']").value.trim();
    const article = document.querySelector("textarea[ name= 'article']").value;

    const id = document.querySelector('div#dataHolder').dataset.id
   
    if( title && article ){
     const response = await fetch(`/edit/update`, {
  
      method: 'PUT',
      body: JSON.stringify({
        id,
        title,
        article
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
console.log(response);
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
};

async function deleteFormHandler(event) {
  console.log('delete button clicked')
  event.preventDefault();

  if (event.target.hasAttribute('delete-id')) {

   
    const id = document.querySelector('div#dataHolder').dataset.id

    const response = await fetch(`/edit/delete/` + id, {
      method: 'DELETE',
     

    });
    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
};


document
.querySelector('.deletePostBtn')
.addEventListener('click', deleteFormHandler);

document
.querySelector('.updatePostBtn')
.addEventListener('click', updateFormHandler);
