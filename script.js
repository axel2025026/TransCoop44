// TransCoope - Plataforma de Transcripción Musical
// Script principal optimizado y profesional

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
            await this.initializeApp();
            await this.setupEventListeners();
            await this.loadUserData();
            this.showMainApp();
        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            this.handleInitError();
        }
    }

    async initializeApp() {
        // Simular carga de recursos esenciales
        await this.simulateResourceLoading();
        
        // Verificar si hay usuario guardado
        const savedUser = this.getStoredData('currentUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.userData = this.getStoredData('userData') || this.getDefaultUserData();
        } else {
            // Mostrar onboarding para nuevos usuarios
            this.showOnboarding();
            return;
        }
    }

    async simulateResourceLoading() {
        const steps = [
            { message: 'Cargando componentes principales...', duration: 800 },
            { message: 'Inicializando motor de audio...', duration: 600 },
            { message: 'Configurando IA de transcripción...', duration: 900 },
            { message: 'Preparando interfaz...', duration: 500 }
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            this.updateLoadingProgress(
                ((i + 1) / steps.length) * 100,
                step.message
            );
            await this.delay(step.duration);
        }
    }

    updateLoadingProgress(percent, message) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const statusMessage = document.getElementById('status-message');

        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${Math.round(percent)}%`;
        if (statusMessage) statusMessage.textContent = message;
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
        const contentSections = document.querySelectorAll('.content-section');

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
            'refresh-recommendations': () => this.refreshRecommendations()
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

        try {
            // Simular búsqueda
            const results = await this.simulateSearch(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    async simulateSearch(query) {
        await this.delay(500); // Simular latencia de red
        
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
                title: 'Transcripción completada',
                message: 'Tu archivo "mi_canción.mp3" ha sido procesado exitosamente',
                time: 'Hace 5 minutos',
                read: false
            },
            {
                id: 2,
                type: 'info',
                title: 'Nueva colaboración',
                message: 'Juan Pérez te invitó a colaborar en "Proyecto Sinfónico"',
                time: 'Hace 2 horas',
                read: false
            },
            {
                id: 3,
                type: 'warning',
                title: 'Límite de almacenamiento',
                message: 'Has usado el 85% de tu espacio disponible',
                time: 'Ayer',
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
    }

    setupAudioPlayer() {
        // Configurar reproductor de audio básico
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
            // Aquí iría la lógica de reproducción real
        } else {
            icon.classList.replace('fa-pause', 'fa-play');
            // Aquí iría la lógica de pausa real
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
            this.showNotification('Tipo de archivo no soportado', 'error');
            return;
        }

        // Validar tamaño (50MB máximo)
        const maxSize = 50 * 1024 * 1024;
        if (file.size > maxSize) {
            this.showNotification('El archivo es demasiado grande (máx. 50MB)', 'error');
            return;
        }

        // Mostrar información del archivo
        this.displayFileInfo(file);
        
        // Iniciar transcripción
        this.startTranscription(file);
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
        // Simular progreso de transcripción
        const steps = [
            { progress: 20, message: 'Analizando archivo de audio...' },
            { progress: 40, message: 'Separando instrumentos...' },
            { progress: 60, message: 'Detectando melodías...' },
            { progress: 80, message: 'Generando partituras...' },
            { progress: 100, message: 'Transcripción completada!' }
        ];

        for (const step of steps) {
            await this.delay(1000);
            this.updateTranscriptionProgress(step.progress, step.message);
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

    updateTranscriptionProgress(progress, message) {
        // Actualizar UI con el progreso
        console.log(`Progreso: ${progress}% - ${message}`);
    }

    handleTranscriptionResult(result) {
        if (result.success) {
            this.showNotification('Transcripción completada exitosamente', 'success');
            
            // Actualizar estadísticas
            this.updateUserStats();
            
            // Navegar a la sección de resultados
            this.switchSection('library');
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
        if (!this.currentUser) return;

        try {
            // Cargar datos del usuario
            const userData = this.getStoredData('userData') || await this.fetchUserData();
            this.userData = userData;
            
            // Actualizar UI con datos del usuario
            this.updateUserInterface();
            
            // Cargar datos iniciales del dashboard
            if (this.currentSection === 'dashboard') {
                await this.loadDashboard();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async fetchUserData() {
        // Simular carga de datos del usuario
        await this.delay(1000);
        
        return {
            username: this.currentUser.username,
            joinDate: new Date().toISOString(),
            stats: {
                transcriptions: 24,
                projects: 5,
                downloads: 18,
                collaborations: 3
            },
            preferences: {
                genres: ['rock', 'jazz', 'classical'],
                autoSave: true,
                notifications: true
            },
            recentActivity: []
        };
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
            // En una implementación real, aquí se cargaría el avatar del usuario
            const fallback = avatar.querySelector('#avatar-fallback, #header-avatar-fallback');
            if (fallback) {
                fallback.textContent = this.userData?.username?.charAt(0).toUpperCase() || 'U';
            }
        });
    }

    updateUserStats() {
        const stats = this.userData?.stats;
        if (!stats) return;

        // Actualizar estadísticas en el sidebar
        const sidebarStats = {
            'sidebar-transcriptions': stats.transcriptions,
            'sidebar-projects': stats.projects
        };

        Object.entries(sidebarStats).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Actualizar estadísticas en el dashboard
        const dashboardStats = {
            'stat-transcriptions': stats.transcriptions,
            'stat-projects': stats.projects,
            'stat-downloads': stats.downloads,
            'stat-collaborations': stats.collaborations
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

        const activities = this.userData?.recentActivity || await this.generateSampleActivity();
        
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
                type: 'transcription',
                message: 'Transcribiste "Canción de ejemplo.mp3"',
                time: 'Hace 2 horas'
            },
            {
                type: 'project',
                message: 'Creaste el proyecto "Mi composición"',
                time: 'Ayer'
            },
            {
                type: 'download',
                message: 'Descargaste partituras de "Jazz Standard"',
                time: 'Hace 3 días'
            }
        ];
    }

    getActivityIcon(type) {
        const icons = {
            transcription: 'wave-square',
            project: 'project-diagram',
            download: 'download',
            collaboration: 'users'
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
    }

    async generateRecommendations() {
        return [
            {
                id: 1,
                icon: 'music',
                title: 'Jazz Standards',
                description: 'Partituras clásicas de jazz para practicar',
                meta: '12 canciones'
            },
            {
                id: 2,
                icon: 'users',
                title: 'Comunidad Rock',
                description: 'Únete a otros músicos de rock',
                meta: '245 miembros'
            },
            {
                id: 3,
                icon: 'graduation-cap',
                title: 'Tutorial: Lectura musical',
                description: 'Mejora tus habilidades de lectura',
                meta: '15 min'
            }
        ];
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
                user: 'María González',
                project: 'Composición para piano - "Amanecer"',
                likes: 24,
                comments: 8
            },
            {
                user: 'Carlos Rodríguez',
                project: 'Arreglo orquestal - Sinfonía Clásica',
                likes: 42,
                comments: 15
            }
        ];
    }

    async refreshRecommendations() {
        const refreshBtn = document.getElementById('refresh-recommendations');
        if (refreshBtn) {
            refreshBtn.classList.add('loading');
            await this.delay(1000); // Simular actualización
            await this.loadRecommendations();
            refreshBtn.classList.remove('loading');
            this.showNotification('Recomendaciones actualizadas', 'success');
        }
    }

    showOnboarding() {
        // Ocultar loading screen
        this.hideLoadingScreen();
        
        // Mostrar pantalla de onboarding
        // (Implementación simplificada - en producción sería más compleja)
        this.showQuickStartModal();
    }

    showQuickStartModal() {
        const modal = document.getElementById('quick-start-modal');
        if (modal) {
            modal.style.display = 'block';
            document.getElementById('modal-overlay').style.display = 'block';
        }
    }

    showMainApp() {
        // Ocultar loading screen con transición
        this.hideLoadingScreen();
        
        // Mostrar aplicación principal
        const app = document.getElementById('app');
        if (app) {
            app.classList.remove('hidden');
            app.classList.add('fade-in');
        }

        // Actualizar UI
        this.updateUserInterface();

        // Cargar sección actual
        this.loadSectionContent(this.currentSection);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, 500);
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
            username: 'Usuario',
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
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
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

    // Inicializar la aplicación
    window.transCoopeApp = new TransCoopeApp();
});

// Exportar para uso global (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransCoopeApp;
}
