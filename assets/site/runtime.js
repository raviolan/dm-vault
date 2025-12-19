// DM runtime namespace and config
(function() {
  window.DM = window.DM || {};
  window.DM.config = {
    apiCreatePage: '/api/create-page',
    apiDeletePage: '/api/delete-page',
    searchIndex: '/search-index.json',
    notesJson: '/notes.json',
    redirectDashboard: '/index.html',
    searchPage: '/search.html',
  };
  window.DM.keys = {
    createPageForm: 'createPageForm',
    createPageStatus: 'createPageStatus',
    deletePageForm: 'deletePageForm',
    deletePageConfirm: 'deletePageConfirm',
    deletePageStatus: 'deletePageStatus',
    searchBox: 'searchBox',
    searchResults: 'searchResults',
    btnEditPage: 'btnEditPage',
    editPageModal: 'editPageModal',
    editPageContent: 'editPageContent',
    saveSession: 'saveSession',
    bookmarkPage: 'bookmarkPage',
    topBar: 'top',
  };
})();
