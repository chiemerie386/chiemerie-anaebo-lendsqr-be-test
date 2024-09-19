import axios from 'axios';

class BlacklistService { 
    private apiKey: string;
    private apiBaseUrl: string; 

    constructor(apiKey: string | undefined) {
        if (!apiKey) {
            throw new Error('API key is required');
        }
        this.apiKey = apiKey;
        this.apiBaseUrl = 'https://adjutor.lendsqr.com/v2'; 
    }

    // Method to check if an email is on the blacklist
    async checkBlacklistStatus(email: string): Promise<boolean> { 
        const requestUrl = `${this.apiBaseUrl}/verification/karma/${encodeURIComponent(email)}`; 
        try {
            const response = await axios.get(requestUrl, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const userData = response.data?.data; 
            return !!userData; 
        } catch (error: any) { 
            if (
                error.response?.status === 404 &&
                error.response?.data?.message === 'Identity not found in karma'
            ) {
                return false;
            }

            console.error('Error in checkBlacklistStatus:', error.message || error);
            throw error;
        }
    }
}

export default new BlacklistService(process.env.ADJUTOR_SECRET_KEY); 
