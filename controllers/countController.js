import fetch from 'node-fetch';

export const getFollowers = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username is required' });
    }

    const profileUrl = `https://www.instagram.com/${username}/`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.RAPIDAPI_HOST,
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(
            `https://instagram-statistics-api.p.rapidapi.com/community?url=${encodeURIComponent(profileUrl)}`,
            options
        );

        if (!response.ok) {
            return res.status(response.status).json({ success: false, message: 'RapidAPI request failed' });
        }

        const data = await response.json();

        // Extract exact follower count from the API response
        const followers = data?.data?.usersCount ?? null;

        if (followers === null) {
            return res.status(404).json({ success: false, message: 'Could not extract follower count' });
        }

        return res.status(200).json({
            success: true,
            username,
            followers,          
            rawData: data,      
        });

    } catch (error) {
        console.error('Error fetching Instagram data:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};