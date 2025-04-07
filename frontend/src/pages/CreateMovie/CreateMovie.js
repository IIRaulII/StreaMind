import api from '../../services/api.js';
import auth from '../../utils/auth.js';
import notifications from '../../utils/notification.js';
import './CreateMovie.css';

export default class CreateMovie {
  constructor(router) {
    this.router = router;
    this.element = null;
  }
  
  render() {
    // Redireccionar si no está autenticado
    if (!auth.requireAuth(this.router)) {
      return document.createElement('div'); // Return empty div
    }
    
    this.element = document.createElement('div');
    this.element.className = 'create-movie-page';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    // Encabezado
    const header = document.createElement('div');
    header.className = 'page-header';
    
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = '← Volver';
    backButton.addEventListener('click', () => {
      window.history.back();
    });
    
    const title = document.createElement('h1');
    title.textContent = 'Añadir película manualmente';
    
    header.appendChild(backButton);
    header.appendChild(title);
    container.appendChild(header);
    
    // Formulario
    const form = document.createElement('form');
    form.className = 'movie-form';
    form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Título
    const titleGroup = this.createFormGroup('title', 'Título', 'text', true);
    form.appendChild(titleGroup);
    
    // Año
    const yearGroup = this.createFormGroup('year', 'Año', 'number', true);
    const yearInput = yearGroup.querySelector('input');
    yearInput.min = '1900';
    yearInput.max = new Date().getFullYear().toString();
    form.appendChild(yearGroup);
    
    // Géneros
    const genreGroup = this.createFormGroup('genre', 'Géneros (separados por comas)', 'text', true);
    form.appendChild(genreGroup);
    
    // Director
    const directorGroup = this.createFormGroup('director', 'Director', 'text', true);
    form.appendChild(directorGroup);
    
    // Actores
    const castGroup = this.createFormGroup('cast', 'Actores principales (separados por comas)', 'text', true);
    form.appendChild(castGroup);
    
    // Sinopsis
    const synopsisGroup = document.createElement('div');
    synopsisGroup.className = 'form-group';
    
    const synopsisLabel = document.createElement('label');
    synopsisLabel.htmlFor = 'synopsis';
    synopsisLabel.textContent = 'Sinopsis';
    
    const synopsisTextarea = document.createElement('textarea');
    synopsisTextarea.id = 'synopsis';
    synopsisTextarea.name = 'synopsis';
    synopsisTextarea.rows = 5;
    synopsisTextarea.required = true;
    
    synopsisGroup.appendChild(synopsisLabel);
    synopsisGroup.appendChild(synopsisTextarea);
    form.appendChild(synopsisGroup);
    
    // URL de póster
    const posterSection = document.createElement('div');
    posterSection.className = 'poster-section';
    
    const posterSectionTitle = document.createElement('h3');
    posterSectionTitle.textContent = 'Póster de la película';
    posterSectionTitle.className = 'section-title';
    posterSection.appendChild(posterSectionTitle);
    
    // Opción 1: URL externa
    const posterUrlGroup = this.createFormGroup('posterUrl', 'URL del póster (opcional)', 'text', false);
    posterUrlGroup.classList.add('poster-url-group');
    posterSection.appendChild(posterUrlGroup);
    
    // Separador con texto "O"
    const separator = document.createElement('div');
    separator.className = 'separator';
    separator.innerHTML = '<span>O</span>';
    posterSection.appendChild(separator);
    
    // Opción 2: Subir imagen
    const posterFileGroup = document.createElement('div');
    posterFileGroup.className = 'form-group poster-file-group';
    
    const posterFileLabel = document.createElement('label');
    posterFileLabel.htmlFor = 'posterFile';
    posterFileLabel.textContent = 'Subir imagen del póster';
    posterFileGroup.appendChild(posterFileLabel);
    
    const posterFileContainer = document.createElement('div');
    posterFileContainer.className = 'file-upload-container';
    
    const posterFileInput = document.createElement('input');
    posterFileInput.type = 'file';
    posterFileInput.id = 'posterFile';
    posterFileInput.name = 'posterFile';
    posterFileInput.accept = 'image/*';
    posterFileInput.style.display = 'none';
    posterFileInput.addEventListener('change', this.handleFilePreview.bind(this));
    
    const posterFileButton = document.createElement('button');
    posterFileButton.type = 'button';
    posterFileButton.className = 'file-upload-button';
    posterFileButton.innerHTML = '<i class="fas fa-upload"></i> Seleccionar archivo';
    posterFileButton.addEventListener('click', () => posterFileInput.click());
    
    posterFileContainer.appendChild(posterFileButton);
    posterFileContainer.appendChild(posterFileInput);
    
    // Vista previa de la imagen
    const posterPreview = document.createElement('div');
    posterPreview.className = 'poster-preview hidden';
    posterPreview.id = 'poster-preview';
    
    const previewImage = document.createElement('img');
    previewImage.id = 'preview-image';
    previewImage.alt = 'Vista previa del póster';
    
    const removePreviewButton = document.createElement('button');
    removePreviewButton.type = 'button';
    removePreviewButton.className = 'remove-preview';
    removePreviewButton.innerHTML = '<i class="fas fa-times"></i>';
    removePreviewButton.addEventListener('click', this.removePosterPreview.bind(this));
    
    posterPreview.appendChild(previewImage);
    posterPreview.appendChild(removePreviewButton);
    
    posterFileGroup.appendChild(posterFileContainer);
    posterFileGroup.appendChild(posterPreview);
    posterSection.appendChild(posterFileGroup);
    
    form.appendChild(posterSection);
    
    // Botones
    const buttonsGroup = document.createElement('div');
    buttonsGroup.className = 'form-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'cancel-button';
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', () => {
      window.history.back();
    });
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-button';
    submitButton.textContent = 'Guardar película';
    
    buttonsGroup.appendChild(cancelButton);
    buttonsGroup.appendChild(submitButton);
    form.appendChild(buttonsGroup);
    
    container.appendChild(form);
    this.element.appendChild(container);
    
    return this.element;
  }
  
  createFormGroup(id, label, type, required) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.required = required;
    
    group.appendChild(labelElement);
    group.appendChild(input);
    
    return group;
  }
  
  // Añadir métodos para manejar los archivos
  handleFilePreview(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Verificar que es una imagen y tiene un formato permitido
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      notifications.error('Por favor, selecciona un archivo de imagen válido (jpeg, jpg, png, gif).');
      // Limpiar el input file
      event.target.value = '';
      return;
    }
    
    // Mostrar vista previa
    const previewContainer = document.getElementById('poster-preview');
    const previewImage = document.getElementById('preview-image');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
    
    // Ocultar la sección de URL si se sube un archivo
    const urlInput = document.getElementById('posterUrl');
    if (urlInput) {
      urlInput.value = '';
      urlInput.disabled = true;
    }
  }

  removePosterPreview() {
    const previewContainer = document.getElementById('poster-preview');
    const previewImage = document.getElementById('preview-image');
    const fileInput = document.getElementById('posterFile');
    
    // Limpiar la vista previa
    previewImage.src = '';
    previewContainer.classList.add('hidden');
    fileInput.value = '';
    
    // Habilitar la sección de URL
    const urlInput = document.getElementById('posterUrl');
    if (urlInput) {
      urlInput.disabled = false;
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    // Deshabilitar el botón de envío para evitar múltiples envíos
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando...';
    
    try {
      const formData = new FormData(event.target);
      
      // Construir objeto de película
      const movieData = {
        title: formData.get('title'),
        year: parseInt(formData.get('year')),
        genre: formData.get('genre').split(',').map(g => g.trim()),
        director: formData.get('director'),
        cast: formData.get('cast').split(',').map(a => a.trim()),
        synopsis: formData.get('synopsis'),
      };
      
      // Añadir posterUrl si se proporcionó y no hay archivo
      const posterUrl = formData.get('posterUrl');
      const posterFile = document.getElementById('posterFile').files[0];
      
      if (!posterFile && posterUrl && posterUrl.trim()) {
        movieData.posterUrl = posterUrl.trim();
      }
      
      // 1. Primero crear la película
      const response = await api.movies.create(movieData);
      const movieId = response.data._id;
      
      // 2. Si hay un archivo de póster, subirlo después de crear la película
      if (posterFile) {
        // Crear un FormData para el archivo
        const posterFormData = new FormData();
        posterFormData.append('poster', posterFile);
        
        // Subir el póster
        await api.movies.uploadPoster(movieId, posterFormData);
      }
      
      // Redirigir a la página de detalles
      notifications.success('¡Película creada con éxito!');
      this.router.navigate(`/movie/${movieId}`);
    } catch (error) {
      console.error('Error al crear la película:', error);
      notifications.error(`Error al crear la película: ${error.message || 'Error desconocido'}`);
      
      // Rehabilitar el botón
      submitButton.disabled = false;
      submitButton.textContent = 'Guardar película';
    }
  }
} 