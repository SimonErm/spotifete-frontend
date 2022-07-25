import React, { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import { FullListeningSession, SongRequest, TrackMetaData } from '../generated/models';
import useSpotifeteApi from '../hooks/useSpotifeteApi';

export interface SessionState {
  session?: FullListeningSession;
  queue: Array<SongRequest>;
}

const Session: FC<any> = () => {
  const [state, setState] = useState<SessionState>({ session: undefined, queue: [] });
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [searchResult, setSearchResult] = useState<TrackMetaData[]>([]);
  const { sessionsApi } = useSpotifeteApi();
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const username = Date.now().toString(36) + Math.random().toString(36);

  const getListeningSession = useCallback(
    async (sessionId: string) => {
      try {
        const session = await sessionsApi.getListeningSession({ joinId: sessionId });
        setState((prevState) => ({ ...prevState, session: session }));
      } catch (e) {
        //TODO: typing for error
        if (e.status === 404) {
          navigate('/404');
        }

        //TODO: handle error
      }
    },
    [navigate, sessionsApi]
  );

  const getQueue = useCallback(
    async (sessionId: string) => {
      try {
        const queue = await (await sessionsApi.getSessionQueue({ joinId: sessionId })).queue;
        if (queue) {
          setState((prevState) => ({ ...prevState, queue: queue }));
        }
      } catch (e) {
        console.log(e);
      }
    },
    [sessionsApi]
  );

  useEffect(() => {
    if (!sessionId) {
      navigate('/404');
      return;
    }

    getListeningSession(sessionId);
    getQueue(sessionId);
    const intervallId = setInterval(() => getQueue(sessionId), 5000);
    return () => clearInterval(intervallId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sessionName = state.session?.title;
    if (sessionName) {
      document.title = `Spotifete - ${sessionName}`;
    }
  }, [state.session]);

  const searchTrack = useCallback(
    async (searchTerm: string) => {
      if (!sessionId) {
        return;
      }

      try {
        const searchResponse = await sessionsApi.searchTrack({ joinId: sessionId, query: searchTerm });
        if (searchResponse?.tracks) {
          setSearchResult(searchResponse.tracks);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [sessionsApi, sessionId]
  );

  useEffect(() => {
    if (!searchTerm) {
      setSearchResult([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchTrack(searchTerm);
      // make a request after 1 second since there's no typing
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTrack, searchTerm]);

  const handleSearchInput = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchedTrackClick = useCallback(
    async (track: TrackMetaData) => {
      if (!sessionId || !track.spotifyTrackId) {
        return;
      }

      try {
        await sessionsApi.requestTrack({
          joinId: sessionId,
          requestTrackRequest: { username: username, trackId: track.spotifyTrackId },
        });
        getQueue(sessionId);
      } catch (e) {
        console.log(e);
      }
      setSearchResult([]);
    },
    [sessionsApi, sessionId, username, getQueue]
  );

  const { queue } = state;
  const currentTrack = queue[0];
  const upcomingTrack = queue[1];
  const queuedTracks = queue.filter(
    (track) =>
      track.spotifyTrackId !== currentTrack.spotifyTrackId && track.spotifyTrackId !== upcomingTrack.spotifyTrackId
  );

  return (
    <div className="flex flex-row items-start pt-2 pl-2 w-auto h-full">
      <div className="flex flex-1 items-start pt-2 pl-2 h-full row">
        <Card className="flex flex-col w-full h-full">
          <div className="pb-2 font-bold text-green-500 text-l">Search</div>
          <Input onChange={handleSearchInput} />
          <div className="overflow-scroll h-full">
            {searchResult.map((track) => (
              <div
                className="flex flex-row items-start px-2 mb-1 cursor-pointer hover:text-green-500"
                key={`search_result_${track.spotifyTrackId}`}
                onClick={() => handleSearchedTrackClick(track)}
              >
                <img className="mt-1 mr-1 md:w-14" src={track.albumImageThumbnailUrl} alt="" />
                <div className="flex flex-col pl-2 mt-auto grow-0">
                  <div className="flex flex-row">
                    <div className="font-bold">{`${track.artistName} - ${track.trackName}`}</div>
                  </div>
                  <div>{track.albumName}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="flex overflow-hidden flex-row flex-1 items-start pt-2 pl-2">
        <Card className="flex flex-col">
          <div className="pb-2 font-bold text-green-500 text-l">Current Title</div>
          {currentTrack?.trackMetadata ? (
            <>
              <img
                className="mb-auto md:w-32"
                src={currentTrack.trackMetadata.albumImageThumbnailUrl}
                alt=""
                width="384"
                height="512"
              />
              <div className="flex flex-col pt-2 pl-2 grow-0 shrink-1">
                <div className="flex flex-row pt-2">
                  <div className="font-bold">{`${currentTrack.trackMetadata.artistName} - ${currentTrack.trackMetadata.trackName}`}</div>
                </div>
                <div>{currentTrack.trackMetadata?.albumName}</div>
              </div>
            </>
          ) : (
            <></>
          )}
        </Card>
        <div className="flex flex-col items-start w-full">
          <Card className="flex flex-col pb-1 ml-3 w-full grow-0">
            <div className="pb-2 font-bold text-green-500 text-l">Coming up</div>
            {upcomingTrack?.trackMetadata ? (
              <div className="flex flex-row items-start">
                <img className="mt-1 mr-1 md:w-14" src={upcomingTrack.trackMetadata.albumImageThumbnailUrl} alt="" />
                <div className="flex flex-col pl-2 mt-auto grow-0">
                  <div className="flex flex-row">
                    <div className="font-bold">{`${upcomingTrack.trackMetadata.artistName} - ${upcomingTrack.trackMetadata.trackName}`}</div>
                  </div>
                  <div>{upcomingTrack.trackMetadata?.albumName}</div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </Card>
          <Card className="flex flex-col pb-1 mt-1 ml-3 w-full grow-0">
            <div className="pb-2 font-bold text-green-500 text-l">Queue</div>
            {queuedTracks.map((track) => (
              <div className="flex flex-row items-start mb-1" key={`track_details_${track.spotifyTrackId}`}>
                <img className="mt-1 mr-1 md:w-14" src={track.trackMetadata?.albumImageThumbnailUrl} alt="" />
                <div className="flex flex-col pl-2 mt-auto grow-0">
                  <div className="flex flex-row">
                    <div className="font-bold">{`${track.trackMetadata?.artistName} - ${track.trackMetadata?.trackName}`}</div>
                  </div>
                  <div>{track.trackMetadata?.albumName}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Session;
