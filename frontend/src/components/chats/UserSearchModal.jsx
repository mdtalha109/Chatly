import React from 'react';
import { Modal, Button, Input } from '../ui';
import { Search } from 'lucide-react';
import { IoCloseCircle } from 'react-icons/io5';
import UserListItem from './UserListItem';



const NoResultsState = () => (
  <div className="text-center py-8 text-slate-500">
    <div className="text-lg mb-2">No users found</div>
    <div className="text-sm">Try searching with a different username</div>
  </div>
);


const LoadingState = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);


const EmptySearchState = () => (
  <div className="text-center py-8 text-slate-400">
    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
    <div className="text-sm">Start typing to search for users</div>
  </div>
);

const UserSearchModal = ({ isOpen, onClose, userSearchHook }) => {
  const {
    searchText,
    setSearchText,
    searchResults,
    isLoading,
    handleSearch,
    createOrAccessChat
  } = userSearchHook;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (!searchText && !isLoading) {
      return <EmptySearchState />;
    }

    if (searchResults.length === 0 && searchText && !isLoading) {
      return <NoResultsState />;
    }

    return searchResults.map((user) => (
      <UserListItem
        key={user._id}
        user={user}
        handleFunction={() => createOrAccessChat(user._id)}
      />
    ));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      closeOverlay={true} 
      width="w-full max-w-lg"
    >
      <Modal.Header>
        <div className="flex items-center justify-between">
          <span>Search Users</span>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-1 ml-auto"
            aria-label="Close search"
          >
            <IoCloseCircle className="w-5 h-5" />
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Search by username..."
              className="flex-1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <Button
              onClick={handleSearch}
              className="px-6"
              aria-label="Search"
              disabled={isLoading}
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {renderSearchResults()}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserSearchModal;