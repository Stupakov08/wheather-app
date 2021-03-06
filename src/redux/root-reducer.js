import { combineReducers } from 'redux';
import searchReducer from './search/search.reducer';
import detailsReducer from './details/details.reducer';
import savedReducer from './saved/saved.reducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const savedPersistConfig = {
	key: 'savedWeatherApp',
	storage,
};

const rootReducer = combineReducers({
	search: searchReducer,
	saved: persistReducer(savedPersistConfig, savedReducer),
	details: detailsReducer,
});

export default rootReducer;
