import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SPOTIFY_API = 'https://api.spotify.com';
const PLAYLISTS_ENDPOINT = `${SPOTIFY_API}/v1/me/playlists`;

const DisplayPlaylist = (props) => {
  return (
    <iframe
      title={props.playlistName}
      style={{ borderRadius: '12px' }}
      src={`https://open.spotify.com/embed/playlist/${props.playlistId}?utm_source=generator`}
      width='40%'
      height='380'
      frameBorder='0'
      allowfullscreen=''
      allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
      loading='lazy'
    ></iframe>
  );
};

const SpotifyGetPlayLists = (props) => {
  //   const [token, setToken] = useState('');
  const [playlists, setPlaylists] = useState([]);

  //   useEffect(() => {
  //     if (localStorage.getItem('token')) {
  //       setToken(localStorage.getItem('token'));
  //     }
  //   }, []);

  const handleGetPlaylist = async () => {
    try {
      const response = await axios.get(PLAYLISTS_ENDPOINT, {
        headers: {
          Authorization: 'Bearer ' + props.token,
        },
      });
      const data = response.data;
      setPlaylists(data.items);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleGetPlaylist}>Get Playlists</button>
      {playlists.map((playlist) => (
        <li>
          <DisplayPlaylist playlistId={playlist.id} playlistName={playlist.name} />
        </li>
      ))}
    </div>
  );
};

export default SpotifyGetPlayLists;
