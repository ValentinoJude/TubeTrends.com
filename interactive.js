class CreatorInteractions {
    static async saveCreator(creatorId) {
        if (!isLoggedIn()) {
            showLoginPrompt();
            return;
        }

        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                body: JSON.stringify({ creatorId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('Creator saved to favorites!');
                updateFavoriteButton(creatorId, true);
            }
        } catch (error) {
            console.error('Error saving creator:', error);
        }
    }

    static async followCreator(creatorId) {
        if (!isLoggedIn()) {
            showLoginPrompt();
            return;
        }

        try {
            const response = await fetch('/api/follows', {
                method: 'POST',
                body: JSON.stringify({ 
                    creatorId,
                    notificationPreferences: {
                        milestones: true,
                        uploads: true,
                        growth: true
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                showToast('Now following creator!');
                updateFollowButton(creatorId, true);
            }
        } catch (error) {
            console.error('Error following creator:', error);
        }
    }
} 