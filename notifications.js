class NotificationSystem {
    constructor() {
        this.checkPermission();
        this.initializeWebSocket();
    }

    async checkPermission() {
        if (Notification.permission !== 'granted') {
            await Notification.requestPermission();
        }
    }

    initializeWebSocket() {
        this.ws = new WebSocket('wss://your-websocket-server.com');
        this.ws.onmessage = (event) => this.handleNotification(JSON.parse(event.data));
    }

    handleNotification(data) {
        // Create browser notification
        new Notification(data.title, {
            body: data.message,
            icon: data.icon
        });

        // Add to notification center
        this.addToNotificationCenter(data);
    }

    addToNotificationCenter(notification) {
        const notificationList = document.querySelector('.notification-list');
        const notificationElement = document.createElement('div');
        notificationElement.className = 'notification-item';
        notificationElement.innerHTML = `
            <div class="notification-content">
                <h6>${notification.title}</h6>
                <p>${notification.message}</p>
                <small>${new Date().toLocaleString()}</small>
            </div>
        `;
        notificationList.prepend(notificationElement);
    }
} 