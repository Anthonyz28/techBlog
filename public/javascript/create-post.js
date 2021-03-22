async function newFormHandler(event) {
    event.preventDefault();
  
    const title = document.querySelector('textarea[name="post-title"]').value.trim();
    const article = document.querySelector('textarea[name="post-article"]').value.trim();
    const username = document.querySelector('textarea[name="post-username"]').value.trim();
    console.log(title, article, username);

    if(title && article && username){
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        article,
        username,
       
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
};
  
  document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);