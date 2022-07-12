const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('.search-form')
const input = document.querySelector('.search-input')
const galleryDiv = document.querySelector('.gallery')
const btnLoadMore = document.querySelector('.load-more')
const loader = document.querySelector('.loader-container')

btnLoadMore.classList.add('is-hidden')

 
axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '15830616-6bbce06063c91bd81d8a555c0';
let page = 1;
 let q = ''   

const fetchPhotos = async (q, page) =>{
        const response = await axios.get(`?key=${API_KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
        return response
}

const renderGallery = (photos)=>{
    const render = photos.map(el=>{
        const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        } = el;
    return `  <a class="large-url" href="${largeImageURL}">
    <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes:  ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views:  ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments:  ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads:  ${downloads}</b>
      </p>
    </div>
  </div>
  </a>`
    }).join('')

    galleryDiv.insertAdjacentHTML('beforeend', render);
    btnLoadMore.classList.remove('is-hidden')
}


const submitForm = (event)=>{
    event.preventDefault()
    page = 1;
    q = input.value.trim()
    loader.classList.add('is-hidden')
    // console.log(q);
    if (q === ""){
        Notiflix.Notify.warning('Please enter a search term.')
        galleryDiv.innerHTML = ("")
        btnLoadMore.classList.add('is-hidden')
        return
    }galleryDiv.innerHTML = ("")
   
    

    fetchPhotos(q,page).then(({data})=>{
        if (data.totalHits === 0){
            Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.')
        }
        renderGallery(data.hits)
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();

        
        if(data.totalHits< 40 ){
        btnLoadMore.classList.add('is-hidden')
    }

    })

}


const loadMoreFn =()=>{
    page+=1
    // console.log(page);

    fetchPhotos(q, page).then(({data})=>{
        renderGallery(data.hits)
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();


        const lastPage = Math.ceil(data.totalHits/40)
        // console.log(lastPage);
        // console.log(page);
        if(page == lastPage){
            btnLoadMore.classList.add('is-hidden')
        }

    }).catch(err=>console.log(err))
}



form.addEventListener('submit', submitForm);
btnLoadMore.addEventListener('click', loadMoreFn)