const clientId = '3fdb6250c1d344bcb729d51d0ef0f3ef';
const redirectUri = 'http://uptight-sink.surge.sh/';
const spotifyUrl =  `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
let accessToken = "";



const Spotify = {
    
  getAccessToken (){
      
      if (accessToken) {
       return accessToken;
      }    
      const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch= window.location.href.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
          accessToken = accessTokenMatch[1];
          const expiresIn = Number(expiresInMatch[1]);
          window.setTimeout(() => accessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return accessToken;
      } else {
        console.log('Error retrieving spotify API');       
       window.location = spotifyUrl;
      } 
  },

   search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          
        }));
      });
  },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
        return;
    }
  
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userId = "";
   
   return fetch('https://api.spotify.com/v1/me', {
      headers: headers 
    })
    .then(response => response.json())
    .then(jsonResponse =>{ 
       userId = jsonResponse.id;
       return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: name
          })
        }).then(response => response.json()
        ).then(jsonResponse => {
          const playlistId = jsonResponse.id
          fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: trackURIs
            })
          });
        });
    });
  }
};


export default Spotify;
