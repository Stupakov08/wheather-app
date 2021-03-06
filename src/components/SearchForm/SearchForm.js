import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import SearchInput from '../shared/SearchInput/SearchInput';
import ImageButton from '../shared/ImageButton/ImageButton';
import {
	findLocation,
	clearLocations,
} from '../../redux/search/search.actions';
import Suggestion from '../Suggestions/Suggestions';
import { ReactComponent as Search } from '../../assets/search.svg';
import { ReactComponent as Location } from '../../assets/location.svg';
import { debounce } from '../../utils/index';
import dataProvider from '../../dataProviders/index';
import { useHistory } from 'react-router-dom';
import './SearchForm.scss';

const SearchForm = ({ findLocation, clearLocations }) => {
	const [search, setSearch] = useState('');
	const [touched, setTouched] = useState(false);
	const history = useHistory();

	const inputChange = (e) => {
		setSearch(e.target.value);
		!touched && setTouched(true);
	};

	const debouncedCall = useCallback(
		debounce((s) => s.length > 2 && findLocation(s), 500),
		[findLocation]
	);

	const formSubmit = (e) => {
		e.preventDefault();
		debouncedCall(search);
	};

	const useCurrentLocation = () => {
		dataProvider.geo.getCurrentLocation().then((coord) => {
			history.push(`/${coord.lon}/${coord.lat}`);
			clearLocations();
		});
	};

	useEffect(() => {
		debouncedCall(search);
		!search && touched && clearLocations();
	}, [search, touched, debouncedCall, clearLocations]);

	return (
		<form action='get' className='c-paper c-search' onSubmit={formSubmit}>
			<SearchInput type='text' value={search} onChange={inputChange} />
			<ImageButton type='submit' title='Search'>
				<Search />
			</ImageButton>
			<div className='c-search__devider'></div>
			<ImageButton title='Use my location' onClick={useCurrentLocation}>
				<Location />
			</ImageButton>
			<Suggestion />
		</form>
	);
};

const mapDispatchToProps = (dispatch) => ({
	findLocation: (s) => dispatch(findLocation(s)),
	clearLocations: () => dispatch(clearLocations()),
});

export default connect(null, mapDispatchToProps)(SearchForm);
