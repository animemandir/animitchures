import { useEffect } from 'react';

import './Results.css';

import Card from 'components/Card';

import { useStateValue } from 'context';
import { SEARCH_QUERY } from 'utils';
import { api } from 'api';

function Results({ location }: any) {
  const [{ results, user }, dispatch] = useStateValue();
  const search = location.search;
  const params = new URLSearchParams(search);
  const query = params.get('search');

  const getSearchResults = async (searchQuery: string) => {
    const { data } = await api.fetch({
      query: SEARCH_QUERY,
      variables: {
        search: searchQuery,
        type: 'ANIME',
        isAdult: user?.isAdult || false,
      },
    });

    console.log(data);

    dispatch({
      type: 'set_results',
      results: data.Page.media,
    });
  };

  useEffect(() => {
    if (query) getSearchResults(query);
    return () => {
      dispatch({
        type: 'set_results',
        results: null,
      });
    };
  }, [query]);

  return (
    <div className="results">
      {results?.length > 0 && (
        <div className="results__container">
          {results?.map((mediaItem: any) => (
            <Card key={mediaItem.id} {...mediaItem} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Results;
