import { useState } from 'react';
import './Hero.css';
import {
  SentimentVerySatisfied,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfiedAlt,
  Remove,
  Add,
  ArtTrack,
} from '@mui/icons-material';
import { useStateValue } from 'context';
import { watchlistActions } from 'actions';
import { useHistory } from 'react-router-dom';

interface IData {
  [key: string]: any;
}

const getScoreStatus = (score: number) => {
  if (score >= 90) return <SentimentVerySatisfied htmlColor="lightgreen" />;
  else if (score >= 75 && score < 90) return <SentimentSatisfiedAlt htmlColor="lightgreen" />;
  else if (score >= 60 && score < 75) return <SentimentNeutral htmlColor="orange" />;
  else if (score >= 25 && score < 60) return <SentimentDissatisfied htmlColor="red" />;
  else return <SentimentVeryDissatisfied htmlColor="red" />;
};

function Hero({ trending }: any) {
  const [{ user, watchlist }, dispatch] = useStateValue();
  const [featured] = useState(trending?.media.slice(0, 3));
  const [selected, setSelected] = useState(trending?.media[0]);
  const history = useHistory();

  return (
    <div className="hero">
      {selected && (
        <div
          className="hero__banner"
          style={{
            backgroundImage: `url(${
              selected.bannerImage ? selected.bannerImage : selected.coverImage.extraLarge
            })`,
          }}
        >
          <div className="hero__bannerBody">
            <div className="hero__column">
              <div className="hero__row">
                {selected.averageScore && (
                  <div className="hero__score">
                    {getScoreStatus(selected.averageScore)}{' '}
                    <span>{`${selected.averageScore}%`}</span>
                  </div>
                )}
              </div>
              <div className="hero__row hero__column">
                <div className="hero__rowBottom">
                  <h1
                    onClick={() =>
                      history.push(
                        `/anime/${selected.id}/${encodeURIComponent(
                          selected.title.userPreferred.replace(/,?[ ]/g, '-').toLowerCase(),
                        )}`,
                      )
                    }
                  >
                    {selected.title.english ? selected.title.english : selected.title.userPreferred}
                  </h1>
                  <div className="hero__tags">
                    {selected.genres.map((genre: string, index: number) => (
                      <div key={`${genre}__${index}`} className="hero__tag">
                        {genre}
                      </div>
                    ))}
                  </div>
                  <div className="hero__actions">
                    {user && (
                      <>
                        {watchlist.filter(({ id }: IData) => id === selected.id).length > 0 ? (
                          <button
                            onClick={() =>
                              watchlistActions.removeItemFromWatchlist(selected, user.uid, dispatch)
                            }
                          >
                            <Remove />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              watchlistActions.addItemToWatchlist(selected, user.uid, dispatch)
                            }
                          >
                            <Add />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="hero__column">
              <div className="hero__row"></div>
              <div className="hero__row hero__column">
                <div className="hero__rowBottom">
                  <div className="hero__selectGroup">
                    {featured.map((item: any) => (
                      <div
                        key={item.id}
                        className={`hero__selectItem ${selected.id === item.id && 'active'}`}
                        onClick={() => setSelected(item)}
                        style={{
                          backgroundImage: `url(${
                            item.bannerImage ? item.bannerImage : item.coverImage.extraLarge
                          })`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
