let _places = [];
let _lastLocation = null;
let _searchResults = [];
let _needsRefresh = false; 
let _savedPlaces = [];// ✅ New refresh flag

const SharedData = {
    setPlaces: (places) => {
      _places = places;
      _needsRefresh = true;
    },
    getPlaces: () => {
      return Array.isArray(_places) ? _places : [];
    },
    clearPlaces: () => {
      _places = [];
    },
  
    setLastLocation: (location) => {
      _lastLocation = location;
    },
    getLastLocation: () => {
      return _lastLocation;
    },
    clearLastLocation: () => {
      _lastLocation = null;
    },
  
    setSearchResults: (results) => {
      _searchResults = results;
    },
    getSearchResults: () => {
      return _searchResults;
    },
    clearSearchResults: () => {
      _searchResults = [];
    },
  
    setSavedPlaces: (places) => {
      _savedPlaces = places;
    },
    getSavedPlaces: () => {
      return Array.isArray(_savedPlaces) ? _savedPlaces : [];
    },
  
    consumeRefreshFlag: () => {
      const current = _needsRefresh;
      _needsRefresh = false;
      return current;
    },
    forceRefresh: () => {
      _needsRefresh = true;
    }
  };

  export default SharedData;
