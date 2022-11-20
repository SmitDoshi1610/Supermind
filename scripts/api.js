const github = {

    async fetchUserData(username) {

        try {
            const response = await fetch(`https://random-data-api.com/api/users/random_user?size=3`, {
                headers: {
            }
            
        });
            return await response.json();
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    async fetchMetaData(username) {
        try {
            const response = await fetch(`https://random-data-api.com/api/users/random_user?size=3`, {
                headers: {
            }
        });
            return await response.json();
        } catch (error) {
            console.log(error);
            return error;
        }
    },
}

export default github;