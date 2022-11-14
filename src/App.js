import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import SpotifyGetPlayLists from './SpotifyGetPlaylists';

function App() {
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  console.log('client id: ', CLIENT_ID);
  const REDIRECT_URI = 'http://localhost:3000';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
  const SCOPES = [];
  const RESPONSE_TYPE = 'token';

  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');
    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((element) => element.startsWith('access_token'))
        .split('=')[1];
      console.log(token);

      // window.location.hash = '';
      window.localStorage.setItem('token', token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const searchArtists = async (event) => {
    event.preventDefault();
    const { data } = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: 'artist',
      },
    });
    console.log(data);
    setArtists(data.artists.items);
    console.log('artists', artists);
  };

  const renderArtists = () => {
    console.log('renderArtist', artists);
    return artists.map((artist) => (
      <div key={artist.id}>
        {artist.images.length ? <img src={artist.images[0].url} /> : <div>No Image</div>}
        {artist.name}
      </div>
    ));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Spotify React</h1>
        {!token ? (
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {token ? (
          <form onSubmit={searchArtists}>
            <input type='text' onChange={(event) => setSearchKey(event.target.value)} />
            <button>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}
        {renderArtists()}
      </header>
      <SpotifyGetPlayLists token={token} />
    </div>
  );
}

export default App;
