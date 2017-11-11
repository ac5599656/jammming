import React, { Component } from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        searchResult:[],
        playlistName: 'My playlist',
        playlistTracks: []
        
    };
     this.addTrack = this.addTrack.bind(this); 
     this.removeTrack = this.removeTrack.bind(this);
     this.updatePlaylistName = this.updatePlaylistName.bind(this); 
     this.savePlaylist = this.savePlaylist.bind(this);    
     this.search = this.search.bind(this);      
   }
    addTrack(track) {
    let tracks = this.state.playlistTracks;    
      if(!tracks.includes(track)){   
        tracks.push(track);
    
       this.setState({playlistTracks:tracks});
      }  
   }
   
   removeTrack(track){
    let tracks = this.state.playlistTracks;   
    tracks = tracks.filter(playlistTrack => playlistTrack.id !== track.id)
    this.setState({
        playlistTracks: tracks
    });   
    
   }
   updatePlaylistName(name){
       this.setState({
           playlistName:name
       
       });
   }
   
    savePlaylist(){
        
        const trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>
        {                                                              
        this.setState({
          playlistName:'My playlist',
          playlistTracks:[]
        });
       
        console.info(trackURIs);
        
        })
    }
    
  
  search(term) {
    Spotify.search(term).then((tracks)=> {
        this.setState({ searchResult: tracks})
    })
    
  }
      
    
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResult={this.state.searchResult} onAdd={this.addTrack}/>
             <Playlist 
                name={this.state.playlistName} 
                tracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave= {this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}
export default App;