// TransCoope - Plataforma de Transcripción Musical
// Script optimizado sin pantalla de carga

class TransCoopeApp {
    constructor() {
        this.currentUser = null;
        this.userData = null;
        this.currentSection = 'dashboard';
        this.isLoading = false;
        this.audioPlayer = null;
        
        this.init();
    }

    async init() {
        try {
            // Inicialización inmediata sin pantalla de carga
            this.hideLoadingScreen();
            
            await this.setupEventListeners();
            await this.loadUserData();
            this.showMainApp();
            
            // Cargar datos iniciales en segundo plano
            this.loadInitialDataAsync();
            
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.handleInitError();
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        document.body.classList.remove('loading');
    }

    async setupEventListeners() {
        // Navegación principal
        this.setupNavigation();

        // Botones de acción rápida
        this.setupQuickActions();

        // Sistema de búsqueda
        this.setupSearch();

        // Sistema de notificaciones
        this.setupNotifications();

        // Reproductor de audio
        this.setupAudioPlayer();

        // Gestión de archivos
        this.setupFileUpload();

        // Eventos globales
        this.setupGlobalEvents();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const section = item.dataset.section;
                if (section && section !== this.currentSection) {
                    this.switchSection(section);
                }
            });
        });

        // Navegación por hash URL
        const initialHash = window.location.hash.substring(1) || 'dashboard';
        this.switchSection(initialHash);
        
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && hash !== this.currentSection) {
                this.switchSection(hash);
            }
        });
    }

    switchSection(sectionName) {
        // Ocultar sección actual
        const currentSection = document.getElementById(`${this.currentSection}-section`);
        const currentNavItem = document.querySelector(`[data-section="${this.currentSection}"]`);
        
        if (currentSection) currentSection.classList.remove('active');
        if (currentNavItem) currentNavItem.classList.remove('active');

        // Mostrar nueva sección
        const newSection = document.getElementById(`${sectionName}-section`);
        const newNavItem = document.querySelector(`[data-section="${sectionName}"]`);
        
        if (newSection) {
            newSection.classList.add('active');
            this.loadSectionContent(sectionName);
        }
        
        if (newNavItem) newNavItem.classList.add('active');

        // Actualizar estado
        this.currentSection = sectionName;
        window.location.hash = sectionName;

        // Actualizar título de la página
        document.title = this.getSectionTitle(sectionName) + ' | TransCoope';
    }

    async loadSectionContent(sectionName) {
        if (this.isLoading) return;

        this.isLoading = true;
        
        try {
            switch (sectionName) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'transcribe':
                    await this.loadTranscriptionInterface();
                    break;
                case 'library':
                    await this.loadLibrary();
                    break;
                case 'community':
                    await this.loadCommunity();
                    break;
                case 'projects':
                    await this.loadProjects();
                    break;
                case 'trending':
                    await this.loadTrending();
                    break;
            }
        } catch (error) {
            console.error(`Error loading section ${sectionName}:`, error);
            this.showNotification('Error al cargar el contenido', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    getSectionTitle(section) {
        const titles = {
            dashboard: 'Inicio',
            transcribe: 'Transcribir',
            library: 'Mi Biblioteca',
            community: 'Comunidad',
            projects: 'Proyectos',
            trending: 'Tendencias'
        };
        return titles[section] || 'TransCoope';
    }

    setupQuickActions() {
        const actions = {
            'quick-transcribe': () => this.switchSection('transcribe'),
            'quick-project': () => this.showProjectModal(),
            'quick-library': () => this.switchSection('library'),
            'quick-collab': () => this.showCollaborationModal(),
            'start-activity-btn': () => this.switchSection('transcribe'),
            'view-activity-btn': () => this.switchSection('library'),
            'explore-community-btn': () => this.switchSection('community'),
            'refresh-recommendations': () => this.refreshRecommendations(),
            'new-transcription-btn': () => this.switchSection('transcribe')
        };

        Object.entries(actions).forEach(([id, action]) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', action);
            }
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('global-search');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        // Atajo de teclado Ctrl+K / Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    async performSearch(query) {
        if (!query.trim()) return;

        this.showNotification(`Buscando: "${query}"`, 'info');
        
        try {
            const results = await this.simulateSearch(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Error en la búsqueda', 'error');
        }
    }

    async simulateSearch(query) {
        await this.delay(500);
        
        return {
            songs: [
                { name: 'Canción ejemplo 1', artist: 'Artista A', match: 0.95 },
                { name: 'Canción ejemplo 2', artist: 'Artista B', match: 0.87 }
            ],
            projects: [
                { name: 'Proyecto colaborativo', author: 'Usuario X', match: 0.92 }
            ],
            users: [
                { name: 'músico_creativo', match: 0.78 }
            ]
        };
    }

    displaySearchResults(results) {
        // Implementar interfaz de resultados de búsqueda
        console.log('Resultados de búsqueda:', results);
        this.showNotification(`Encontrados ${Object.values(results).flat().length} resultados`, 'success');
    }

    setupNotifications() {
        const notificationBtn = document.getElementById('notifications-btn');
        const notificationCenter = document.getElementById('notification-center');

        if (notificationBtn && notificationCenter) {
            notificationBtn.addEventListener('click', () => {
                notificationCenter.classList.toggle('active');
                this.loadNotifications();
            });
        }

        // Cerrar notificaciones al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!notificationCenter?.contains(e.target) && !notificationBtn?.contains(e.target)) {
                notificationCenter?.classList.remove('active');
            }
        });
    }

    async loadNotifications() {
        const notifications = this.getStoredData('notifications') || await this.generateSampleNotifications();
        this.renderNotifications(notifications);
    }

    async generateSampleNotifications() {
        return [
            {
                id: 1,
                type: 'success',
                title: '¡Bienvenido a TransCoope!',
                message: 'Tu cuenta ha sido configurada exitosamente',
                time: 'Ahora',
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: 'Nueva función disponible',
                message: 'Ahora puedes transcribir desde enlaces de YouTube',
                time: 'Hace 1 hora',
                read: false
            },
            {
                id: 3,
                type: 'warning',
                title: 'Completa tu perfil',
                message: 'Añade tus géneros favoritos para mejores recomendaciones',
                time: 'Hace 2 horas',
                read: true
            }
        ];
    }

    renderNotifications(notifications) {
        const container = document.getElementById('notification-list');
        if (!container) return;

        const unreadCount = notifications.filter(n => !n.read).length;
        this.updateNotificationBadge(unreadCount);

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <button class="notification-dismiss" data-id="${notification.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Agregar event listeners para descartar notificaciones
        container.querySelectorAll('.notification-dismiss').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.dismissNotification(id);
            });
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    updateNotificationBadge(count) {
        const badge = document.getElementById('notification-count');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    async dismissNotification(id) {
        let notifications = this.getStoredData('notifications') || [];
        notifications = notifications.filter(n => n.id !== id);
        this.setStoredData('notifications', notifications);
        await this.loadNotifications();
        this.showNotification('Notificación eliminada', 'success');
    }

    setupAudioPlayer() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlayback());
        }
    }

    togglePlayback() {
        const playBtn = document.querySelector('.play-btn');
        const icon = playBtn.querySelector('i');
        
        if (icon.classList.contains('fa-play')) {
            icon.classList.replace('fa-play', 'fa-pause');
            this.showNotification('Reproduciendo audio', 'info');
        } else {
            icon.classList.replace('fa-pause', 'fa-play');
            this.showNotification('Audio en pausa', 'info');
        }
    }

    setupFileUpload() {
        const fileInput = document.getElementById('quick-audio-file');
        const uploadArea = document.getElementById('quick-upload-area');
        const selectBtn = document.getElementById('select-audio-btn');

        if (selectBtn && fileInput) {
            selectBtn.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelection(e.target.files[0]);
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelection(files[0]);
                }
            });
        }
    }

    handleFileSelection(file) {
        if (!file) return;

        // Validar tipo de archivo
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/m4a'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('Tipo de archivo no soportado. Use MP3, WAV, FLAC o M4A', 'error');
            return;
        }

        // Validar tamaño (50MB máximo)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('El archivo es demasiado grande (máximo 50MB)', 'error');
            return;
        }

        // Mostrar información del archivo
        this.displayFileInfo(file);
    }

    displayFileInfo(file) {
        const uploadArea = document.getElementById('quick-upload-area');
        if (!uploadArea) return;

        const fileSize = this.formatFileSize(file.size);
        
        uploadArea.innerHTML = `
            <div class="file-selected">
                <i class="fas fa-file-audio"></i>
                <div class="file-info">
                    <h4>${file.name}</h4>
                    <p>${fileSize} • Listo para transcribir</p>
                </div>
                <div class="file-actions">
                    <button class="btn-outline" id="cancel-upload">Cancelar</button>
                    <button class="btn-primary" id="start-transcription">Transcribir</button>
                </div>
            </div>
        `;

        // Agregar event listeners para los nuevos botones
        document.getElementById('cancel-upload')?.addEventListener('click', () => {
            this.resetUploadArea();
        });

        document.getElementById('start-transcription')?.addEventListener('click', () => {
            this.startTranscription(file);
        });
    }

    resetUploadArea() {
        const uploadArea = document.getElementById('quick-upload-area');
        const fileInput = document.getElementById('quick-audio-file');
        
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h4>Arrastra tu archivo de audio aquí</h4>
                    <p>o haz clic para seleccionar</p>
                    <button class="btn-primary" id="select-audio-btn">Seleccionar Archivo</button>
                </div>
            `;
            
            // Re-conectar event listeners
            document.getElementById('select-audio-btn')?.addEventListener('click', () => {
                fileInput?.click();
            });
        }
        
        if (fileInput) {
            fileInput.value = '';
        }
    }

    async startTranscription(file) {
        this.showNotification('Iniciando transcripción...', 'info');
        
        try {
            // Simular proceso de transcripción
            const result = await this.simulateTranscription(file);
            this.handleTranscriptionResult(result);
        } catch (error) {
            console.error('Transcription error:', error);
            this.showNotification('Error en la transcripción', 'error');
        }
    }

    async simulateTranscription(file) {
        // Mostrar progreso en notificaciones
        const steps = [
            { progress: 20, message: 'Analizando archivo de audio...' },
            { progress: 40, message: 'Separando instrumentos...' },
            { progress: 60, message: 'Detectando melodías...' },
            { progress: 80, message: 'Generando partituras...' },
            { progress: 100, message: 'Transcripción completada!' }
        ];

        for (const step of steps) {
            await this.delay(1500);
            this.showNotification(step.message, 'info');
        }

        return {
            success: true,
            file: file.name,
            instruments: ['Guitarra', 'Bajo', 'Batería', 'Piano'],
            duration: '3:45',
            key: 'C Mayor',
            bpm: 120
        };
    }

    handleTranscriptionResult(result) {
        if (result.success) {
            this.showNotification('¡Transcripción completada exitosamente!', 'success');
            
            // Actualizar estadísticas
            this.updateUserStats();
            
            // Navegar a la sección de biblioteca para ver resultados
            setTimeout(() => {
                this.switchSection('library');
            }, 1000);
        } else {
            this.showNotification('Error en la transcripción', 'error');
        }
    }

    setupGlobalEvents() {
        // Actualizar fecha actual
        this.updateCurrentDate();
        setInterval(() => this.updateCurrentDate(), 60000);

        // Manejar errores no capturados
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
            this.showNotification('Ha ocurrido un error inesperado', 'error');
        });

        // Manejar promesas rechazadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promesa rechazada:', e.reason);
            this.showNotification('Error en una operación', 'error');
            e.preventDefault();
        });
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('es-ES', options);
        }
    }

    async loadUserData() {
        // Verificar si hay usuario guardado
        const savedUser = this.getStoredData('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.userData = this.getStoredData('userData') || this.getDefaultUserData();
        } else {
            // Crear usuario temporal
            this.currentUser = { username: 'Músico', id: 'temp_' + Date.now() };
            this.userData = this.getDefaultUserData();
            this.setStoredData('currentUser', this.currentUser);
            this.setStoredData('userData', this.userData);
        }
        
        // Actualizar UI con datos del usuario
        this.updateUserInterface();
    }

    updateUserInterface() {
        // Actualizar nombre de usuario
        const usernameElements = document.querySelectorAll('#username, #header-username, #greeting-name');
        usernameElements.forEach(el => {
            if (el && this.userData?.username) {
                el.textContent = this.userData.username;
            }
        });

        // Actualizar avatar
        this.updateUserAvatar();

        // Actualizar estadísticas
        this.updateUserStats();

        // Actualizar saludo personalizado
        this.updateGreeting();
    }

    updateUserAvatar() {
        const avatars = document.querySelectorAll('.user-avatar');
        avatars.forEach(avatar => {
            const fallback = avatar.querySelector('#avatar-fallback, #header-avatar-fallback');
            if (fallback) {
                fallback.textContent = this.userData?.username?.charAt(0).toUpperCase() || 'M';
            }
        });
    }

    updateUserStats() {
        // Incrementar estadísticas cuando se completa una transcripción
        if (!this.userData.stats) {
            this.userData.stats = {
                transcriptions: 0,
                projects: 0,
                downloads: 0,
                collaborations: 0
            };
        }

        // Actualizar estadísticas en el sidebar
        const sidebarStats = {
            'sidebar-transcriptions': this.userData.stats.transcriptions,
            'sidebar-projects': this.userData.stats.projects
        };

        Object.entries(sidebarStats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Actualizar estadísticas en el dashboard
        const dashboardStats = {
            'stat-transcriptions': this.userData.stats.transcriptions,
            'stat-projects': this.userData.stats.projects,
            'stat-downloads': this.userData.stats.downloads,
            'stat-collaborations': this.userData.stats.collaborations
        };

        Object.entries(dashboardStats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    updateGreeting() {
        const greetingElement = document.getElementById('greeting-name');
        if (greetingElement && this.userData?.username) {
            const hour = new Date().getHours();
            let greeting = '';
            
            if (hour < 12) greeting = 'Buenos días';
            else if (hour < 18) greeting = 'Buenas tardes';
            else greeting = 'Buenas noches';
            
            greetingElement.textContent = this.userData.username;
            
            // Actualizar emoji según la hora
            const emojiElement = document.querySelector('.welcome-emoji');
            if (emojiElement) {
                if (hour < 12) emojiElement.textContent = '🌅';
                else if (hour < 18) emojiElement.textContent = '☀️';
                else emojiElement.textContent = '🌙';
            }
        }
    }

    showMainApp() {
        // Mostrar aplicación principal
        const app = document.getElementById('app');
        if (app) {
            app.classList.remove('hidden');
        }

        // Cargar sección actual
        this.loadSectionContent(this.currentSection);
    }

    async loadDashboard() {
        // Cargar actividad reciente
        await this.loadRecentActivity();
        
        // Cargar recomendaciones
        await this.loadRecommendations();
        
        // Cargar contenido comunitario
        await this.loadCommunitySpotlight();
    }

    async loadRecentActivity() {
        const activityContainer = document.getElementById('recent-activity');
        if (!activityContainer) return;

        // Generar actividad de ejemplo para nuevos usuarios
        if (!this.userData.recentActivity || this.userData.recentActivity.length === 0) {
            this.userData.recentActivity = await this.generateSampleActivity();
            this.setStoredData('userData', this.userData);
        }

        const activities = this.userData.recentActivity;
        
        if (activities.length === 0) {
            return; // Mantener el estado vacío
        }

        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-message">${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    async generateSampleActivity() {
        return [
            {
                type: 'info',
                message: 'Bienvenido a TransCoope',
                time: 'Ahora'
            },
            {
                type: 'tip',
                message: 'Comienza transcribiendo tu primer archivo de audio',
                time: 'Sugerencia'
            }
        ];
    }

    getActivityIcon(type) {
        const icons = {
            transcription: 'wave-square',
            project: 'project-diagram',
            download: 'download',
            collaboration: 'users',
            info: 'info-circle',
            tip: 'lightbulb'
        };
        return icons[type] || 'music';
    }

    async loadRecommendations() {
        const container = document.getElementById('dashboard-recommendations');
        if (!container) return;

        const recommendations = await this.generateRecommendations();
        
        container.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="rec-cover">
                    <i class="fas fa-${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <span class="rec-meta">${rec.meta}</span>
                </div>
                <button class="rec-action" data-id="${rec.id}">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `).join('');

        // Agregar event listeners a las recomendaciones
        container.querySelectorAll('.rec-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.handleRecommendationClick(id);
            });
        });
    }

    async generateRecommendations() {
        return [
            {
                id: 1,
                icon: 'music',
                title: 'Tutorial de Inicio',
                description: 'Aprende a usar TransCoope en 5 minutos',
                meta: 'Guía rápida'
            },
            {
                id: 2,
                icon: 'users',
                title: 'Comunidad Activa',
                description: 'Conecta con otros músicos y colabora',
                meta: '+500 miembros'
            },
            {
                id: 3,
                icon: 'graduation-cap',
                title: 'Ejemplos Musicales',
                description: 'Explora transcripciones de referencia',
                meta: 'Plantillas'
            }
        ];
    }

    handleRecommendationClick(id) {
        const actions = {
            1: () => this.showNotification('Abriendo tutorial...', 'info'),
            2: () => this.switchSection('community'),
            3: () => this.switchSection('library')
        };
        
        if (actions[id]) {
            actions[id]();
        }
    }

    async loadCommunitySpotlight() {
        const container = document.getElementById('community-spotlight');
        if (!container) return;

        const spotlight = await this.generateCommunitySpotlight();
        
        container.innerHTML = spotlight.map(item => `
            <div class="community-item">
                <div class="community-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="community-content">
                    <h4>${item.user}</h4>
                    <p>${item.project}</p>
                    <div class="community-stats">
                        <span><i class="fas fa-heart"></i> ${item.likes}</span>
                        <span><i class="fas fa-comment"></i> ${item.comments}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async generateCommunitySpotlight() {
        return [
            {
                user: 'Ana Martínez',
                project: 'Composición para piano - "Atardecer"',
                likes: 18,
                comments: 5
            },
            {
                user: 'David López',
                project: 'Arreglo para guitarra - Canción popular',
                likes: 32,
                comments: 12
            }
        ];
    }

    async refreshRecommendations() {
        const refreshBtn = document.getElementById('refresh-recommendations');
        if (refreshBtn) {
            refreshBtn.classList.add('loading');
            await this.delay(1000);
            await this.loadRecommendations();
            refreshBtn.classList.remove('loading');
            this.showNotification('Recomendaciones actualizadas', 'success');
        }
    }

    async loadInitialDataAsync() {
        // Cargar datos adicionales en segundo plano
        try {
            // Simular carga de datos del usuario
            await this.delay(2000);
            
            // Actualizar con datos más completos
            if (this.userData.stats.transcriptions === 0) {
                this.userData.stats = {
                    transcriptions: 3,
                    projects: 1,
                    downloads: 8,
                    collaborations: 2
                };
                this.updateUserStats();
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification toast ${type}`;
        notification.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </div>
            <div class="toast-content">${message}</div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Agregar al contenedor
        const container = document.getElementById('toast-container') || this.createToastContainer();
        container.appendChild(notification);

        // Animación de entrada
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Cerrar al hacer clic
        notification.querySelector('.toast-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    showProjectModal() {
        this.showNotification('Función de proyectos en desarrollo', 'info');
    }

    showCollaborationModal() {
        this.showNotification('Función de colaboración en desarrollo', 'info');
    }

    async loadTranscriptionInterface() {
        const section = document.getElementById('transcribe-section');
        if (section && section.innerHTML === '') {
            section.innerHTML = `
                <div class="section-header">
                    <h1>Transcribir Audio</h1>
                    <p>Convierte cualquier audio en partituras profesionales</p>
                </div>
                <div class="transcription-interface">
                    <p>Interfaz completa de transcripción cargada dinámicamente</p>
                </div>
            `;
        }
    }

    async loadLibrary() {
        const section = document.getElementById('library-section');
        if (section && section.innerHTML === '') {
            section.innerHTML = `
                <div class="section-header">
                    <h1>Mi Biblioteca</h1>
                    <p>Gestiona tus transcripciones y proyectos</p>
                </div>
                <div class="library-interface">
                    <p>Biblioteca personal cargada dinámicamente</p>
                </div>
            `;
        }
    }

    async loadCommunity() {
        const section = document.getElementById('community-section');
        if (section && section.innerHTML === '') {
            section.innerHTML = `
                <div class="section-header">
                    <h1>Comunidad</h1>
                    <p>Conecta con otros músicos</p>
                </div>
                <div class="community-interface">
                    <p>Interfaz comunitaria cargada dinámicamente</p>
                </div>
            `;
        }
    }

    async loadProjects() {
        const section = document.getElementById('projects-section');
        if (section && section.innerHTML === '') {
            section.innerHTML = `
                <div class="section-header">
                    <h1>Proyectos</h1>
                    <p>Organiza y comparte tus creaciones</p>
                </div>
                <div class="projects-interface">
                    <p>Interfaz de proyectos cargada dinámicamente</p>
                </div>
            `;
        }
    }

    async loadTrending() {
        const section = document.getElementById('trending-section');
        if (section && section.innerHTML === '') {
            section.innerHTML = `
                <div class="section-header">
                    <h1>Tendencias</h1>
                    <p>Descubre lo más popular en la comunidad</p>
                </div>
                <div class="trending-interface">
                    <p>Interfaz de tendencias cargada dinámicamente</p>
                </div>
            `;
        }
    }

    // Utilidades
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getStoredData(key) {
        try {
            const item = localStorage.getItem(`transcoope_${key}`);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    }

    setStoredData(key, value) {
        try {
            localStorage.setItem(`transcoope_${key}`, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    }

    getDefaultUserData() {
        return {
            username: 'Músico',
            stats: {
                transcriptions: 0,
                projects: 0,
                downloads: 0,
                collaborations: 0
            },
            preferences: {
                genres: [],
                autoSave: true
            },
            recentActivity: []
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    handleInitError() {
        this.showNotification('Error al iniciar la aplicación', 'error');
        
        // Mostrar estado de error
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>Error de conexión</h2>
                    <p>No se pudo cargar la aplicación. Por favor, intenta nuevamente.</p>
                    <button class="btn-primary" onclick="window.location.reload()">Reintentar</button>
                </div>
            `;
        }
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar compatibilidad del navegador
    if (!('Promise' in window) || !('localStorage' in window)) {
        document.body.innerHTML = `
            <div class="browser-error">
                <h1>Navegador no compatible</h1>
                <p>Tu navegador no soporta todas las funciones necesarias.</p>
                <p>Por favor, actualiza a una versión moderna de Chrome, Firefox, Safari o Edge.</p>
            </div>
        `;
        return;
    }

    // Inicializar la aplicación inmediatamente
    window.transCoopeApp = new TransCoopeApp();
});

// Hacer la clase disponible globalmente
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransCoopeApp;
}
