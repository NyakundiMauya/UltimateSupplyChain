console.log('authUtils loaded');  // Add this line

export const getAuthDataFromCache = async () => {
    console.log('Attempting to retrieve auth data from cache');
    if ('caches' in window) {
        try {
            const cache = await caches.open('auth-cache');
            console.log('Cache opened:', cache);
            const response = await cache.match('auth-data');
            console.log('Cache response:', response);
            if (response) {
                const data = await response.json();
                console.log('Auth data from cache:', data);
                return data;
            } else {
                console.log('No auth data found in cache');
            }
        } catch (error) {
            console.error('Error retrieving auth data from cache:', error);
        }
    } else {
        console.log('Cache API not available');
    }
    return null;
};

export const clearAuthCache = async () => {
    if ('caches' in window) {
        try {
            const cache = await caches.open('auth-cache');
            await cache.delete('auth-data');
            console.log('Auth cache cleared');
        } catch (error) {
            console.error('Error clearing auth cache:', error);
        }
    } else {
        console.log('Cache API not available');
    }
};

// Add this new function
export const isAuthenticated = async () => {
  console.log('Checking authentication status...');
  try {
    const authData = await getAuthDataFromCache();
    console.log('Auth data for authentication check:', authData);
    const isAuth = authData !== null && authData.token !== undefined;
    console.log('Is authenticated:', isAuth);
    return isAuth;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

// Add this new function
export const setAuthDataInCache = async (authData) => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('auth-cache');
      await cache.put('auth-data', new Response(JSON.stringify(authData)));
      console.log('Auth data cached successfully');
    } catch (error) {
      console.error('Error caching auth data:', error);
    }
  } else {
    console.log('Cache API not available');
  }
};
