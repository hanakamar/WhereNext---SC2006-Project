let _places = [];
let _lastLocation = null;
let _searchResults = [];
let _needsRefresh = false; // ✅ New refresh flag

const SharedData = {
  // Store and retrieve food places (Map2 → Catalogue)
  setPlaces: (places) => {
    _places = places;
    _needsRefresh = true; // ✅ Trigger refresh
  },
  getPlaces: () => {
    return Array.isArray(_places) ? _places : [];
  },
  clearPlaces: () => {
    _places = [];
  },

  // Store and retrieve last searched map region
  setLastLocation: (location) => {
    _lastLocation = location;
  },
  getLastLocation: () => {
    return _lastLocation;
  },
  clearLastLocation: () => {
    _lastLocation = null;
  },

  // Optional: Shared search results state
  setSearchResults: (results) => {
    _searchResults = results;
  },
  getSearchResults: () => {
    return _searchResults;
  },
  clearSearchResults: () => {
    _searchResults = [];
  },

  // ✅ Refresh Flag Methods
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
