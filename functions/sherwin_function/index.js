module.exports = async (context, req, res) => {
    console.log('=== CATALYST FUNCTION CALLED ===');
    
    // CORS HEADERS - ADD THESE LINES
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        console.log('Handling OPTIONS preflight');
        return res.status(200).end();
    }
    
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: 'Message is required'
            });
        }

        console.log('Received message:', message);
        
        // Simple response
        const response = `Hello! I received: "${message}". The AI chat is working!`;
        
        return res.status(200).json({
            response: response,
            success: true,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Function error:', error);
        return res.status(500).json({
            error: 'Something went wrong',
            details: error.message
        });
    }
};
